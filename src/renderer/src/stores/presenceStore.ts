import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProfilePreset {
  id: string
  name: string
  hotkey: string
  category: 'Coding' | 'Gaming' | 'Music' | 'Creative' | 'Idle'
  processName: string
  triggerMode: string
  applicationId: string
  details: string
  state: string
  largeImageKey: string
  largeImageText: string
  smallImageKey: string
  smallImageText: string
  buttons: Array<{ label: string; url: string }>
}

export const usePresenceStore = defineStore('presence', () => {
  // Navigation
  const activeTab = ref<'presence' | 'profiles' | 'settings' | 'updates'>('presence')

  // Connection
  const isConnected = ref(true)
  const pipeChannel = ref('#0')

  // Active Profile ID
  const activeProfileId = ref('PR-0104')

  // Form payload (active presence)
  const details = ref('Building Richcord Desktop Client')
  const state = ref('refactoring ipc sockets')
  const largeImageKey = ref('richcord_crystallite')
  const largeImageText = ref('Richcord Dev Studio')
  const smallImageKey = ref('vscode_badge')
  const smallImageText = ref('Editing presence.ts')
  const startTime = ref<number | null>(Date.now() - 42 * 60 * 1000) // 42m ago
  const endTime = ref<number | null>(null)
  const partyId = ref('richcord-party-841')
  const partySize = ref(1)
  const partyMax = ref(5)
  const button1 = ref({ label: 'View GitHub', url: 'https://github.com/richcord/client' })
  const button2 = ref({ label: 'Visit Site', url: 'https://richcord.dev' })
  const applicationId = ref('1092837498172983741')

  // Presets List
  const presets = ref<ProfilePreset[]>([
    {
      id: 'PR-0104',
      name: 'Coding Session (VS Code)',
      hotkey: 'Ctrl + Shift + 1',
      category: 'Coding',
      processName: 'Code.exe',
      triggerMode: 'On Process Foreground',
      applicationId: '1092837498172983741',
      details: 'Building Richcord Desktop Client',
      state: 'refactoring ipc sockets',
      largeImageKey: 'richcord_crystallite',
      largeImageText: 'Richcord Dev Studio',
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
  const settings = ref({
    launchOnStartup: true,
    startMinimized: false,
    keepPresenceOnClose: true,
    closeAction: 'Minimize to background tray',
    theme: 'Nocturnal Precision (Dark Navy + Violet)',
    shaderIntensity: 65,
    blurDensity: 16,
    reduceMotion: false,
    ipcPipe: 'Auto-detect (/pipe/discord-ipc-0)',
    customClientId: '',
    autoReconnect: true,
    pingInterval: 15
  })

  // System Updates
  const updateState = ref({
    channel: 'Stable',
    pendingVersion: 'v1.1.0',
    buildNumber: '#1408',
    releaseDate: 'Oct 24, 2026',
    autoUpdate: true,
    isApplying: false
  })

  // Methods
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
    if (preset.buttons[1]) button2.value = { ...preset.buttons[1] }
  }

  function clearPresence(): void {
    details.value = ''
    state.value = ''
    largeImageKey.value = ''
    largeImageText.value = ''
    smallImageKey.value = ''
    smallImageText.value = ''
    button1.value = { label: '', url: '' }
    button2.value = { label: '', url: '' }
  }

  return {
    activeTab,
    isConnected,
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
    updateState,
    selectProfile,
    clearPresence
  }
})
