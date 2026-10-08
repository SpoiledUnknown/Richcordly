import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

export interface CustomThemeData {
  name: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
}

export interface AppSettings {
  launchOnStartup: boolean
  startMinimized: boolean
  keepPresenceOnClose: boolean
  closeAction: 'Minimize to background tray' | 'Quit desktop client completely' | 'Prompt on close'
  theme: string
  customTheme?: CustomThemeData
  shaderIntensity: number
  blurDensity: number
  reduceMotion: boolean
  ipcPipe: string
  customClientId: string
  autoReconnect: boolean
  pingInterval: number
  processDetectionEnabled: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  launchOnStartup: true,
  startMinimized: false,
  keepPresenceOnClose: true,
  closeAction: 'Minimize to background tray',
  theme: 'Nocturnal Precision (Dark Navy + Violet)',
  customTheme: {
    name: 'Nocturnal Precision',
    primaryColor: '#8b5cf6',
    accentColor: '#38bdf8',
    backgroundColor: '#070b14'
  },
  shaderIntensity: 65,
  blurDensity: 16,
  reduceMotion: false,
  ipcPipe: 'Auto-detect (/pipe/discord-ipc-0)',
  customClientId: '',
  autoReconnect: true,
  pingInterval: 15,
  processDetectionEnabled: true
}

class SettingsService {
  private getSettingsPath(): string {
    return path.join(app.getPath('userData'), 'settings.json')
  }

  public loadSettings(): AppSettings {
    try {
      const filePath = this.getSettingsPath()
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const parsed = JSON.parse(raw)
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          customTheme: {
            ...DEFAULT_SETTINGS.customTheme,
            ...(parsed.customTheme || {})
          }
        }
      }
    } catch (err) {
      console.warn('[SettingsService] Failed to load settings:', err)
    }
    return { ...DEFAULT_SETTINGS }
  }

  public saveSettings(settings: AppSettings): boolean {
    try {
      const filePath = this.getSettingsPath()
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8')

      // Apply OS-level startup setting if packaged
      try {
        if (app.isPackaged) {
          app.setLoginItemSettings({
            openAtLogin: !!settings.launchOnStartup,
            path: process.execPath,
            args: settings.startMinimized ? ['--hidden'] : []
          })
        }
      } catch (e) {
        console.warn('[SettingsService] Could not set login item settings:', e)
      }

      return true
    } catch (err) {
      console.error('[SettingsService] Failed to save settings:', err)
      return false
    }
  }
}

export const settingsService = new SettingsService()
