import { RichcordClient, type Activity, type ActivityButton } from 'richcord'
import { BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface DiscordUser {
  readonly id: string
  readonly username: string
  readonly discriminator: string
  readonly avatar: string | null
  readonly flags?: number
}

export interface ActivityPayload {
  details?: string
  state?: string
  largeImageKey?: string
  largeImageText?: string
  smallImageKey?: string
  smallImageText?: string
  startTime?: number | null
  endTime?: number | null
  partyId?: string
  partySize?: number
  partyMax?: number
  buttons?: Array<{ label: string; url: string }>
}

export interface CliConfigData {
  clientId?: string
  autoReconnect?: boolean
  activity?: {
    details?: string
    state?: string
    timestamps?: { start?: number; end?: number }
    assets?: {
      largeImage?: string
      largeText?: string
      smallImage?: string
      smallText?: string
    }
    buttons?: Array<{ label: string; url: string }>
  }
}

export function getCliConfigPath(): string {
  const platform = os.platform()
  const home = os.homedir()
  if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming')
    return path.join(appData, 'Richcord', 'config.json')
  } else if (platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'Richcord', 'config.json')
  } else {
    const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, '.config')
    return path.join(xdgConfig, 'richcord', 'config.json')
  }
}

export function readCliConfig(): CliConfigData | null {
  try {
    const configPath = getCliConfigPath()
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8')
      const parsed = JSON.parse(content)
      return {
        clientId: parsed?.config?.clientId || '',
        autoReconnect: parsed?.config?.autoReconnect,
        activity: parsed?.activity
      }
    }
  } catch (err) {
    console.warn('[RichcordService] Failed reading CLI config:', err)
  }
  return null
}

function parseTimestamp(val?: number | null): Date | undefined {
  if (!val || typeof val !== 'number' || isNaN(val) || val <= 0) return undefined
  const ms = val < 10000000000 ? val * 1000 : val
  return new Date(ms)
}

class RichcordService {
  private client: RichcordClient | null = null
  private currentClientId: string | null = null
  private lastPayload: ActivityPayload | null = null

  public getCliConfig(): CliConfigData | null {
    return readCliConfig()
  }

  public getStatus(): {
    isConnected: boolean
    user: DiscordUser | null
    clientId: string | null
  } {
    return {
      isConnected: this.client ? this.client.isConnected() : false,
      user: this.client ? (this.client.user as DiscordUser | null) : null,
      clientId: this.currentClientId
    }
  }

  public async connect(clientId: string, autoReconnect = true): Promise<DiscordUser | null> {
    if (this.client && this.client.isConnected() && this.currentClientId === clientId) {
      return this.client.user as DiscordUser | null
    }

    if (this.client) {
      await this.disconnect()
    }

    this.currentClientId = clientId
    this.client = new RichcordClient({
      clientId,
      autoReconnect,
      reconnectIntervalMs: 5000
    })

    this.client.on('ready', (user) => {
      this.broadcastStatus(true, user as DiscordUser)
    })

    this.client.on('disconnected', () => {
      this.broadcastStatus(false, null)
    })

    this.client.on('error', (err) => {
      console.warn('[RichcordService] Client error:', err.message)
      this.broadcastError(err.message)
    })

    try {
      const user = await this.client.connect()
      this.broadcastStatus(true, user as DiscordUser)
      return user as DiscordUser
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err)
      const message = raw.includes('timed out waiting for READY')
        ? 'Discord rejected Client ID (Invalid Client ID 4000) or Discord is not running.'
        : raw
      console.warn('[RichcordService] Could not connect to Discord:', message)
      this.broadcastError(message)
      this.broadcastStatus(false, null)
      return null
    }
  }

  public async setActivity(payload: ActivityPayload): Promise<boolean> {
    if (!this.client || !this.client.isConnected()) {
      return false
    }

    let buttons: readonly [ActivityButton, ActivityButton?] | undefined
    if (payload.buttons && payload.buttons.length > 0) {
      const valid = payload.buttons
        .filter((b) => b.label?.trim() && b.url?.trim())
        .map((b) => ({ label: b.label.trim(), url: b.url.trim() }))
        .slice(0, 2)
      if (valid.length === 1) {
        buttons = [valid[0]]
      } else if (valid.length >= 2) {
        buttons = [valid[0], valid[1]]
      }
    }

    const activity: Activity = {
      ...(payload.details?.trim() ? { details: payload.details.trim() } : {}),
      ...(payload.state?.trim() ? { state: payload.state.trim() } : {}),
      ...(payload.largeImageKey || payload.smallImageKey
        ? {
            assets: {
              largeImage: payload.largeImageKey?.trim() || undefined,
              largeText: payload.largeImageText?.trim() || undefined,
              smallImage: payload.smallImageKey?.trim() || undefined,
              smallText: payload.smallImageText?.trim() || undefined
            }
          }
        : {}),
      ...(payload.startTime || payload.endTime
        ? {
            timestamps: {
              start: parseTimestamp(payload.startTime),
              end: parseTimestamp(payload.endTime)
            }
          }
        : {}),
      ...(payload.partyId && payload.partySize && payload.partyMax
        ? {
            party: {
              id: payload.partyId,
              size: [payload.partySize, payload.partyMax] as const
            }
          }
        : {}),
      ...(buttons ? { buttons } : {})
    }

    try {
      await this.client.setActivity(activity)
      this.lastPayload = { ...payload }
      return true
    } catch (err) {
      console.error('[RichcordService] Failed to set activity:', err)
      throw err
    }
  }

  public async restoreLastActivity(): Promise<boolean> {
    if (this.lastPayload && this.client && this.client.isConnected()) {
      try {
        return await this.setActivity(this.lastPayload)
      } catch (err) {
        console.warn('[RichcordService] Failed to restore activity:', err)
      }
    }
    return false
  }

  public async clearActivity(): Promise<boolean> {
    if (!this.client || !this.client.isConnected()) {
      return false
    }
    try {
      await this.client.clearActivity()
      return true
    } catch (err) {
      console.error('[RichcordService] Failed to clear activity:', err)
      throw err
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.disconnect()
      } catch (err) {
        console.warn('[RichcordService] Error during disconnect:', err)
      }
      this.client = null
      this.currentClientId = null
      this.broadcastStatus(false, null)
    }
  }

  private broadcastStatus(isConnected: boolean, user: DiscordUser | null): void {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('richcord-status-changed', {
          isConnected,
          user,
          clientId: this.currentClientId
        })
      }
    })
  }

  private broadcastError(message: string): void {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('richcord-error', { message })
      }
    })
  }
}

export const richcordService = new RichcordService()
