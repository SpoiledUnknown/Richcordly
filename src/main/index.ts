import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../public/icon.png?asset'
import { richcordService, type ActivityPayload } from './services/richcordService'
import { settingsService, type AppSettings } from './services/settingsService'
import { updateService } from './services/updateService'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

async function showMainWindow(): Promise<void> {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    return
  }
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  mainWindow.show()
  mainWindow.focus()
  const settings = settingsService.loadSettings()
  if (!settings.keepPresenceOnClose) {
    await richcordService.restoreLastActivity()
  }
}

function createTray(): void {
  if (tray) return
  try {
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Richcordly',
        click: (): void => {
          showMainWindow()
        }
      },
      { type: 'separator' },
      {
        label: 'Quit Richcordly',
        click: (): void => {
          isQuitting = true
          app.quit()
        }
      }
    ])
    tray.setToolTip('Richcordly')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        showMainWindow()
        return
      }
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        showMainWindow()
      }
    })
  } catch (err) {
    console.warn('[Main] Failed to create tray:', err)
  }
}

function createWindow(): void {
  const settings = settingsService.loadSettings()

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1040,
    minHeight: 700,
    show: false,
    frame: false,
    backgroundColor: settings.customTheme?.backgroundColor || '#070b14',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: true,
      spellcheck: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    const isAutoBoot =
      process.argv.includes('--hidden') || app.getLoginItemSettings().wasOpenedAtLogin
    if (settings.startMinimized && isAutoBoot) {
      if (tray) {
        tray.setToolTip('Richcordly (Running minimized)')
      }
    } else {
      mainWindow?.show()
    }
  })

  mainWindow.on('close', async (event) => {
    if (isQuitting) return
    const currentSettings = settingsService.loadSettings()
    if (currentSettings.closeAction === 'Minimize to background tray') {
      event.preventDefault()
      if (!currentSettings.keepPresenceOnClose) {
        await richcordService.clearActivity()
      }
      mainWindow?.hide()
    } else {
      isQuitting = true
      if (!currentSettings.keepPresenceOnClose) {
        await richcordService.clearActivity()
      }
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  app.setName('Richcordly')
  electronApp.setAppUserModelId('com.electron.richcordly')

  app.on('second-instance', () => {
    showMainWindow()
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Window control IPC handlers
  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  ipcMain.on('open-external', (_, url: string) => {
    if (url && typeof url === 'string') {
      shell.openExternal(url)
    }
  })

  // Settings IPC Handlers
  ipcMain.handle('settings-load', () => {
    return settingsService.loadSettings()
  })

  ipcMain.handle('settings-save', (_, settings: AppSettings) => {
    return settingsService.saveSettings(settings)
  })

  // Richcord IPC Handlers
  ipcMain.handle('richcord-connect', async (_, clientId: string, autoReconnect?: boolean) => {
    return await richcordService.connect(clientId, autoReconnect)
  })

  ipcMain.handle('richcord-set-activity', async (_, payload: ActivityPayload) => {
    return await richcordService.setActivity(payload)
  })

  ipcMain.handle('richcord-clear-activity', async () => {
    return await richcordService.clearActivity()
  })

  ipcMain.handle('richcord-disconnect', async () => {
    return await richcordService.disconnect()
  })

  ipcMain.handle('richcord-get-status', () => {
    return richcordService.getStatus()
  })

  ipcMain.handle('richcord-get-cli-config', () => {
    return richcordService.getCliConfig()
  })

  // System Update IPC Handlers
  ipcMain.handle('update-check', async () => {
    return await updateService.checkForUpdates()
  })

  ipcMain.handle('update-apply', async (_, url?: string) => {
    return await updateService.applyUpdate(url)
  })

  createTray()
  createWindow()

  app.on('activate', function () {
    showMainWindow()
  })
})

app.on('window-all-closed', () => {
  const settings = settingsService.loadSettings()
  if (settings.closeAction === 'Minimize to background tray' && !isQuitting) {
    // Keep app running in tray
    return
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  isQuitting = true
  await richcordService.disconnect()
})
