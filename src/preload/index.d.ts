import { ElectronAPI } from '@electron-toolkit/preload'

export interface DiscordUserData {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  flags?: number
}

export interface RichcordStatusData {
  isConnected: boolean
  user: DiscordUserData | null
  clientId: string | null
}

export interface ActivityPayloadData {
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

export interface CustomThemeData {
  name: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
}

export interface SettingsData {
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
}

export interface ReleaseAssetData {
  name: string
  downloadUrl: string
  size: number
}

export interface ReleaseItemData {
  tag: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

export interface UpdateCheckResultData {
  hasUpdate: boolean
  currentVersion: string
  latestVersion: string
  releaseName: string
  releaseUrl: string
  releaseNotes: string
  publishedAt: string
  channel: string
  checkedAt: string
  assets: ReleaseAssetData[]
  history: ReleaseItemData[]
  githubApiAllowed: boolean
  error?: string | null
}

export interface CustomAPI {
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  openExternal: (url: string) => void
  settingsLoad: () => Promise<SettingsData>
  settingsSave: (settings: SettingsData) => Promise<boolean>
  richcordConnect: (clientId: string, autoReconnect?: boolean) => Promise<DiscordUserData | null>
  richcordSetActivity: (payload: ActivityPayloadData) => Promise<boolean>
  richcordClearActivity: () => Promise<boolean>
  richcordDisconnect: () => Promise<void>
  richcordGetStatus: () => Promise<RichcordStatusData>
  richcordGetCliConfig: () => Promise<CliConfigData | null>
  checkForUpdates: () => Promise<UpdateCheckResultData>
  applyUpdate: (url?: string) => Promise<{ success: boolean; message?: string }>
  onRichcordStatus: (callback: (status: RichcordStatusData) => void) => () => void
  onRichcordError: (callback: (error: { message: string }) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
