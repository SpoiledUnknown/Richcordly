import { ElectronAPI } from '@electron-toolkit/preload'

export interface CustomAPI {
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  openExternal: (url: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
