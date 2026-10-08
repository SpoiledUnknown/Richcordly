import { app, shell } from 'electron'
import { UpdateService as RichcordUpdateService } from 'richcord'
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'

export interface ReleaseAsset {
  name: string
  downloadUrl: string
  size: number
}

export interface ReleaseItem {
  tag: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

export interface UpdateCheckResultPayload {
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
  history: ReleaseItem[]
  githubApiAllowed: boolean
  error?: string | null
}

interface GithubAssetRaw {
  name: string
  browser_download_url: string
  size: number
}

interface GithubReleaseRaw {
  tag_name: string
  name?: string
  body?: string
  published_at?: string
  html_url?: string
  assets?: GithubAssetRaw[]
}

class AppUpdateService {
  private richcordUpdater = new RichcordUpdateService()

  private getAppVersion(): string {
    try {
      const v = app.getVersion()
      if (v && v.trim() && v !== '0.0.0') {
        return v.trim().replace(/^v/i, '')
      }
    } catch {
      // ignore
    }
    try {
      const candidates = [
        path.join(app.getAppPath(), 'package.json'),
        path.join(process.cwd(), 'package.json')
      ]
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const raw = JSON.parse(fs.readFileSync(p, 'utf-8'))
          if (raw.version) {
            return String(raw.version).trim().replace(/^v/i, '')
          }
        }
      }
    } catch {
      // ignore
    }
    return '1.0.0'
  }

  public async checkForUpdates(): Promise<UpdateCheckResultPayload> {
    const currentVersion = this.getAppVersion()
    let latestVersion = currentVersion
    let releaseUrl = 'https://github.com/SpoiledUnknown/Richcordly/releases'
    let releaseName = `Release v${currentVersion}`
    let releaseNotes = ''
    let publishedAt = ''
    const assets: ReleaseAsset[] = []
    const history: ReleaseItem[] = []
    let githubApiAllowed = false

    // 1. Use richcord's builtin checkUpdate method targeting Richcordly
    try {
      const richcordResult = await this.richcordUpdater.checkUpdate('Richcordly')
      if (richcordResult && richcordResult.latestVersion) {
        const cleaned = richcordResult.latestVersion.trim().replace(/^v/i, '')
        if (cleaned) {
          latestVersion = cleaned
        }
        if (richcordResult.releaseUrl) {
          releaseUrl = richcordResult.releaseUrl
        }
      }
    } catch (e) {
      console.warn('[AppUpdateService] richcord checkUpdate error:', e)
    }

    // 2. Fetch releases from GitHub API for Richcordly
    try {
      const releasesData = await this.fetchGithubReleases()
      if (Array.isArray(releasesData)) {
        githubApiAllowed = true
        if (releasesData.length > 0) {
          const latest = releasesData[0]
          const tagClean = (latest.tag_name || latest.name || latestVersion)
            .trim()
            .replace(/^v/i, '')
          latestVersion = tagClean || latestVersion
          releaseName = latest.name || latest.tag_name || `Version ${latestVersion}`
          releaseNotes = latest.body || ''
          publishedAt = latest.published_at || ''
          if (latest.html_url) {
            releaseUrl = latest.html_url
          }

          if (Array.isArray(latest.assets)) {
            for (const asset of latest.assets) {
              assets.push({
                name: asset.name,
                downloadUrl: asset.browser_download_url,
                size: asset.size
              })
            }
          }

          for (const rel of releasesData.slice(0, 5)) {
            history.push({
              tag: rel.tag_name,
              name: rel.name || rel.tag_name,
              body: rel.body || '',
              publishedAt: rel.published_at || '',
              htmlUrl: rel.html_url || ''
            })
          }
        } else {
          // If no releases are on GitHub yet, app is on current version
          latestVersion = currentVersion
        }
      }
    } catch (e) {
      console.warn('[AppUpdateService] GitHub API fetch failed or rate-limited:', e)
      githubApiAllowed = false
    }

    // Version comparison
    const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
      releaseName: releaseName || `Release v${latestVersion}`,
      releaseUrl,
      releaseNotes,
      publishedAt,
      channel: 'Stable',
      checkedAt: new Date().toISOString(),
      assets,
      history,
      githubApiAllowed
    }
  }

  public compareVersions(v1: string, v2: string): number {
    const clean1 = v1
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((p) => parseInt(p, 10) || 0)
    const clean2 = v2
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((p) => parseInt(p, 10) || 0)
    for (let i = 0; i < Math.max(clean1.length, clean2.length); i++) {
      const a = clean1[i] ?? 0
      const b = clean2[i] ?? 0
      if (a > b) return 1
      if (a < b) return -1
    }
    return 0
  }

  private fetchGithubReleases(): Promise<GithubReleaseRaw[]> {
    return new Promise((resolve, reject) => {
      const req = https.get(
        'https://api.github.com/repos/SpoiledUnknown/Richcordly/releases',
        {
          timeout: 6000,
          headers: {
            'User-Agent': 'Richcordly',
            Accept: 'application/vnd.github+json'
          }
        },
        (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API returned status ${res.statusCode}`))
            return
          }
          let data = ''
          res.setEncoding('utf8')
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => {
            try {
              const json = JSON.parse(data)
              resolve(json)
            } catch (err) {
              reject(err)
            }
          })
        }
      )
      req.on('error', reject)
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('GitHub API request timed out'))
      })
    })
  }

  public async applyUpdate(targetUrl?: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (!targetUrl) {
        targetUrl = 'https://github.com/SpoiledUnknown/Richcordly/releases/latest'
      }

      // If it's a direct .exe or asset download link on Windows
      if (targetUrl.endsWith('.exe')) {
        const tempPath = path.join(app.getPath('temp'), path.basename(targetUrl))
        await this.downloadFile(targetUrl, tempPath)
        await shell.openPath(tempPath)
        return { success: true, message: 'Installer launched successfully' }
      }

      // Open external release URL in browser
      await shell.openExternal(targetUrl)
      return { success: true, message: 'Opened release page in browser' }
    } catch (err) {
      console.error('[AppUpdateService] applyUpdate error:', err)
      if (targetUrl) {
        await shell.openExternal(targetUrl)
      }
      return { success: false, message: String(err) }
    }
  }

  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest)
      const request = (targetUrl: string): void => {
        https
          .get(targetUrl, { headers: { 'User-Agent': 'Richcordly' } }, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
              const redirectUrl = res.headers.location
              if (redirectUrl) {
                request(redirectUrl)
                return
              }
            }
            if (res.statusCode !== 200) {
              reject(new Error(`Failed to download: status ${res.statusCode}`))
              return
            }
            res.pipe(file)
            file.on('finish', () => {
              file.close(() => resolve())
            })
          })
          .on('error', (err) => {
            fs.unlink(dest, () => {})
            reject(err)
          })
      }
      request(url)
    })
  }
}

export const updateService = new AppUpdateService()
