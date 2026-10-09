/**
 * Richcordly Website — Interactive Client Script
 * Dynamically queries GitHub Releases API & handles platform switching
 */

(function () {
  'use strict';

  const GITHUB_REPO = 'SpoiledUnknown/Richcordly';
  const GITHUB_RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
  const GITHUB_RELEASES_LIST_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
  const GITHUB_RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases`;

  // Fallback defaults if API is rate-limited or repository has no releases yet
  const STATE = {
    currentOs: 'windows',
    version: 'v1.0.0',
    publishedDate: 'Latest',
    windowsAsset: null,
    linuxAsset: null,
    hasLoadedApi: false,
  };

  // DOM Elements
  const tabWindows = document.getElementById('tabWindows');
  const tabLinux = document.getElementById('tabLinux');
  const tabMac = document.getElementById('tabMac');

  const btnPrimaryDownload = document.getElementById('btnPrimaryDownload');
  const btnMainLabel = document.getElementById('btnMainLabel');
  const btnSubLabel = document.getElementById('btnSubLabel');

  const badgeVersionText = document.getElementById('badgeVersionText');
  const metaVersion = document.getElementById('metaVersion');
  const metaTarget = document.getElementById('metaTarget');
  const metaSize = document.getElementById('metaSize');
  const releaseBadge = document.getElementById('releaseBadge');

  /**
   * Format bytes to human readable string (e.g. 58.4 MB)
   */
  function formatBytes(bytes) {
    if (!bytes || isNaN(bytes) || bytes <= 0) return '100 - 130 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }

  /**
   * Format ISO date string to readable date
   */
  function formatDate(isoStr) {
    if (!isoStr) return 'Latest';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Latest';
    }
  }

  /**
   * Auto-detect OS from navigator user agent
   */
  function detectClientOS() {
    const ua = navigator.userAgent || '';
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
      return 'linux';
    }
    // Default to windows for PC users
    return 'windows';
  }

  /**
   * Update download button and meta text based on currently selected OS
   */
  function updateUIForSelectedOS(os) {
    STATE.currentOs = os;

    // Update active tab styles
    [tabWindows, tabLinux].forEach((tab) => {
      if (tab) {
        const isActive = tab.getAttribute('data-os') === os;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
    });

    if (os === 'windows') {
      btnMainLabel.textContent = `Download for Windows (${STATE.version})`;
      metaTarget.textContent = 'Installer (.exe)';

      if (STATE.windowsAsset && STATE.windowsAsset.browser_download_url) {
        btnPrimaryDownload.href = STATE.windowsAsset.browser_download_url;
        btnSubLabel.textContent = `Direct Download • ${formatBytes(STATE.windowsAsset.size)}`;
        metaSize.textContent = formatBytes(STATE.windowsAsset.size);
      } else {
        btnPrimaryDownload.href = GITHUB_RELEASES_PAGE;
        btnSubLabel.textContent = 'Direct via GitHub Releases • x64';
        metaSize.textContent = '~60 MB';
      }
    } else if (os === 'linux') {
      btnMainLabel.textContent = `Download for Linux (${STATE.version})`;
      metaTarget.textContent = 'AppImage / Deb (.tar.gz)';

      if (STATE.linuxAsset && STATE.linuxAsset.browser_download_url) {
        btnPrimaryDownload.href = STATE.linuxAsset.browser_download_url;
        btnSubLabel.textContent = `Direct Download • ${formatBytes(STATE.linuxAsset.size)}`;
        metaSize.textContent = formatBytes(STATE.linuxAsset.size);
      } else {
        btnPrimaryDownload.href = GITHUB_RELEASES_PAGE;
        btnSubLabel.textContent = 'Direct via GitHub Releases • Linux x64';
        metaSize.textContent = '~75 MB';
      }
    }

    metaVersion.textContent = STATE.version;
    badgeVersionText.textContent = `Latest Release ${STATE.version}`;
  }

  /**
   * Parse GitHub release object and set state
   */
  function processReleaseData(release) {
    if (!release) return;

    if (release.tag_name) {
      STATE.version = release.tag_name;
    } else if (release.name) {
      STATE.version = release.name;
    }

    STATE.publishedDate = formatDate(release.published_at);

    if (Array.isArray(release.assets)) {
      // Find Windows asset (.exe)
      STATE.windowsAsset = release.assets.find((a) =>
        a.name && (a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().includes('setup'))
      );

      // Find Linux asset (.AppImage, .deb, .tar.gz, or containing 'linux')
      STATE.linuxAsset = release.assets.find((a) =>
        a.name && (
          a.name.toLowerCase().endsWith('.appimage') ||
          a.name.toLowerCase().endsWith('.deb') ||
          a.name.toLowerCase().includes('linux')
        )
      );
    }

    if (release.html_url) {
      releaseBadge.href = release.html_url;
    }

    STATE.hasLoadedApi = true;
    updateUIForSelectedOS(STATE.currentOs);
  }

  /**
   * Fetch latest release from GitHub API with fallback
   */
  async function fetchGitHubReleases() {
    try {
      const response = await fetch(GITHUB_RELEASES_API, {
        headers: { Accept: 'application/vnd.github+json' }
      });

      if (response.ok) {
        const data = await response.json();
        processReleaseData(data);
        return;
      }

      // If /releases/latest returned 404, check /releases list
      const listResponse = await fetch(GITHUB_RELEASES_LIST_API, {
        headers: { Accept: 'application/vnd.github+json' }
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        if (Array.isArray(listData) && listData.length > 0) {
          processReleaseData(listData[0]);
          return;
        }
      }
    } catch (err) {
      console.warn('[Richcordly Web] GitHub API fetch error:', err);
    }

    // Default fallback UI state if repo has no releases yet or rate-limited
    STATE.version = 'v1.0.0';
    updateUIForSelectedOS(STATE.currentOs);
  }

  /**
   * Display temporary toast message when user clicks disabled macOS tab
   */
  function showMacToast() {
    const existing = document.getElementById('macToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'macToast';
    toast.textContent = '🍎 macOS build is currently in development and will be available in an upcoming release.';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(139, 92, 246, 0.4);
      color: #f1f5f9;
      font-size: 0.85rem;
      padding: 12px 20px;
      border-radius: 9999px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.3);
      z-index: 9999;
      backdrop-filter: blur(12px);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Event Listeners
  if (tabWindows) {
    tabWindows.addEventListener('click', () => updateUIForSelectedOS('windows'));
  }

  if (tabLinux) {
    tabLinux.addEventListener('click', () => updateUIForSelectedOS('linux'));
  }

  if (tabMac) {
    tabMac.addEventListener('click', (e) => {
      e.preventDefault();
      showMacToast();
    });
  }

  // Initial setup
  const detectedOS = detectClientOS();
  updateUIForSelectedOS(detectedOS);
  fetchGitHubReleases();
})();
