<template>
  <main class="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto px-2 lg:px-4">
    <div class="flex flex-col w-full gap-5 pb-8 max-w-4xl mx-auto">
      <!-- Center Workspace Header -->
      <div class="flex flex-col gap-1 pt-1">
        <h1 class="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p class="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Configure client lifecycle, appearance atmosphere, and Discord IPC socket connection.
        </p>
      </div>

      <!-- Settings Sections Grid -->
      <div class="flex flex-col gap-5">
        <!-- 1. System & Startup Island -->
        <section
          class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary"
              >
                <span class="material-symbols-outlined text-[18px]">power_settings_new</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">System &amp; Startup</h2>
                <p class="text-xs text-on-surface-variant">
                  OS boot hooks and background execution rules
                </p>
              </div>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px]"
            >
              OS Daemon
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Toggle 1: Launch on Startup (Grayed out - Pending OS Daemon integration) -->
            <div
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 border border-white/5 opacity-40 cursor-not-allowed select-none"
              title="Launch on startup is disabled pending headless background daemon implementation."
            >
              <div class="flex flex-col pr-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-on-surface"
                    >Launch Richcord on system startup</span
                  >
                  <span
                    class="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-on-surface-variant border border-white/10"
                  >
                    Pending Daemon
                  </span>
                </div>
                <span class="text-[11px] text-on-surface-variant"
                  >Auto-initializes headless socket bridge on user login (In development)</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0 pointer-events-none">
                <div class="w-10 h-6 bg-surface-variant/50 rounded-full" />
                <div class="absolute left-1 top-1 bg-on-surface/40 w-4 h-4 rounded-full" />
              </div>
            </div>

            <!-- Toggle 2: Start Minimized -->
            <label
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface"
                  >Start minimized to system tray</span
                >
                <span class="text-[11px] text-on-surface-variant"
                  >Suppress desktop window creation during automated boot</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input
                  v-model="store.settings.startMinimized"
                  class="sr-only peer"
                  type="checkbox"
                />
                <div
                  class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all"
                />
                <div
                  class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary"
                />
              </div>
            </label>

            <!-- Toggle 3: Keep Presence on Close -->
            <label
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface"
                  >Keep presence active when window is closed</span
                >
                <span class="text-[11px] text-on-surface-variant"
                  >Maintains active rich presence handshake in background</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input
                  v-model="store.settings.keepPresenceOnClose"
                  class="sr-only peer"
                  type="checkbox"
                />
                <div
                  class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all"
                />
                <div
                  class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary"
                />
              </div>
            </label>

            <!-- Toggle 4: Process Detection & Hooking -->
            <label
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface"
                  >Process Detection &amp; Hooking</span
                >
                <span class="text-[11px] text-on-surface-variant"
                  >Global master switch to monitor native executable binaries for profile
                  automation</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input
                  v-model="store.settings.processDetectionEnabled"
                  class="sr-only peer"
                  type="checkbox"
                />
                <div
                  class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all"
                />
                <div
                  class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary"
                />
              </div>
            </label>

            <!-- Select Action: Close Button Intercept -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Close button action</span>
                <span class="text-[11px] text-on-surface-variant"
                  >Operating system window close intercept behavior</span
                >
              </div>
              <div ref="closeActionRef" class="relative shrink-0">
                <button
                  type="button"
                  class="flex items-center justify-between gap-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs pl-3.5 pr-2.5 py-2 rounded-xl cursor-pointer focus:outline-none transition-colors border border-white/5"
                  @click.stop="toggleCloseActionDropdown"
                >
                  <span class="font-medium text-white truncate max-w-[180px] sm:max-w-none">{{
                    store.settings.closeAction
                  }}</span>
                  <span
                    class="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform"
                    :class="{ 'rotate-180': isCloseActionOpen }"
                  >
                    expand_more
                  </span>
                </button>

                <div
                  v-if="isCloseActionOpen"
                  class="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <button
                    v-for="opt in closeActionOptions"
                    :key="opt"
                    type="button"
                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left"
                    :class="
                      store.settings.closeAction === opt
                        ? 'bg-primary/20 text-white font-medium border border-primary/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    "
                    @click="selectCloseAction(opt)"
                  >
                    <span class="truncate">{{ opt }}</span>
                    <span
                      v-if="store.settings.closeAction === opt"
                      class="material-symbols-outlined text-[15px] text-primary shrink-0 ml-2"
                    >
                      check
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Appearance & Atmosphere Island -->
        <section
          class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary"
              >
                <span class="material-symbols-outlined text-[18px]">palette</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">Appearance &amp; Atmosphere</h2>
                <p class="text-xs text-on-surface-variant">
                  Luminescence, optical glass layering, and motion
                </p>
              </div>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-[11px]"
            >
              GPU Render
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Custom Theme Trigger (Replaces Application Theme dropdown) -->
            <div
              class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div class="flex flex-col pr-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-on-surface">Custom Color Theme</span>
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20"
                  >
                    {{ store.settings.customTheme?.name || 'Default' }}
                  </span>
                </div>
                <span class="text-[11px] text-on-surface-variant">
                  Curated color matrix, primary/accent luminescence, and custom ambiance
                </span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <!-- Swatch Preview -->
                <div
                  class="flex items-center -space-x-1.5 p-1 rounded-lg bg-surface-container-high border border-white/5"
                  title="Primary / Accent / Background"
                >
                  <div
                    class="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                    :style="{
                      backgroundColor: store.settings.customTheme?.primaryColor || '#d0bcff'
                    }"
                  />
                  <div
                    class="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                    :style="{
                      backgroundColor: store.settings.customTheme?.accentColor || '#7bd0ff'
                    }"
                  />
                  <div
                    class="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                    :style="{
                      backgroundColor: store.settings.customTheme?.backgroundColor || '#070b14'
                    }"
                  />
                </div>
                <!-- Open Theme Customizer Modal Button -->
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 text-primary text-xs font-medium transition-all flex items-center gap-1.5 border border-primary/25 cursor-pointer shadow-sm active:scale-95"
                  @click="openThemeModal"
                >
                  <span class="material-symbols-outlined text-[16px]">tune</span>
                  <span>Customize Theme</span>
                </button>
              </div>
            </div>

            <!-- Slider: Shader Intensity -->
            <div class="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-on-surface"
                    >Ambient Shader Intensity</span
                  >
                  <span class="text-[11px] text-on-surface-variant"
                    >Background particle luminescence and gradient blur</span
                  >
                </div>
                <span
                  class="font-mono text-xs text-primary px-2 py-0.5 rounded-md bg-surface-container-high"
                >
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
                  <span class="text-[11px] text-on-surface-variant"
                    >Translucent panel backdrop filter radius</span
                  >
                </div>
                <span
                  class="font-mono text-xs text-secondary px-2 py-0.5 rounded-md bg-surface-container-high"
                >
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
            <label
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Reduce motion</span>
                <span class="text-[11px] text-on-surface-variant"
                  >Disable reactive cursor glows and continuous animation</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input v-model="store.settings.reduceMotion" class="sr-only peer" type="checkbox" />
                <div
                  class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all"
                />
                <div
                  class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary"
                />
              </div>
            </label>
          </div>
        </section>

        <!-- 3. Discord IPC Connection Island -->
        <section
          class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-fixed-dim"
              >
                <span class="material-symbols-outlined text-[18px]">hub</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">Discord IPC Connection</h2>
                <p class="text-xs text-on-surface-variant">
                  Inter-process communication pipe channels and socket telemetry
                </p>
              </div>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px]"
            >
              Pipe v1
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-1">
            <!-- Socket Pipe Selector -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Discord IPC Socket Pipe</span>
                <span class="text-[11px] text-on-surface-variant"
                  >Target named pipe Unix domain or Windows bridge</span
                >
              </div>
              <div ref="ipcPipeRef" class="relative shrink-0">
                <button
                  type="button"
                  class="flex items-center justify-between gap-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs pl-3.5 pr-2.5 py-2 rounded-xl cursor-pointer focus:outline-none transition-colors border border-white/5"
                  @click.stop="toggleIpcPipeDropdown"
                >
                  <span class="font-medium text-white truncate max-w-[180px] sm:max-w-none">{{
                    store.settings.ipcPipe
                  }}</span>
                  <span
                    class="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform"
                    :class="{ 'rotate-180': isIpcPipeOpen }"
                  >
                    expand_more
                  </span>
                </button>

                <div
                  v-if="isIpcPipeOpen"
                  class="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <button
                    v-for="opt in ipcPipeOptions"
                    :key="opt"
                    type="button"
                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left"
                    :class="
                      store.settings.ipcPipe === opt
                        ? 'bg-primary/20 text-white font-medium border border-primary/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    "
                    @click="selectIpcPipe(opt)"
                  >
                    <span class="truncate">{{ opt }}</span>
                    <span
                      v-if="store.settings.ipcPipe === opt"
                      class="material-symbols-outlined text-[15px] text-primary shrink-0 ml-2"
                    >
                      check
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Custom Client ID Field -->
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low"
            >
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-on-surface"
                  >Custom Application Client ID override</span
                >
                <span class="text-[11px] text-on-surface-variant">
                  Default developer credential:
                  <code class="font-mono text-tertiary">109283746592817263</code>
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
            <label
              class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface"
                  >Auto-reconnect on Discord restart</span
                >
                <span class="text-[11px] text-on-surface-variant"
                  >Silently reconnect handshake pipe without triggering alerts</span
                >
              </div>
              <div class="relative inline-flex items-center shrink-0">
                <input
                  v-model="store.settings.autoReconnect"
                  class="sr-only peer"
                  type="checkbox"
                />
                <div
                  class="w-10 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container transition-all"
                />
                <div
                  class="absolute left-1 top-1 bg-on-surface w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-on-primary"
                />
              </div>
            </label>

            <!-- Ping Interval Selector -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div class="flex flex-col pr-4">
                <span class="text-xs font-semibold text-on-surface">Keep-alive ping interval</span>
                <span class="text-[11px] text-on-surface-variant"
                  >Telemetry heartbeat rate to prevent socket timeout</span
                >
              </div>
              <div ref="pingIntervalRef" class="relative shrink-0">
                <button
                  type="button"
                  class="flex items-center justify-between gap-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs pl-3.5 pr-2.5 py-2 rounded-xl cursor-pointer focus:outline-none transition-colors border border-white/5"
                  @click.stop="togglePingIntervalDropdown"
                >
                  <span class="font-medium text-white truncate max-w-[180px] sm:max-w-none">{{
                    currentPingIntervalLabel
                  }}</span>
                  <span
                    class="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform"
                    :class="{ 'rotate-180': isPingIntervalOpen }"
                  >
                    expand_more
                  </span>
                </button>

                <div
                  v-if="isPingIntervalOpen"
                  class="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <button
                    v-for="opt in pingIntervalOptions"
                    :key="opt.value"
                    type="button"
                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left"
                    :class="
                      store.settings.pingInterval === opt.value
                        ? 'bg-primary/20 text-white font-medium border border-primary/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    "
                    @click="selectPingInterval(opt.value)"
                  >
                    <span class="truncate">{{ opt.label }}</span>
                    <span
                      v-if="store.settings.pingInterval === opt.value"
                      class="material-symbols-outlined text-[15px] text-primary shrink-0 ml-2"
                    >
                      check
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Client Updates & Engine Island -->
        <section
          class="rounded-2xl bg-surface-container/70 p-5 shadow-xl flex flex-col gap-4 border border-white/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary"
              >
                <span class="material-symbols-outlined text-[18px]">cloud_sync</span>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-on-surface">Client Updates &amp; Engine</h2>
                <p class="text-xs text-on-surface-variant">
                  Automated release telemetry via Richcord engine
                </p>
              </div>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full font-mono text-[11px]"
              :class="
                store.updateState.hasUpdate
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-surface-container-high text-primary'
              "
            >
              {{ store.updateState.hasUpdate ? 'Update Available' : 'Up to Date' }}
            </span>
          </div>

          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-on-surface">Installed Version</span>
                <span class="font-mono text-xs text-primary font-bold">
                  {{ formatVersion(store.updateState.currentVersion) }}
                </span>
                <span
                  v-if="store.updateState.hasUpdate"
                  class="text-[11px] text-amber-400 font-medium"
                >
                  &rarr; {{ formatVersion(store.updateState.latestVersion) }} available
                </span>
              </div>
              <div class="flex items-center gap-2.5 text-[11px] text-on-surface-variant font-mono">
                <span>Channel: {{ store.updateState.channel || 'Stable' }}</span>
                <span>&bull;</span>
                <span>
                  Upstream:
                  {{ formatVersion(store.updateState.latestVersion) }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="store.updateState.hasUpdate"
                type="button"
                class="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-black font-semibold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                :disabled="store.updateState.isApplying"
                @click="store.applyUpdate()"
              >
                <span
                  class="material-symbols-outlined text-[16px]"
                  :class="{ 'animate-spin': store.updateState.isApplying }"
                >
                  {{ store.updateState.isApplying ? 'sync' : 'upgrade' }}
                </span>
                <span>{{ store.updateState.isApplying ? 'Applying...' : 'Update Now' }}</span>
              </button>
              <button
                type="button"
                class="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-medium transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer active:scale-95"
                :disabled="store.updateState.isChecking"
                @click="store.checkAndPromptUpdate()"
              >
                <span
                  class="material-symbols-outlined text-[16px]"
                  :class="{ 'animate-spin': store.updateState.isChecking }"
                >
                  refresh
                </span>
                <span>{{
                  store.updateState.isChecking ? 'Checking...' : 'Check for Updates'
                }}</span>
              </button>
            </div>
          </div>

          <!-- What's New Snippet if present -->
          <div
            v-if="store.updateState.githubApiAllowed && store.updateState.releaseNotes"
            class="p-3.5 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                What's New in {{ store.updateState.latestVersion }}
              </span>
              <span class="text-[10px] text-slate-500 font-mono">GitHub Official</span>
            </div>
            <p class="text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
              {{ store.updateState.releaseNotes.trim() }}
            </p>
          </div>
        </section>

        <!-- Bottom Actions Bar (Reset to Defaults, Load Settings, Export Settings) -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-1 px-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <!-- Reset to Defaults Button -->
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/5 shadow-sm active:scale-95"
              @click="handleReset"
            >
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset to Defaults</span>
            </button>

            <!-- Load Settings Button -->
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/5 shadow-sm active:scale-95"
              @click="triggerFileInput"
            >
              <span class="material-symbols-outlined text-[16px]">file_upload</span>
              <span>Load Settings</span>
            </button>
            <input
              ref="fileInputRef"
              type="file"
              accept=".json,application/json"
              class="hidden"
              @change="onFileSelected"
            />

            <!-- Export Settings Button -->
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/5 shadow-sm active:scale-95"
              @click="handleExport"
            >
              <span class="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Settings</span>
            </button>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="font-mono text-xs transition-opacity"
              :class="[
                statusIsError ? 'text-rose-400' : 'text-secondary',
                statusMessage ? 'opacity-100' : 'opacity-0'
              ]"
            >
              {{ statusMessage }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Centered Custom Color Theme Modal with Background Blur -->
    <Teleport to="body">
      <Transition name="theme-modal">
        <div
          v-if="isThemeModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          @click.self="closeThemeModal"
        >
          <div
            class="relative w-full max-w-lg bg-surface-container/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 gap-5"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-3 border-b border-white/5">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20"
                >
                  <span class="material-symbols-outlined text-[18px]">palette</span>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-on-surface">Custom Color Theme</h3>
                  <p class="text-[11px] text-on-surface-variant">
                    Design and apply your personalized visual scheme
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="w-7 h-7 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                @click="closeThemeModal"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <!-- Quick Presets -->
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                Curated Presets
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="preset in themePresets"
                  :key="preset.name"
                  type="button"
                  class="flex items-center gap-2 p-2 rounded-xl border transition-all text-left cursor-pointer"
                  :class="
                    tempTheme.name === preset.name
                      ? 'bg-primary/15 border-primary text-white shadow-sm'
                      : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/15 hover:text-on-surface'
                  "
                  @click="applyPreset(preset)"
                >
                  <div class="flex items-center -space-x-1 shrink-0">
                    <span
                      class="w-3.5 h-3.5 rounded-full border border-black/30"
                      :style="{ backgroundColor: preset.primaryColor }"
                    />
                    <span
                      class="w-3.5 h-3.5 rounded-full border border-black/30"
                      :style="{ backgroundColor: preset.accentColor }"
                    />
                  </div>
                  <span class="text-xs font-medium truncate">{{ preset.name }}</span>
                </button>
              </div>
            </div>

            <!-- Theme Name Field -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                Theme Title
              </label>
              <input
                v-model="tempTheme.name"
                type="text"
                placeholder="e.g. Cyber Matrix"
                class="px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <!-- Color Controls Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Primary Color -->
              <div
                class="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-white/5"
              >
                <div
                  class="text-[11px] font-semibold text-on-surface flex items-center justify-between"
                >
                  <span>Primary</span>
                  <span
                    class="w-3 h-3 rounded-full border border-black/30"
                    :style="{ backgroundColor: tempTheme.primaryColor }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="tempTheme.primaryColor"
                    type="color"
                    class="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <input
                    v-model="tempTheme.primaryColor"
                    type="text"
                    class="w-full bg-surface-container-high rounded-lg px-2 py-1 font-mono text-[11px] text-on-surface uppercase border-0 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Accent Color -->
              <div
                class="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-white/5"
              >
                <div
                  class="text-[11px] font-semibold text-on-surface flex items-center justify-between"
                >
                  <span>Accent</span>
                  <span
                    class="w-3 h-3 rounded-full border border-black/30"
                    :style="{ backgroundColor: tempTheme.accentColor }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="tempTheme.accentColor"
                    type="color"
                    class="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <input
                    v-model="tempTheme.accentColor"
                    type="text"
                    class="w-full bg-surface-container-high rounded-lg px-2 py-1 font-mono text-[11px] text-on-surface uppercase border-0 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Background Base -->
              <div
                class="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-white/5"
              >
                <div
                  class="text-[11px] font-semibold text-on-surface flex items-center justify-between"
                >
                  <span>Background</span>
                  <span
                    class="w-3 h-3 rounded-full border border-black/30"
                    :style="{ backgroundColor: tempTheme.backgroundColor }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="tempTheme.backgroundColor"
                    type="color"
                    class="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <input
                    v-model="tempTheme.backgroundColor"
                    type="text"
                    class="w-full bg-surface-container-high rounded-lg px-2 py-1 font-mono text-[11px] text-on-surface uppercase border-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Live Preview Card -->
            <div
              class="p-4 rounded-xl border border-white/10 flex items-center justify-between transition-colors shadow-inner"
              :style="{ backgroundColor: tempTheme.backgroundColor }"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-md"
                  :style="{ backgroundColor: tempTheme.primaryColor, color: '#000000' }"
                >
                  RC
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-white">
                    {{ tempTheme.name || 'Custom Theme' }}
                  </span>
                  <span class="text-[10px] font-medium" :style="{ color: tempTheme.accentColor }">
                    Rich Presence Handshake Active
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-md pointer-events-none"
                :style="{ backgroundColor: tempTheme.primaryColor, color: '#000000' }"
              >
                Button Preview
              </button>
            </div>

            <!-- Modal Footer Actions -->
            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
              <button
                type="button"
                class="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface text-xs font-medium transition-colors cursor-pointer"
                @click="closeThemeModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-xl bg-primary text-black font-semibold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                @click="saveCustomTheme"
              >
                <span class="material-symbols-outlined text-[16px]">check</span>
                <span>Apply &amp; Save Theme</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePresenceStore, AppSettings, CustomThemeData } from '../stores/presenceStore'

const store = usePresenceStore()
const statusMessage = ref('')
const statusIsError = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Dropdown Menus State & Refs
const isCloseActionOpen = ref(false)
const isIpcPipeOpen = ref(false)
const isPingIntervalOpen = ref(false)

const closeActionRef = ref<HTMLElement | null>(null)
const ipcPipeRef = ref<HTMLElement | null>(null)
const pingIntervalRef = ref<HTMLElement | null>(null)

const closeActionOptions: AppSettings['closeAction'][] = [
  'Minimize to background tray',
  'Quit desktop client completely'
]

const ipcPipeOptions = [
  'Auto-detect (/pipe/discord-ipc-0)',
  'Force Canary Pipe (/pipe/discord-ipc-1)',
  'Force PTB Pipe (/pipe/discord-ipc-2)',
  'Manual Custom Pipe'
]

const pingIntervalOptions = [
  { value: 5, label: '5 seconds (High Frequency)' },
  { value: 15, label: '15 seconds (Recommended)' },
  { value: 30, label: '30 seconds (Low Power)' }
]

const currentPingIntervalLabel = computed(() => {
  const match = pingIntervalOptions.find((opt) => opt.value === store.settings.pingInterval)
  return match ? match.label : `${store.settings.pingInterval}s`
})

function toggleCloseActionDropdown(): void {
  isCloseActionOpen.value = !isCloseActionOpen.value
  if (isCloseActionOpen.value) {
    isIpcPipeOpen.value = false
    isPingIntervalOpen.value = false
  }
}

function toggleIpcPipeDropdown(): void {
  isIpcPipeOpen.value = !isIpcPipeOpen.value
  if (isIpcPipeOpen.value) {
    isCloseActionOpen.value = false
    isPingIntervalOpen.value = false
  }
}

function togglePingIntervalDropdown(): void {
  isPingIntervalOpen.value = !isPingIntervalOpen.value
  if (isPingIntervalOpen.value) {
    isCloseActionOpen.value = false
    isIpcPipeOpen.value = false
  }
}

function selectCloseAction(val: AppSettings['closeAction']): void {
  store.settings.closeAction = val
  isCloseActionOpen.value = false
  store.saveSettings()
}

function selectIpcPipe(val: string): void {
  store.settings.ipcPipe = val
  isIpcPipeOpen.value = false
  store.saveSettings()
}

function selectPingInterval(val: number): void {
  store.settings.pingInterval = val
  isPingIntervalOpen.value = false
  store.saveSettings()
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node
  if (closeActionRef.value && !closeActionRef.value.contains(target)) {
    isCloseActionOpen.value = false
  }
  if (ipcPipeRef.value && !ipcPipeRef.value.contains(target)) {
    isIpcPipeOpen.value = false
  }
  if (pingIntervalRef.value && !pingIntervalRef.value.contains(target)) {
    isPingIntervalOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

function formatVersion(ver?: string): string {
  if (!ver || !ver.trim()) return 'v1.0.0'
  const v = ver.trim().replace(/^v/i, '')
  return `v${v || '1.0.0'}`
}

// Modal State
const isThemeModalOpen = ref(false)
const tempTheme = ref<CustomThemeData>({
  name: 'Nocturnal Violet',
  primaryColor: '#8b5cf6',
  accentColor: '#38bdf8',
  backgroundColor: '#070b14'
})

const themePresets: CustomThemeData[] = [
  {
    name: 'Nocturnal Violet',
    primaryColor: '#8b5cf6',
    accentColor: '#38bdf8',
    backgroundColor: '#070b14'
  },
  {
    name: 'Cyberpunk Neon',
    primaryColor: '#f43f5e',
    accentColor: '#06b6d4',
    backgroundColor: '#090514'
  },
  {
    name: 'Emerald Matrix',
    primaryColor: '#10b981',
    accentColor: '#34d399',
    backgroundColor: '#03140d'
  },
  {
    name: 'Deep Obsidian',
    primaryColor: '#94a3b8',
    accentColor: '#64748b',
    backgroundColor: '#050508'
  },
  {
    name: 'Sunset Amber',
    primaryColor: '#f59e0b',
    accentColor: '#ec4899',
    backgroundColor: '#140909'
  },
  {
    name: 'Midnight Cyan',
    primaryColor: '#38bdf8',
    accentColor: '#818cf8',
    backgroundColor: '#060d1a'
  }
]

function openThemeModal(): void {
  const current = store.settings.customTheme || themePresets[0]
  tempTheme.value = {
    name: current.name,
    primaryColor: current.primaryColor,
    accentColor: current.accentColor,
    backgroundColor: current.backgroundColor
  }
  isThemeModalOpen.value = true
}

function closeThemeModal(): void {
  isThemeModalOpen.value = false
}

function applyPreset(preset: CustomThemeData): void {
  tempTheme.value = { ...preset }
}

async function saveCustomTheme(): Promise<void> {
  const newTheme = { ...tempTheme.value }
  store.settings.customTheme = newTheme
  store.settings.theme = newTheme.name
  store.applyThemeToDom(newTheme)
  await store.saveSettings()
  isThemeModalOpen.value = false
  notifyStatus('Custom theme applied & saved')
}

function notifyStatus(msg: string, isError = false): void {
  statusMessage.value = msg
  statusIsError.value = isError
  setTimeout(() => {
    statusMessage.value = ''
    statusIsError.value = false
  }, 2200)
}

async function handleReset(): Promise<void> {
  await store.resetSettings()
  notifyStatus('Settings reset to defaults')
}

function handleExport(): void {
  store.exportSettings()
  notifyStatus('Settings exported to JSON')
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

function onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.json')) {
    notifyStatus('Please select a valid .json file', true)
    target.value = ''
    return
  }

  if (file.size > 1024 * 1024) {
    notifyStatus('File is too large (max 1 MB)', true)
    target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = async (e): Promise<void> => {
    try {
      const content = e.target?.result as string
      const result = await store.importSettings(content)
      if (result.success) {
        notifyStatus('Settings loaded successfully')
      } else {
        notifyStatus(result.error || 'Invalid settings JSON format', true)
      }
    } catch {
      notifyStatus('Failed to parse settings file', true)
    } finally {
      target.value = ''
    }
  }
  reader.onerror = () => {
    notifyStatus('Failed to read file from disk', true)
    target.value = ''
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.theme-modal-enter-active,
.theme-modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.theme-modal-enter-from,
.theme-modal-leave-to {
  opacity: 0;
}
</style>
