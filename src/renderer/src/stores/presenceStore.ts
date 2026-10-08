import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ProfilePreset {
  id: string
  name: string
  hotkey: string
  category: 'Coding' | 'Gaming' | 'Music' | 'Creative' | 'Idle'
  processName: string
  triggerMode: string
  autoTrigger?: boolean
  applicationId: string
  details: string
  state: string
  largeImageKey: string
  largeImageText: string
  smallImageKey: string
  smallImageText: string
  startTime?: number | null
  endTime?: number | null
  partyId?: string
  partySize?: number
  partyMax?: number
  buttons: Array<{ label: string; url: string }>
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  flags?: number
}

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
  customTheme: CustomThemeData
  shaderIntensity: number
  blurDensity: number
  reduceMotion: boolean
  ipcPipe: string
  customClientId: string
  autoReconnect: boolean
  pingInterval: number
  processDetectionEnabled: boolean
}

export interface ReleaseAsset {
  name: string
  downloadUrl: string
  size: number
}

export interface ReleaseHistoryItem {
  tag: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

export interface AppUpdateState {
  isChecking: boolean
  isApplying: boolean
  hasUpdate: boolean
  currentVersion: string
  latestVersion: string
  releaseName: string
  releaseUrl: string
  releaseNotes: string
  publishedAt: string
  channel: string
  checkedAt: string
  assets: ReleaseAsset[]
  history: ReleaseHistoryItem[]
  githubApiAllowed: boolean
  autoUpdate: boolean
  statusMessage: string
  error: string | null
}

export interface ImportResult {
  success: boolean
  error?: string
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

export function hexToRgb(hex?: string): { r: number; g: number; b: number } {
  if (!hex) return { r: 139, g: 92, b: 246 }
  const clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 139
    const g = parseInt(clean[1] + clean[1], 16) || 92
    const b = parseInt(clean[2] + clean[2], 16) || 246
    return { r, g, b }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) || 139
    const g = parseInt(clean.substring(2, 4), 16) || 92
    const b = parseInt(clean.substring(4, 6), 16) || 246
    return { r, g, b }
  }
  return { r: 139, g: 92, b: 246 }
}

export const usePresenceStore = defineStore('presence', () => {
  // Navigation
  const activeTab = ref<'presence' | 'profiles' | 'settings'>('presence')

  // Connection
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const isUpdating = ref(false)
  const currentUser = ref<DiscordUser | null>(null)
  const errorMessage = ref<string | null>(null)
  const pipeChannel = ref('#0')

  // Active Profile ID
  const activeProfileId = ref('PR-0104')

  // Form payload (active presence)
  const details = ref('Building Richcordly Desktop Client')
  const state = ref('refactoring ipc sockets')
  const largeImageKey = ref('richcord_crystallite')
  const largeImageText = ref('Richcordly Dev Studio')
  const smallImageKey = ref('vscode_badge')
  const smallImageText = ref('Editing presence.ts')
  const startTime = ref<number | null>(Date.now())
  const endTime = ref<number | null>(null)
  const partyId = ref('richcord-party-841')
  const partySize = ref(1)
  const partyMax = ref(5)
  const button1 = ref({ label: 'View GitHub', url: 'https://github.com/richcord/client' })
  const button2 = ref({ label: 'Visit Site', url: 'https://richcord.dev' })
  const applicationId = ref('886576833838088243')

  // Presets List
  const presets = ref<ProfilePreset[]>([
    {
      id: 'PR-0104',
      name: 'Coding Session (VS Code)',
      hotkey: 'Ctrl + Shift + 1',
      category: 'Coding',
      processName: 'Code.exe',
      triggerMode: 'On Process Foreground',
      applicationId: '886576833838088243',
      details: 'Building Richcordly Desktop Client',
      state: 'refactoring ipc sockets',
      largeImageKey: 'richcord_crystallite',
      largeImageText: 'Richcordly Dev Studio',
      smallImageKey: 'vscode_badge',
      smallImageText: 'Editing presence.ts',
      buttons: [
        { label: 'View GitHub', url: 'https://github.com/richcord/client' },
        { label: 'Visit Site', url: 'https://richcord.dev' }
      ]
    },
    {
      id: 'PR-0105',
      name: 'Nocturnal Gaming',
      hotkey: 'Ctrl + Shift + 2',
      category: 'Gaming',
      processName: 'steam.exe',
      triggerMode: 'On Process Foreground',
      applicationId: '1092837498172983742',
      details: 'Deep Space Reconnaissance',
      state: 'Sector 7 Orbit',
      largeImageKey: 'richcord_crystallite',
      largeImageText: 'Nocturnal Void',
      smallImageKey: '',
      smallImageText: '',
      buttons: [{ label: 'Join Lobby', url: 'https://richcord.dev' }]
    },
    {
      id: 'PR-0106',
      name: 'Lo-Fi Chill & Focus',
      hotkey: 'Ctrl + Shift + 3',
      category: 'Music',
      processName: 'Spotify.exe',
      triggerMode: 'On Process Foreground',
      applicationId: '1092837498172983743',
      details: 'Synthwave Odyssey',
      state: 'Track 04 / 12 (Night Drive)',
      largeImageKey: 'richcord_crystallite',
      largeImageText: 'Soundscape Engine',
      smallImageKey: '',
      smallImageText: '',
      buttons: [{ label: 'Listen Along', url: 'https://richcord.dev' }]
    },
    {
      id: 'PR-0107',
      name: 'Late Night AFK',
      hotkey: 'Ctrl + Shift + 4',
      category: 'Idle',
      processName: '',
      triggerMode: 'Manual',
      applicationId: '1092837498172983741',
      details: 'Away From Keyboard',
      state: 'Brewing midnight espresso ☕',
      largeImageKey: 'richcord_crystallite',
      largeImageText: 'Idle Mode',
      smallImageKey: '',
      smallImageText: '',
      buttons: []
    }
  ])

  // Settings
  const settings = ref<AppSettings>({
    ...DEFAULT_SETTINGS,
    customTheme: { ...DEFAULT_SETTINGS.customTheme }
  })

  function applyThemeToDom(theme?: CustomThemeData): void {
    const target = theme || settings.value.customTheme || DEFAULT_SETTINGS.customTheme
    if (!target) return
    const root = document.documentElement
    root.style.setProperty('--color-primary', target.primaryColor)
    root.style.setProperty('--color-accent', target.accentColor)
    root.style.setProperty('--color-bg-base', target.backgroundColor)

    const p = hexToRgb(target.primaryColor)
    const a = hexToRgb(target.accentColor)
    const bg = hexToRgb(target.backgroundColor)

    root.style.setProperty('--color-primary-rgb', `${p.r}, ${p.g}, ${p.b}`)
    root.style.setProperty('--color-accent-rgb', `${a.r}, ${a.g}, ${a.b}`)
    root.style.setProperty('--color-bg-rgb', `${bg.r}, ${bg.g}, ${bg.b}`)

    // Dynamically derive surface shades to match custom theme background
    const scR = Math.min(255, Math.max(0, bg.r + 11))
    const scG = Math.min(255, Math.max(0, bg.g + 13))
    const scB = Math.min(255, Math.max(0, bg.b + 21))
    root.style.setProperty('--color-surface-container-rgb', `${scR}, ${scG}, ${scB}`)

    const slR = Math.min(255, Math.max(0, bg.r + 6))
    const slG = Math.min(255, Math.max(0, bg.g + 8))
    const slB = Math.min(255, Math.max(0, bg.b + 14))
    root.style.setProperty('--color-surface-low-rgb', `${slR}, ${slG}, ${slB}`)

    const shR = Math.min(255, Math.max(0, bg.r + 28))
    const shG = Math.min(255, Math.max(0, bg.g + 31))
    const shB = Math.min(255, Math.max(0, bg.b + 42))
    root.style.setProperty('--color-surface-high-rgb', `${shR}, ${shG}, ${shB}`)

    const svR = Math.min(255, Math.max(0, bg.r + 41))
    const svG = Math.min(255, Math.max(0, bg.g + 43))
    const svB = Math.min(255, Math.max(0, bg.b + 55))
    root.style.setProperty('--color-surface-variant-rgb', `${svR}, ${svG}, ${svB}`)
  }

  watch(
    () => settings.value.customTheme,
    (theme) => {
      applyThemeToDom(theme)
    },
    { deep: true, immediate: true }
  )

  async function loadSettings(): Promise<void> {
    try {
      if (window.api?.settingsLoad) {
        const loaded = await window.api.settingsLoad()
        if (loaded) {
          settings.value = {
            ...DEFAULT_SETTINGS,
            ...loaded,
            customTheme: {
              ...DEFAULT_SETTINGS.customTheme,
              ...(loaded.customTheme || {})
            }
          }
        }
      } else {
        const local = localStorage.getItem('richcord_settings')
        if (local) {
          const parsed = JSON.parse(local)
          settings.value = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            customTheme: {
              ...DEFAULT_SETTINGS.customTheme,
              ...(parsed.customTheme || {})
            }
          }
        }
      }
      applyThemeToDom(settings.value.customTheme)
    } catch (e) {
      console.warn('Failed to load settings:', e)
    }
  }

  async function saveSettings(custom?: Partial<AppSettings>): Promise<boolean> {
    if (custom) {
      settings.value = { ...settings.value, ...custom }
    }
    applyThemeToDom(settings.value.customTheme)
    try {
      localStorage.setItem('richcord_settings', JSON.stringify(settings.value))
      if (window.api?.settingsSave) {
        return await window.api.settingsSave(settings.value)
      }
      return true
    } catch (e) {
      console.error('Failed to save settings:', e)
      return false
    }
  }

  function exportSettings(): void {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings.value, null, 2))
    const dl = document.createElement('a')
    dl.setAttribute('href', dataStr)
    dl.setAttribute('download', `richcordly_settings_${Date.now()}.json`)
    dl.click()
  }

  async function importSettings(rawJson: string): Promise<ImportResult> {
    if (!rawJson || !rawJson.trim()) {
      return { success: false, error: 'The selected file is empty.' }
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      return { success: false, error: 'Invalid JSON syntax: could not parse file.' }
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'JSON content must be a configuration object.' }
    }

    const p = parsed as Record<string, unknown>
    // Detect if user uploaded a Profile preset JSON into Settings
    if (
      ('processName' in p || 'triggerMode' in p || 'buttons' in p) &&
      !('ipcPipe' in p || 'closeAction' in p || 'customTheme' in p)
    ) {
      return {
        success: false,
        error: 'This file appears to be a Profile preset, not a Settings file.'
      }
    }

    try {
      // Validate closeAction
      const validCloseActions = [
        'Minimize to background tray',
        'Quit desktop client completely',
        'Prompt on close'
      ]
      const closeAction =
        typeof p.closeAction === 'string' && validCloseActions.includes(p.closeAction)
          ? (p.closeAction as AppSettings['closeAction'])
          : DEFAULT_SETTINGS.closeAction

      // Validate customTheme safely
      let customTheme = { ...DEFAULT_SETTINGS.customTheme }
      if (p.customTheme && typeof p.customTheme === 'object' && !Array.isArray(p.customTheme)) {
        const ct = p.customTheme as Record<string, unknown>
        const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
        customTheme = {
          name:
            typeof ct.name === 'string' && ct.name.trim()
              ? ct.name.trim().slice(0, 50)
              : DEFAULT_SETTINGS.customTheme.name,
          primaryColor:
            typeof ct.primaryColor === 'string' && hexRegex.test(ct.primaryColor)
              ? ct.primaryColor
              : DEFAULT_SETTINGS.customTheme.primaryColor,
          accentColor:
            typeof ct.accentColor === 'string' && hexRegex.test(ct.accentColor)
              ? ct.accentColor
              : DEFAULT_SETTINGS.customTheme.accentColor,
          backgroundColor:
            typeof ct.backgroundColor === 'string' && hexRegex.test(ct.backgroundColor)
              ? ct.backgroundColor
              : DEFAULT_SETTINGS.customTheme.backgroundColor
        }
      }

      // Validate pingInterval
      const validPingIntervals = [5, 15, 30]
      const pingInterval =
        typeof p.pingInterval === 'number' && validPingIntervals.includes(p.pingInterval)
          ? p.pingInterval
          : DEFAULT_SETTINGS.pingInterval

      // Validate shaderIntensity & blurDensity
      const shaderIntensity =
        typeof p.shaderIntensity === 'number' && !isNaN(p.shaderIntensity)
          ? Math.min(100, Math.max(0, p.shaderIntensity))
          : DEFAULT_SETTINGS.shaderIntensity

      const blurDensity =
        typeof p.blurDensity === 'number' && !isNaN(p.blurDensity)
          ? Math.min(64, Math.max(0, p.blurDensity))
          : DEFAULT_SETTINGS.blurDensity

      settings.value = {
        launchOnStartup:
          typeof p.launchOnStartup === 'boolean'
            ? p.launchOnStartup
            : DEFAULT_SETTINGS.launchOnStartup,
        startMinimized:
          typeof p.startMinimized === 'boolean'
            ? p.startMinimized
            : DEFAULT_SETTINGS.startMinimized,
        keepPresenceOnClose:
          typeof p.keepPresenceOnClose === 'boolean'
            ? p.keepPresenceOnClose
            : DEFAULT_SETTINGS.keepPresenceOnClose,
        closeAction,
        theme:
          typeof p.theme === 'string' && p.theme.trim()
            ? p.theme.trim().slice(0, 50)
            : DEFAULT_SETTINGS.theme,
        customTheme,
        shaderIntensity,
        blurDensity,
        reduceMotion:
          typeof p.reduceMotion === 'boolean' ? p.reduceMotion : DEFAULT_SETTINGS.reduceMotion,
        ipcPipe:
          typeof p.ipcPipe === 'string' && p.ipcPipe.trim()
            ? p.ipcPipe.trim()
            : DEFAULT_SETTINGS.ipcPipe,
        customClientId:
          typeof p.customClientId === 'string'
            ? p.customClientId.trim().slice(0, 64)
            : DEFAULT_SETTINGS.customClientId,
        autoReconnect:
          typeof p.autoReconnect === 'boolean' ? p.autoReconnect : DEFAULT_SETTINGS.autoReconnect,
        pingInterval,
        processDetectionEnabled:
          typeof p.processDetectionEnabled === 'boolean'
            ? p.processDetectionEnabled
            : DEFAULT_SETTINGS.processDetectionEnabled
      }

      await saveSettings()
      return { success: true }
    } catch (e) {
      console.error('Failed to import settings:', e)
      return { success: false, error: 'Unexpected error while applying settings.' }
    }
  }

  function importProfilePreset(rawJson: string): ImportResult {
    if (!rawJson || !rawJson.trim()) {
      return { success: false, error: 'The selected file is empty.' }
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      return { success: false, error: 'Invalid JSON syntax: could not parse file.' }
    }

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return { success: false, error: 'The JSON array is empty.' }
      }
      parsed = parsed[0]
    }

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'JSON content must be a profile object.' }
    }

    const p = parsed as Record<string, unknown>

    // Detect if user uploaded a Settings file into Profile Manager
    if (
      ('closeAction' in p || 'customTheme' in p || 'pingInterval' in p || 'shaderIntensity' in p) &&
      !('details' in p || 'state' in p || 'triggerMode' in p || 'processName' in p)
    ) {
      return {
        success: false,
        error: 'This file appears to be application Settings, not a Profile preset.'
      }
    }

    // Require at least one recognizable profile property
    if (!(
      'name' in p ||
      'details' in p ||
      'state' in p ||
      'applicationId' in p ||
      'processName' in p
    )) {
      return {
        success: false,
        error: 'Unrecognized JSON: missing profile configuration fields.'
      }
    }

    try {
      const validCategories = ['Coding', 'Gaming', 'Music', 'Creative', 'Idle'] as const
      const category =
        typeof p.category === 'string' &&
        validCategories.includes(p.category as ProfilePreset['category'])
          ? (p.category as ProfilePreset['category'])
          : 'Coding'

      const name =
        typeof p.name === 'string' && p.name.trim()
          ? p.name.trim().slice(0, 50)
          : 'Imported Profile'

      const newId = `PR-010${presets.value.length + 1}`

      const hotkey =
        typeof p.hotkey === 'string' && p.hotkey.trim()
          ? p.hotkey.trim().slice(0, 30)
          : `Ctrl + Shift + ${presets.value.length + 1}`

      const processName = typeof p.processName === 'string' ? p.processName.trim().slice(0, 80) : ''

      const validTriggerModes = [
        'On Process Foreground',
        'On Process Running',
        'Manual Trigger Only'
      ]
      const triggerMode =
        typeof p.triggerMode === 'string' && validTriggerModes.includes(p.triggerMode)
          ? p.triggerMode
          : 'On Process Foreground'

      const autoTrigger = typeof p.autoTrigger === 'boolean' ? p.autoTrigger : true

      const applicationId =
        typeof p.applicationId === 'string'
          ? p.applicationId.trim().slice(0, 64)
          : typeof p.applicationId === 'number'
            ? String(p.applicationId)
            : '1092837498172983741'

      const details = typeof p.details === 'string' ? p.details.slice(0, 128) : ''
      const state = typeof p.state === 'string' ? p.state.slice(0, 128) : ''
      const largeImageKey =
        typeof p.largeImageKey === 'string' ? p.largeImageKey.trim().slice(0, 64) : ''
      const largeImageText =
        typeof p.largeImageText === 'string' ? p.largeImageText.slice(0, 128) : ''
      const smallImageKey =
        typeof p.smallImageKey === 'string' ? p.smallImageKey.trim().slice(0, 64) : ''
      const smallImageText =
        typeof p.smallImageText === 'string' ? p.smallImageText.slice(0, 128) : ''

      let startTime: number | null = null
      if (typeof p.startTime === 'number' && !isNaN(p.startTime) && p.startTime > 0) {
        startTime = Math.floor(p.startTime)
      }

      let endTime: number | null = null
      if (typeof p.endTime === 'number' && !isNaN(p.endTime) && p.endTime > 0) {
        endTime = Math.floor(p.endTime)
      }

      const partyId = typeof p.partyId === 'string' ? p.partyId.trim().slice(0, 64) : ''
      const partySize =
        typeof p.partySize === 'number' && !isNaN(p.partySize)
          ? Math.min(100, Math.max(1, Math.floor(p.partySize)))
          : 1
      const partyMax =
        typeof p.partyMax === 'number' && !isNaN(p.partyMax)
          ? Math.min(100, Math.max(1, Math.floor(p.partyMax)))
          : 5

      const rawButtons = Array.isArray(p.buttons) ? p.buttons : []
      const buttons: Array<{ label: string; url: string }> = []
      for (const btn of rawButtons.slice(0, 2)) {
        if (btn && typeof btn === 'object') {
          buttons.push({
            label: String((btn as Record<string, unknown>).label || '').slice(0, 32),
            url: String((btn as Record<string, unknown>).url || '').slice(0, 256)
          })
        }
      }

      const newPreset: ProfilePreset = {
        id: newId,
        name,
        hotkey,
        category,
        processName,
        triggerMode,
        autoTrigger,
        applicationId,
        details,
        state,
        largeImageKey,
        largeImageText,
        smallImageKey,
        smallImageText,
        startTime,
        endTime,
        partyId,
        partySize,
        partyMax,
        buttons
      }

      presets.value.push(newPreset)
      activeProfileId.value = newId
      savePresets()

      return { success: true }
    } catch (e) {
      console.error('Failed to import profile preset:', e)
      return { success: false, error: 'Unexpected error while importing profile.' }
    }
  }

  async function resetSettings(): Promise<void> {
    settings.value = {
      ...DEFAULT_SETTINGS,
      customTheme: { ...DEFAULT_SETTINGS.customTheme }
    }
    await saveSettings()
  }

  let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null
  watch(
    settings,
    () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      autoSaveTimeout = setTimeout(() => {
        saveSettings()
        autoSaveTimeout = null
      }, 300)
    },
    { deep: true }
  )

  // System Updates
  const updateState = ref<AppUpdateState>({
    isChecking: false,
    isApplying: false,
    hasUpdate: false,
    currentVersion: '1.0.0',
    latestVersion: '1.0.0',
    releaseName: '',
    releaseUrl: 'https://github.com/SpoiledUnknown/Richcordly/releases',
    releaseNotes: '',
    publishedAt: '',
    channel: 'Stable',
    checkedAt: '',
    assets: [],
    history: [],
    githubApiAllowed: true,
    autoUpdate: true,
    statusMessage: '',
    error: null
  })

  async function checkForUpdates(silent = false): Promise<void> {
    if (updateState.value.isChecking) return
    updateState.value.isChecking = true
    updateState.value.error = null
    if (!silent) {
      updateState.value.statusMessage = 'Checking for updates...'
    }
    try {
      if (window.api?.checkForUpdates) {
        const res = await window.api.checkForUpdates()
        updateState.value.hasUpdate = res.hasUpdate
        updateState.value.currentVersion =
          (res.currentVersion || '1.0.0').replace(/^v/i, '') || '1.0.0'
        updateState.value.latestVersion =
          (res.latestVersion || '1.0.0').replace(/^v/i, '') || '1.0.0'
        updateState.value.releaseName =
          res.releaseName || `Release v${updateState.value.latestVersion}`
        updateState.value.releaseUrl =
          res.releaseUrl || 'https://github.com/SpoiledUnknown/Richcordly/releases'
        updateState.value.releaseNotes = res.releaseNotes
        updateState.value.publishedAt = res.publishedAt
        updateState.value.channel = res.channel || 'Stable'
        updateState.value.checkedAt = res.checkedAt
        updateState.value.assets = res.assets || []
        updateState.value.history = res.history || []
        updateState.value.githubApiAllowed = res.githubApiAllowed
        if (res.hasUpdate) {
          updateState.value.statusMessage = `New version v${updateState.value.latestVersion} available!`
        } else {
          updateState.value.statusMessage = `Richcordly is up to date (v${updateState.value.currentVersion})`
        }
      }
    } catch (err) {
      updateState.value.error = err instanceof Error ? err.message : String(err)
      updateState.value.statusMessage = 'Update check failed'
    } finally {
      updateState.value.isChecking = false
    }
  }

  async function applyUpdate(targetUrl?: string): Promise<boolean> {
    if (updateState.value.isApplying) return false
    updateState.value.isApplying = true
    updateState.value.statusMessage = 'Preparing update...'
    try {
      const urlToUse = targetUrl || updateState.value.releaseUrl
      if (window.api?.applyUpdate) {
        const res = await window.api.applyUpdate(urlToUse)
        if (res.success) {
          updateState.value.statusMessage = res.message || 'Update initiated'
          return true
        } else {
          updateState.value.statusMessage = res.message || 'Could not apply update'
          return false
        }
      }
      return false
    } catch (err) {
      updateState.value.error = err instanceof Error ? err.message : String(err)
      updateState.value.statusMessage = 'Update failed'
      return false
    } finally {
      updateState.value.isApplying = false
    }
  }

  const isUpdateModalOpen = ref(false)
  const updateModalType = ref<'up_to_date' | 'update_available'>('up_to_date')

  async function checkAndPromptUpdate(): Promise<void> {
    await checkForUpdates(false)
    if (updateState.value.hasUpdate) {
      updateModalType.value = 'update_available'
    } else {
      updateModalType.value = 'up_to_date'
    }
    isUpdateModalOpen.value = true
  }

  function closeUpdateModal(): void {
    isUpdateModalOpen.value = false
  }

  function savePresets(): void {
    try {
      localStorage.setItem('richcord_presets', JSON.stringify(presets.value))
      localStorage.setItem('richcord_active_profile_id', activeProfileId.value)
    } catch (e) {
      console.error('Failed to save presets to localStorage:', e)
    }
  }

  function loadPresets(): void {
    try {
      const raw = localStorage.getItem('richcord_presets')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          presets.value = parsed
        }
      }
      const savedActiveId = localStorage.getItem('richcord_active_profile_id')
      if (savedActiveId && presets.value.some((p) => p.id === savedActiveId)) {
        activeProfileId.value = savedActiveId
      }
    } catch (e) {
      console.warn('Failed to load presets from localStorage:', e)
    }
  }

  // Methods
  async function initDiscord(): Promise<void> {
    await loadSettings()
    loadPresets()

    // Seed default baseline presence values from the active profile preset upon app startup/restart
    const active = presets.value.find((p) => p.id === activeProfileId.value) || presets.value[0]
    if (active) {
      details.value = active.details || ''
      state.value = active.state || ''
      applicationId.value = active.applicationId || ''
      largeImageKey.value = active.largeImageKey || ''
      largeImageText.value = active.largeImageText || ''
      smallImageKey.value = active.smallImageKey || ''
      smallImageText.value = active.smallImageText || ''
      if (active.startTime !== undefined) startTime.value = active.startTime
      if (active.endTime !== undefined) endTime.value = active.endTime
      if (active.partyId !== undefined) partyId.value = active.partyId
      if (active.partySize !== undefined) partySize.value = active.partySize
      if (active.partyMax !== undefined) partyMax.value = active.partyMax
      if (active.buttons?.[0]) button1.value = { ...active.buttons[0] }
      if (active.buttons?.[1]) button2.value = { ...active.buttons[1] }
    }

    if (window.api?.onRichcordStatus) {
      window.api.onRichcordStatus((status) => {
        isConnected.value = status.isConnected
        currentUser.value = status.user
      })
    }
    if (window.api?.onRichcordError) {
      window.api.onRichcordError((err) => {
        errorMessage.value = err.message
      })
    }
    if (window.api?.richcordGetCliConfig) {
      try {
        const cliConfig = await window.api.richcordGetCliConfig()
        if (cliConfig?.clientId) {
          applicationId.value = cliConfig.clientId
          settings.value.customClientId = cliConfig.clientId
          if (presets.value[0]) {
            presets.value[0].applicationId = cliConfig.clientId
          }
        }
      } catch (err: unknown) {
        console.warn('Could not read CLI config:', err)
      }
    }
    if (window.api?.richcordGetStatus) {
      try {
        const status = await window.api.richcordGetStatus()
        isConnected.value = status.isConnected
        currentUser.value = status.user
        if (!status.isConnected && (applicationId.value || settings.value.customClientId)) {
          await connectDiscord()
        }
      } catch (err: unknown) {
        console.warn('Could not initialize Discord status:', err)
      }
    }
  }

  async function importFromCli(): Promise<boolean> {
    if (!window.api?.richcordGetCliConfig) return false
    try {
      const cliConfig = await window.api.richcordGetCliConfig()
      if (cliConfig?.clientId) {
        applicationId.value = cliConfig.clientId
        settings.value.customClientId = cliConfig.clientId
      }
      if (cliConfig?.activity) {
        if (cliConfig.activity.details) details.value = cliConfig.activity.details
        if (cliConfig.activity.state) state.value = cliConfig.activity.state
        if (cliConfig.activity.assets?.largeImage)
          largeImageKey.value = cliConfig.activity.assets.largeImage
        if (cliConfig.activity.assets?.largeText)
          largeImageText.value = cliConfig.activity.assets.largeText
        if (cliConfig.activity.assets?.smallImage)
          smallImageKey.value = cliConfig.activity.assets.smallImage
        if (cliConfig.activity.assets?.smallText)
          smallImageText.value = cliConfig.activity.assets.smallText
      }
      return true
    } catch {
      return false
    }
  }

  async function connectDiscord(clientId?: string): Promise<boolean> {
    const targetId = clientId || settings.value.customClientId || applicationId.value
    if (!targetId || !window.api?.richcordConnect) return false
    isConnecting.value = true
    errorMessage.value = null
    try {
      const user = await window.api.richcordConnect(targetId, settings.value.autoReconnect)
      if (user) {
        isConnected.value = true
        currentUser.value = user
        return true
      }
      return false
    } catch (err: unknown) {
      errorMessage.value = err instanceof Error ? err.message : String(err)
      return false
    } finally {
      isConnecting.value = false
    }
  }

  async function disconnectDiscord(): Promise<void> {
    if (window.api?.richcordDisconnect) {
      await window.api.richcordDisconnect()
    }
    isConnected.value = false
    currentUser.value = null
  }

  async function updatePresence(): Promise<boolean> {
    isUpdating.value = true
    errorMessage.value = null
    try {
      if (!isConnected.value) {
        const connected = await connectDiscord()
        if (!connected) {
          return false
        }
      }

      const buttons: Array<{ label: string; url: string }> = []
      if (button1.value.label.trim() && button1.value.url.trim()) {
        buttons.push({ label: button1.value.label.trim(), url: button1.value.url.trim() })
      }
      if (button2.value.label.trim() && button2.value.url.trim()) {
        buttons.push({ label: button2.value.label.trim(), url: button2.value.url.trim() })
      }

      if (window.api?.richcordSetActivity) {
        const success = await window.api.richcordSetActivity({
          details: details.value,
          state: state.value,
          largeImageKey: largeImageKey.value,
          largeImageText: largeImageText.value,
          smallImageKey: smallImageKey.value,
          smallImageText: smallImageText.value,
          startTime: startTime.value,
          endTime: endTime.value,
          partyId: partyId.value,
          partySize: partySize.value,
          partyMax: partyMax.value,
          buttons
        })
        return success
      }
      return false
    } catch (err: unknown) {
      errorMessage.value = err instanceof Error ? err.message : String(err)
      return false
    } finally {
      isUpdating.value = false
    }
  }

  function selectProfile(preset: ProfilePreset): void {
    activeProfileId.value = preset.id
    details.value = preset.details
    state.value = preset.state
    applicationId.value = preset.applicationId
    largeImageKey.value = preset.largeImageKey
    largeImageText.value = preset.largeImageText
    smallImageKey.value = preset.smallImageKey
    smallImageText.value = preset.smallImageText
    if (preset.buttons[0]) button1.value = { ...preset.buttons[0] }
    else button1.value = { label: '', url: '' }
    if (preset.buttons[1]) button2.value = { ...preset.buttons[1] }
    else button2.value = { label: '', url: '' }
  }

  async function clearPresence(): Promise<void> {
    details.value = ''
    state.value = ''
    largeImageKey.value = ''
    largeImageText.value = ''
    smallImageKey.value = ''
    smallImageText.value = ''
    button1.value = { label: '', url: '' }
    button2.value = { label: '', url: '' }
    if (window.api?.richcordClearActivity) {
      try {
        await window.api.richcordClearActivity()
      } catch (err: unknown) {
        errorMessage.value = err instanceof Error ? err.message : String(err)
      }
    }
  }

  return {
    activeTab,
    isConnected,
    isConnecting,
    isUpdating,
    currentUser,
    errorMessage,
    pipeChannel,
    activeProfileId,
    details,
    state,
    largeImageKey,
    largeImageText,
    smallImageKey,
    smallImageText,
    startTime,
    endTime,
    partyId,
    partySize,
    partyMax,
    button1,
    button2,
    applicationId,
    presets,
    settings,
    loadSettings,
    saveSettings,
    exportSettings,
    importSettings,
    resetSettings,
    applyThemeToDom,
    updateState,
    checkForUpdates,
    applyUpdate,
    isUpdateModalOpen,
    updateModalType,
    checkAndPromptUpdate,
    closeUpdateModal,
    initDiscord,
    connectDiscord,
    disconnectDiscord,
    updatePresence,
    importFromCli,
    selectProfile,
    clearPresence,
    savePresets,
    loadPresets,
    importProfilePreset
  }
})
