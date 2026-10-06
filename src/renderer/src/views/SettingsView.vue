<template>
  <main class="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto px-2 lg:px-4">
    <div class="flex flex-col w-full gap-5 pb-8 max-w-4xl mx-auto">
      <!-- Center Workspace Header -->
      <div class="flex flex-col gap-1 pt-1">
        <div class="flex items-center gap-2">
          <span class="font-mono text-[11px] text-primary uppercase tracking-widest font-semibold">
            Preferences
          </span>
          <span class="text-outline-variant font-mono text-[11px]">/</span>
          <span class="font-mono text-[11px] text-on-surface-variant">Client Lifecycle</span>
        </div>
        <h1 class="text-2xl font-bold text-on-surface tracking-tight">Settings &amp; Preferences</h1>
        <p class="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
          Configure desktop client lifecycle, optical atmosphere, and low-level Discord IPC socket integration.
        </p>
      </div>

      <!-- Settings Sections Grid -->
      <div class="flex flex-col gap-5">
        <!-- 1. System & Startup Island -->
        <section class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[18px]">power_settings_new</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">System &amp; Startup</h2>
                <p class="text-xs text-on-surface-variant">OS boot hooks and background execution rules</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px]">
              OS Daemon
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Toggle 1 -->
            <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Launch Richcord on system startup</span>
                <span class="text-[11px] text-on-surface-variant">Auto-initializes headless socket bridge on user login</span>
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.launchOnStartup" class="sr-only peer" type="checkbox" />
                <div class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all" />
                <div class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary" />
              </div>
            </label>

            <!-- Toggle 2 -->
            <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Start minimized to system tray</span>
                <span class="text-[11px] text-on-surface-variant">Suppress desktop window creation during automated boot</span>
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.startMinimized" class="sr-only peer" type="checkbox" />
                <div class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all" />
                <div class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary" />
              </div>
            </label>

            <!-- Toggle 3 -->
            <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Keep presence active when window is closed</span>
                <span class="text-[11px] text-on-surface-variant">Maintains active rich presence handshake in background</span>
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.keepPresenceOnClose" class="sr-only peer" type="checkbox" />
                <div class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all" />
                <div class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary" />
              </div>
            </label>

            <!-- Select Action -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Close button action</span>
                <span class="text-[11px] text-on-surface-variant">Operating system window close intercept behavior</span>
              </div>
              <div class="relative shrink-0">
                <select
                  v-model="store.settings.closeAction"
                  class="appearance-none bg-surface-container-high text-on-surface text-xs pl-3.5 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none border-0"
                >
                  <option>Minimize to background tray</option>
                  <option>Quit desktop client completely</option>
                  <option>Prompt on close</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Appearance & Atmosphere Island -->
        <section class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-[18px]">palette</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">Appearance &amp; Atmosphere</h2>
                <p class="text-xs text-on-surface-variant">Luminescence, optical glass layering, and motion</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-[11px]">
              GPU Render
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Theme Dropdown -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Application Theme</span>
                <span class="text-[11px] text-on-surface-variant">Curated color matrix and translucent accents</span>
              </div>
              <div class="relative shrink-0">
                <select
                  v-model="store.settings.theme"
                  class="appearance-none bg-surface-container-high text-on-surface text-xs pl-3.5 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none border-0"
                >
                  <option>Nocturnal Precision (Dark Navy + Violet)</option>
                  <option>Deep Obsidian Monolith (Neutral Mono)</option>
                  <option>Midnight Cyan (Avionics Blue)</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <!-- Slider: Shader Intensity -->
            <div class="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-on-surface">Ambient Shader Intensity</span>
                  <span class="text-[11px] text-on-surface-variant">Background particle luminescence and gradient blur</span>
                </div>
                <span class="font-mono text-xs text-primary px-2 py-0.5 rounded-md bg-surface-container-high">
                  {{ store.settings.shaderIntensity }}%
                </span>
              </div>
              <input
                v-model.number="store.settings.shaderIntensity"
                class="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                max="100"
                min="0"
                type="range"
              />
            </div>

            <!-- Slider: Blur Density -->
            <div class="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-on-surface">Background Blur Density</span>
                  <span class="text-[11px] text-on-surface-variant">Translucent panel backdrop filter radius</span>
                </div>
                <span class="font-mono text-xs text-secondary px-2 py-0.5 rounded-md bg-surface-container-high">
                  {{ store.settings.blurDensity }}px
                </span>
              </div>
              <input
                v-model.number="store.settings.blurDensity"
                class="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                max="32"
                min="4"
                type="range"
              />
            </div>

            <!-- Toggle: Motion -->
            <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Reduce motion</span>
                <span class="text-[11px] text-on-surface-variant">Disable reactive cursor glows and continuous animation</span>
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.reduceMotion" class="sr-only peer" type="checkbox" />
                <div class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all" />
                <div class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary" />
              </div>
            </label>
          </div>
        </section>

        <!-- 3. Discord IPC Connection Island -->
        <section class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-fixed-dim">
                <span class="material-symbols-outlined text-[18px]">hub</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">Discord IPC Connection</h2>
                <p class="text-xs text-on-surface-variant">Inter-process communication pipe channels and socket telemetry</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px]">
              Pipe v1
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Socket Pipe Selector -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Discord IPC Socket Pipe</span>
                <span class="text-[11px] text-on-surface-variant">Target named pipe Unix domain or Windows bridge</span>
              </div>
              <div class="relative shrink-0">
                <select
                  v-model="store.settings.ipcPipe"
                  class="appearance-none bg-surface-container-high text-on-surface text-xs pl-3.5 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none border-0"
                >
                  <option>Auto-detect (/pipe/discord-ipc-0)</option>
                  <option>Force Canary Pipe (/pipe/discord-ipc-1)</option>
                  <option>Force PTB Pipe (/pipe/discord-ipc-2)</option>
                  <option>Manual Custom Pipe</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <!-- Custom Client ID Field -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-on-surface">Custom Application Client ID override</span>
                <span class="text-[11px] text-on-surface-variant">
                  Default developer credential: <code class="font-mono text-tertiary">109283746592817263</code>
                </span>
              </div>
              <div class="w-full sm:w-56 shrink-0">
                <input
                  v-model="store.settings.customClientId"
                  class="w-full px-3 py-1.5 bg-surface-container-high rounded-xl text-on-surface font-mono text-xs focus:outline-none placeholder:text-outline border-0"
                  placeholder="Override ID (optional)"
                  type="text"
                />
              </div>
            </div>

            <!-- Auto Reconnect -->
            <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Auto-reconnect on Discord restart</span>
                <span class="text-[11px] text-on-surface-variant">Silently reconnect handshake pipe without triggering alerts</span>
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.autoReconnect" class="sr-only peer" type="checkbox" />
                <div class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all" />
                <div class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary" />
              </div>
            </label>

            <!-- Ping Interval Selector -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Keep-alive ping interval</span>
                <span class="text-[11px] text-on-surface-variant">Telemetry heartbeat rate to prevent socket timeout</span>
              </div>
              <div class="relative shrink-0">
                <select
                  v-model.number="store.settings.pingInterval"
                  class="appearance-none bg-surface-container-high text-on-surface text-xs pl-3.5 pr-8 py-2 rounded-xl cursor-pointer focus:outline-none border-0"
                >
                  <option :value="5">5 seconds (High Frequency)</option>
                  <option :value="15">15 seconds (Recommended)</option>
                  <option :value="30">30 seconds (Low Power)</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom Actions Bar -->
        <div class="flex items-center justify-between pt-1 px-1">
          <button
            type="button"
            @click="resetDefaults"
            class="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/5"
          >
            <span class="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset to Defaults</span>
          </button>
          <div class="flex items-center gap-3">
            <span
              class="font-mono text-xs text-secondary transition-opacity"
              :class="{ 'opacity-100': showSavedFeedback, 'opacity-0': !showSavedFeedback }"
            >
              Saved to config.json
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()
const showSavedFeedback = ref(false)

function resetDefaults(): void {
  store.settings = {
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
  }
  showSavedFeedback.value = true
  setTimeout(() => {
    showSavedFeedback.value = false
  }, 1500)
}
</script>
