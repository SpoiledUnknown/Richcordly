<template>
  <main class="flex-1 min-w-0 flex flex-col overflow-y-auto px-2 lg:px-4 pr-1">
    <div class="flex flex-col w-full gap-5 pb-6">
      <!-- Top Context Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-white tracking-tight">Profile Manager</h1>
          <p class="text-xs text-slate-400 max-w-xl leading-relaxed">
            Create, customize, and switch between instant Discord presence presets. Map system
            processes or trigger configurations on demand.
          </p>
        </div>

        <!-- Quick Action / Status Bar -->
        <div class="flex items-center gap-3 shrink-0">
          <div
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container/90 border border-white/5 text-xs shadow-sm"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span class="text-white font-medium">{{ activePreset?.name }}</span>
          </div>
          <button
            type="button"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-900/30 transition-all hover:shadow-violet-700/40 cursor-pointer"
            @click="createNewPreset"
          >
            <span class="material-symbols-outlined text-[15px]">add</span>
            <span>New Preset</span>
          </button>
        </div>
      </div>

      <!-- Stored Presets Dropdown Strip -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container/80 border border-white/5 shadow-sm relative z-20"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined text-[16px]">layers</span>
          </div>
          <span class="text-xs font-semibold text-white">Stored Presets</span>
          <span
            class="px-2 py-0.5 rounded-full bg-surface-container-high text-slate-400 font-mono text-[10px]"
          >
            {{ store.presets.length }}
          </span>
        </div>

        <!-- Dropdown Container -->
        <div ref="dropdownRef" class="relative">
          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-white/10 text-xs text-white transition-all cursor-pointer shadow-sm w-full sm:w-72 justify-between"
            @click.stop="isPresetDropdownOpen = !isPresetDropdownOpen"
          >
            <div class="flex items-center gap-2 truncate">
              <span class="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
              <span class="font-medium truncate">{{ activePreset?.name || 'Select Preset' }}</span>
              <span
                v-if="activePreset?.category"
                class="font-mono text-[10px] text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded shrink-0"
              >
                {{ activePreset.category }}
              </span>
            </div>
            <span
              class="material-symbols-outlined text-[18px] text-slate-400 transition-transform"
              :class="{ 'rotate-180': isPresetDropdownOpen }"
            >
              expand_more
            </span>
          </button>

          <div
            v-if="isPresetDropdownOpen"
            class="absolute right-0 top-full mt-2 w-full sm:w-80 rounded-2xl bg-surface-container/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-72 overflow-y-auto"
          >
            <!-- Search filter if presets > 3 -->
            <div
              v-if="store.presets.length > 3"
              class="flex items-center gap-2 px-3 py-1.5 mb-1 rounded-xl bg-surface-container-low border border-white/5"
              @click.stop
            >
              <span class="material-symbols-outlined text-[15px] text-slate-400">search</span>
              <input
                v-model="searchQuery"
                class="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-full border-0 p-0"
                placeholder="Filter presets..."
                type="text"
                @click.stop
              />
            </div>

            <!-- Preset items -->
            <button
              v-for="preset in filteredPresets"
              :key="preset.id"
              type="button"
              class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left"
              :class="
                store.activeProfileId === preset.id
                  ? 'bg-violet-600/25 text-white font-medium border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              "
              @click="selectAndClose(preset)"
            >
              <div class="flex items-center gap-2 truncate">
                <span
                  class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="store.activeProfileId === preset.id ? 'bg-violet-400' : 'bg-slate-600'"
                />
                <span class="truncate">{{ preset.name }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span
                  class="font-mono text-[10px] text-slate-400 bg-white/[0.06] px-1.5 py-0.5 rounded"
                >
                  {{ preset.category }}
                </span>
                <span
                  v-if="store.activeProfileId === preset.id"
                  class="material-symbols-outlined text-[15px] text-violet-400"
                >
                  check
                </span>
              </div>
            </button>

            <!-- Separate Span with button to add more presets -->
            <span class="block pt-1.5 mt-1 border-t border-white/10">
              <button
                type="button"
                class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 text-violet-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                @click="addPresetFromDropdown"
              >
                <span class="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Add More Presets</span>
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Group 1: Preset Identity & Trigger -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-surface-container/75 border border-white/5 shadow-lg flex flex-col gap-4"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300"
          >
            <span class="material-symbols-outlined text-[18px]">badge</span>
          </div>
          <h2 class="text-sm font-semibold text-white tracking-wide">
            Preset Details &amp; Identity
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <!-- Preset Name (50 characters limit) -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Preset Name
              </label>
              <span class="text-[10px] font-mono text-slate-500">
                {{ (activePreset.name || '').length }}/50
              </span>
            </div>
            <input
              v-model="activePreset.name"
              maxlength="50"
              class="w-full h-10 bg-surface-container-low border border-white/[0.08] hover:border-white/20 focus:border-violet-500 text-xs text-white px-3.5 py-2.5 rounded-xl shadow-inner focus:outline-none transition-colors"
              placeholder="Enter preset name (max 50 chars)"
              type="text"
            />
          </div>

          <!-- Hotkey Trigger -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Hotkey Trigger
              </label>
              <span class="text-[10px] font-mono text-slate-500">Shortcut</span>
            </div>
            <div
              class="w-full h-10 flex items-center justify-between bg-surface-container-low border border-white/[0.08] hover:border-white/20 px-3.5 py-2.5 rounded-xl shadow-inner transition-colors"
            >
              <span class="font-mono text-xs text-sky-300 font-medium">{{
                activePreset.hotkey
              }}</span>
              <button
                type="button"
                class="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center"
                title="Change hotkey"
              >
                <span class="material-symbols-outlined text-[16px]">keyboard</span>
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-1">
          <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
            Category Selection
          </label>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="cat in categories"
              :key="cat.name"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
                activePreset.category === cat.name
                  ? 'bg-violet-600/30 border border-violet-500/50 text-violet-200 shadow-sm'
                  : 'bg-surface-container-high border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-surface-variant'
              ]"
              @click="activePreset.category = cat.name"
            >
              <span class="material-symbols-outlined text-[15px]">{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Group 2: Process Detection -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-surface-container/75 border border-white/5 shadow-lg flex flex-col gap-4 transition-all"
        :class="[
          !store.settings.processDetectionEnabled
            ? 'opacity-40 grayscale pointer-events-none select-none'
            : ''
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300"
            >
              <span class="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-semibold text-white tracking-wide">Process Detection</h2>
                <span
                  v-if="!store.settings.processDetectionEnabled"
                  class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/15 text-rose-300 border border-rose-500/20"
                >
                  Disabled in Settings
                </span>
              </div>
              <p class="text-xs text-slate-400">
                Switch rich presence when native executable launches
              </p>
            </div>
          </div>
          <!-- Toggle switch -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isProcessDetectionActive"
              class="sr-only peer"
              type="checkbox"
              :disabled="!store.settings.processDetectionEnabled"
            />
            <div
              class="w-10 h-5 bg-slate-800 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"
            />
          </label>
        </div>

        <!-- The entire span below the toggle: grayed out when toggle is off -->
        <span
          class="flex flex-col gap-4 transition-all"
          :class="[
            !isProcessDetectionActive ? 'opacity-40 grayscale pointer-events-none select-none' : ''
          ]"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
            <!-- Executable Binary / Process Name -->
            <div class="md:col-span-7 flex flex-col gap-1.5">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Executable Binary / Process Name
              </label>
              <div
                class="flex items-center bg-surface-container-low border border-white/[0.08] hover:border-white/20 focus-within:border-sky-500 px-3.5 py-2.5 rounded-xl gap-2 transition-colors"
              >
                <span class="font-mono text-xs text-violet-400">proc:</span>
                <input
                  v-model="activePreset.processName"
                  class="bg-transparent font-mono text-xs text-white focus:outline-none flex-1 border-0 p-0"
                  type="text"
                  placeholder="e.g. Code.exe"
                />
                <span class="material-symbols-outlined text-[16px] text-slate-500">memory</span>
              </div>
            </div>

            <!-- Trigger Mode Dropdown -->
            <div ref="triggerModeRef" class="md:col-span-5 flex flex-col gap-1.5 relative">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Trigger Mode
              </label>
              <button
                type="button"
                class="flex items-center bg-surface-container-low hover:bg-surface-container-high border border-white/[0.08] hover:border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white justify-between cursor-pointer transition-colors focus:outline-none"
                @click.stop="isTriggerModeOpen = !isTriggerModeOpen"
              >
                <span class="truncate">{{
                  activePreset.triggerMode || 'On Process Foreground'
                }}</span>
                <span
                  class="material-symbols-outlined text-[16px] text-slate-400 transition-transform"
                  :class="{ 'rotate-180': isTriggerModeOpen }"
                >
                  expand_more
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isTriggerModeOpen"
                class="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-surface-container/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50 flex flex-col gap-1"
              >
                <button
                  v-for="mode in triggerModes"
                  :key="mode"
                  type="button"
                  class="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left"
                  :class="
                    activePreset.triggerMode === mode
                      ? 'bg-violet-600/25 text-white font-medium border border-violet-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  "
                  @click="selectTriggerMode(mode)"
                >
                  <span>{{ mode }}</span>
                  <span
                    v-if="activePreset.triggerMode === mode"
                    class="material-symbols-outlined text-[15px] text-violet-400 shrink-0"
                  >
                    check
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Telemetry status indicator -->
          <div
            class="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/5 font-mono text-[11px] text-slate-400"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="isProcessDetectionActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"
              />
              <span>{{
                isProcessDetectionActive
                  ? 'Daemon listener active on socket'
                  : 'Process detection listener paused'
              }}</span>
            </div>
            <span class="text-sky-400">PID: 4920 • 0.2% CPU</span>
          </div>
        </span>
      </section>

      <!-- Group 3: Default Rich Presence Payload Binding -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-surface-container/75 border border-white/5 shadow-lg flex flex-col gap-5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300"
            >
              <span class="material-symbols-outlined text-[18px]">data_object</span>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-white tracking-wide">
                Default Rich Presence Payload
              </h2>
              <p class="text-xs text-slate-400">
                Default baseline broadcast configuration for this preset (seeded on app restart)
              </p>
            </div>
          </div>
          <span
            class="font-mono text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5"
          >
            Default Seed Value
          </span>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Application ID (Client ID) -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-[16px]">key</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-white"
                  >Discord Application ID (Client ID)</span
                >
                <span class="text-[11px] text-slate-400"
                  >Discord Snowflake ID override for this preset</span
                >
              </div>
            </div>
            <div class="w-full sm:w-64">
              <input
                v-model="activePreset.applicationId"
                class="w-full bg-[#090d18] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-sky-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                placeholder="e.g. 886576833838088243"
                type="text"
              />
            </div>
          </div>

          <!-- Basic Activity (Details & State) -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3"
          >
            <h3
              class="text-xs font-mono tracking-wider uppercase text-violet-300 font-semibold flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Basic Activity
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Details Field
                </label>
                <input
                  v-model="activePreset.details"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="What you are doing..."
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  State Field
                </label>
                <input
                  v-model="activePreset.state"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Current party/level status..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <!-- Keys & Visual Assets -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3"
          >
            <h3
              class="text-xs font-mono tracking-wider uppercase text-sky-300 font-semibold flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Keys &amp; Visual
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Large Image Key
                </label>
                <input
                  v-model="activePreset.largeImageKey"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="e.g. richcord_crystallite"
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Large Image Text
                </label>
                <input
                  v-model="activePreset.largeImageText"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Hover tooltip text..."
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Small Image Key
                </label>
                <input
                  v-model="activePreset.smallImageKey"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="e.g. vscode_badge"
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Small Image Text
                </label>
                <input
                  v-model="activePreset.smallImageText"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Hover tooltip text..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <h3
                class="text-xs font-mono tracking-wider uppercase text-purple-300 font-semibold flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Timestamps
              </h3>
              <span class="text-[11px] font-mono text-slate-500">Preset Epoch Value</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <!-- Start Time -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <label
                    class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                  >
                    Start Time (Elapsed)
                  </label>
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      class="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors cursor-pointer"
                      title="Set to Current Time"
                      @click="setPresetStartToNow"
                    >
                      Now
                    </button>
                    <button
                      v-if="activePreset.startTime"
                      type="button"
                      class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                      title="Clear Start Time"
                      @click="clearPresetStartTime"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <input
                  v-model="presetStartTimeInput"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Unix timestamp or click Now"
                  type="text"
                />
              </div>

              <!-- End Time -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <label
                    class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                  >
                    End Time (Optional)
                  </label>
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                      title="Add 30 Minutes from now"
                      @click="setPresetEndOffset(30)"
                    >
                      +30m
                    </button>
                    <button
                      type="button"
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                      title="Add 1 Hour from now"
                      @click="setPresetEndOffset(60)"
                    >
                      +1h
                    </button>
                    <button
                      v-if="activePreset.endTime"
                      type="button"
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                      title="Clear End Time"
                      @click="clearPresetEndTime"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <input
                  v-model="presetEndTimeInput"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Unix timestamp or use +30m / +1h"
                  type="text"
                />
              </div>
            </div>
          </div>

          <!-- Party Settings -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3"
          >
            <h3
              class="text-xs font-mono tracking-wider uppercase text-indigo-300 font-semibold flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Party Settings
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Party ID
                </label>
                <input
                  v-model="activePreset.partyId"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. party-alpha-1"
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Current Size
                </label>
                <input
                  v-model.number="activePreset.partySize"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono text-center focus:outline-none focus:border-indigo-500 transition-colors"
                  max="100"
                  min="1"
                  type="number"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Max Size
                </label>
                <input
                  v-model.number="activePreset.partyMax"
                  class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono text-center focus:outline-none focus:border-indigo-500 transition-colors"
                  max="100"
                  min="1"
                  type="number"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="bg-surface-container-low border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <h3
                class="text-xs font-mono tracking-wider uppercase text-violet-300 font-semibold flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Action Buttons
              </h3>
              <span class="text-[11px] font-mono text-slate-500">2 / 2 Slots</span>
            </div>
            <div class="flex flex-col gap-3">
              <!-- Button slot 1 -->
              <div
                class="flex items-center gap-3 bg-[#090d18] border border-white/10 rounded-xl p-2.5"
              >
                <span class="font-mono text-xs text-slate-500 px-2 font-medium">#1</span>
                <input
                  :value="activePreset.buttons?.[0]?.label || ''"
                  class="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  placeholder="Label"
                  type="text"
                  @input="updatePresetButton(0, 'label', ($event.target as HTMLInputElement).value)"
                />
                <input
                  :value="activePreset.buttons?.[0]?.url || ''"
                  class="flex-[2] bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-violet-500"
                  placeholder="URL"
                  type="text"
                  @input="updatePresetButton(0, 'url', ($event.target as HTMLInputElement).value)"
                />
                <button
                  type="button"
                  class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Clear button 1"
                  @click="clearPresetButton(0)"
                >
                  <span class="material-symbols-outlined text-[17px]">delete</span>
                </button>
              </div>
              <!-- Button slot 2 -->
              <div
                class="flex items-center gap-3 bg-[#090d18] border border-white/10 rounded-xl p-2.5"
              >
                <span class="font-mono text-xs text-slate-500 px-2 font-medium">#2</span>
                <input
                  :value="activePreset.buttons?.[1]?.label || ''"
                  class="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  placeholder="Label"
                  type="text"
                  @input="updatePresetButton(1, 'label', ($event.target as HTMLInputElement).value)"
                />
                <input
                  :value="activePreset.buttons?.[1]?.url || ''"
                  class="flex-[2] bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-violet-500"
                  placeholder="URL"
                  type="text"
                  @input="updatePresetButton(1, 'url', ($event.target as HTMLInputElement).value)"
                />
                <button
                  type="button"
                  class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Clear button 2"
                  @click="clearPresetButton(1)"
                >
                  <span class="material-symbols-outlined text-[17px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Action Bar inside center column -->
      <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-900/30 hover:shadow-violet-700/40 transition-all cursor-pointer"
            @click="saveCurrentProfile"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :class="{ 'animate-spin': isSaving }"
            >
              {{ isSaving ? 'sync' : 'check' }}
            </span>
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            @click="duplicatePreset"
          >
            <span class="material-symbols-outlined text-[16px] text-slate-400">content_copy</span>
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            @click="exportJson"
          >
            <span class="material-symbols-outlined text-[16px] text-slate-400">download</span>
            <span>Export JSON</span>
          </button>
          <!-- Load JSON Button -->
          <button
            type="button"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            @click="triggerProfileFileInput"
          >
            <span class="material-symbols-outlined text-[16px] text-slate-400">upload</span>
            <span>Load JSON</span>
          </button>
          <input
            ref="profileFileInputRef"
            type="file"
            accept=".json,application/json"
            class="hidden"
            @change="onProfileFileSelected"
          />
        </div>
        <div class="flex items-center gap-3">
          <span
            class="font-mono text-xs transition-opacity"
            :class="[
              profileStatusIsError ? 'text-rose-400' : 'text-emerald-400',
              profileStatusMessage ? 'opacity-100' : 'opacity-0'
            ]"
          >
            {{ profileStatusMessage }}
          </span>
          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium text-xs transition-colors cursor-pointer"
            @click="deletePreset"
          >
            <span class="material-symbols-outlined text-[16px]">delete</span>
            <span>Delete Preset</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePresenceStore, type ProfilePreset } from '../stores/presenceStore'

const store = usePresenceStore()

const searchQuery = ref('')
const isSaving = ref(false)

// Preset Selector Dropdown
const isPresetDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Trigger Mode Dropdown
const isTriggerModeOpen = ref(false)
const triggerModeRef = ref<HTMLElement | null>(null)
const triggerModes = ['On Process Foreground', 'On Process Running', 'Manual Trigger Only']

function selectTriggerMode(mode: string): void {
  if (activePreset.value) {
    activePreset.value.triggerMode = mode
  }
  isTriggerModeOpen.value = false
}

function selectAndClose(preset: ProfilePreset): void {
  store.activeProfileId = preset.id
  isPresetDropdownOpen.value = false
}

function addPresetFromDropdown(): void {
  createNewPreset()
  isPresetDropdownOpen.value = false
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isPresetDropdownOpen.value = false
  }
  if (triggerModeRef.value && !triggerModeRef.value.contains(target)) {
    isTriggerModeOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const categories = [
  { name: 'Coding' as const, icon: 'code' },
  { name: 'Gaming' as const, icon: 'sports_esports' },
  { name: 'Music' as const, icon: 'graphic_eq' },
  { name: 'Creative' as const, icon: 'draw' },
  { name: 'Idle' as const, icon: 'bedtime' }
]

const filteredPresets = computed(() => {
  if (!searchQuery.value.trim()) return store.presets
  const q = searchQuery.value.toLowerCase()
  return store.presets.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.processName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
  )
})

const activePreset = computed(() => {
  return store.presets.find((p) => p.id === store.activeProfileId) || store.presets[0]
})

// Process Detection active state
const isProcessDetectionActive = computed({
  get: () => activePreset.value?.autoTrigger !== false,
  set: (val: boolean) => {
    if (activePreset.value) {
      activePreset.value.autoTrigger = val
    }
  }
})

// Timestamps Helpers
const presetStartTimeInput = computed({
  get: () => (activePreset.value?.startTime ? String(activePreset.value.startTime) : ''),
  set: (val: string) => {
    if (!activePreset.value) return
    const trimmed = val.trim()
    activePreset.value.startTime = trimmed ? Number(trimmed) || null : null
  }
})

const presetEndTimeInput = computed({
  get: () => (activePreset.value?.endTime ? String(activePreset.value.endTime) : ''),
  set: (val: string) => {
    if (!activePreset.value) return
    const trimmed = val.trim()
    activePreset.value.endTime = trimmed ? Number(trimmed) || null : null
  }
})

function setPresetStartToNow(): void {
  if (activePreset.value) activePreset.value.startTime = Date.now()
}

function clearPresetStartTime(): void {
  if (activePreset.value) activePreset.value.startTime = null
}

function setPresetEndOffset(minutes: number): void {
  if (activePreset.value) activePreset.value.endTime = Date.now() + minutes * 60 * 1000
}

function clearPresetEndTime(): void {
  if (activePreset.value) activePreset.value.endTime = null
}

// Action Buttons Helpers
function updatePresetButton(index: number, field: 'label' | 'url', val: string): void {
  if (!activePreset.value) return
  if (!activePreset.value.buttons) activePreset.value.buttons = []
  while (activePreset.value.buttons.length <= index) {
    activePreset.value.buttons.push({ label: '', url: '' })
  }
  activePreset.value.buttons[index][field] = val
}

function clearPresetButton(index: number): void {
  if (!activePreset.value?.buttons?.[index]) return
  activePreset.value.buttons[index] = { label: '', url: '' }
}

function saveCurrentProfile(): void {
  if (!activePreset.value) return
  isSaving.value = true
  store.savePresets()
  setTimeout(() => {
    isSaving.value = false
  }, 400)
}

function duplicatePreset(): void {
  if (!activePreset.value) return
  const newId = `PR-010${store.presets.length + 1}`
  const copy: ProfilePreset = {
    ...activePreset.value,
    id: newId,
    name: `${activePreset.value.name} (Copy)`.slice(0, 50),
    hotkey: `Ctrl + Shift + ${store.presets.length + 1}`,
    buttons: activePreset.value.buttons ? activePreset.value.buttons.map((b) => ({ ...b })) : []
  }
  store.presets.push(copy)
  store.activeProfileId = newId
  store.savePresets()
}

function exportJson(): void {
  if (!activePreset.value) return
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(activePreset.value, null, 2))
  const dl = document.createElement('a')
  dl.setAttribute('href', dataStr)
  dl.setAttribute('download', `${activePreset.value.name.toLowerCase().replace(/\s+/g, '_')}.json`)
  dl.click()
}

function deletePreset(): void {
  if (store.presets.length <= 1) return
  const idx = store.presets.findIndex((p) => p.id === store.activeProfileId)
  if (idx !== -1) {
    store.presets.splice(idx, 1)
    if (store.presets[0]) {
      store.activeProfileId = store.presets[0].id
    }
    store.savePresets()
  }
}

function createNewPreset(): void {
  const newId = `PR-010${store.presets.length + 1}`
  const newPreset: ProfilePreset = {
    id: newId,
    name: 'New Custom Presence',
    hotkey: `Ctrl + Shift + ${store.presets.length + 1}`,
    category: 'Coding',
    processName: '',
    triggerMode: 'On Process Foreground',
    autoTrigger: true,
    applicationId: '1092837498172983741',
    details: 'Custom Activity',
    state: 'Active state',
    largeImageKey: 'richcord_crystallite',
    largeImageText: 'Custom App',
    smallImageKey: '',
    smallImageText: '',
    startTime: null,
    endTime: null,
    partyId: '',
    partySize: 1,
    partyMax: 5,
    buttons: [
      { label: '', url: '' },
      { label: '', url: '' }
    ]
  }
  store.presets.push(newPreset)
  store.activeProfileId = newId
  store.savePresets()
}

// Profile File Import Handling
const profileFileInputRef = ref<HTMLInputElement | null>(null)
const profileStatusMessage = ref('')
const profileStatusIsError = ref(false)

function notifyProfileStatus(msg: string, isError = false): void {
  profileStatusMessage.value = msg
  profileStatusIsError.value = isError
  setTimeout(() => {
    profileStatusMessage.value = ''
    profileStatusIsError.value = false
  }, 2800)
}

function triggerProfileFileInput(): void {
  profileFileInputRef.value?.click()
}

function onProfileFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Verify file extension
  if (!file.name.toLowerCase().endsWith('.json')) {
    notifyProfileStatus('Please select a valid .json file', true)
    target.value = ''
    return
  }

  // Guard against oversized files
  if (file.size > 1024 * 1024) {
    notifyProfileStatus('File is too large (max 1 MB)', true)
    target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e): void => {
    try {
      const content = e.target?.result as string
      const result = store.importProfilePreset(content)
      if (result.success) {
        notifyProfileStatus(`Profile '${activePreset.value?.name}' loaded successfully`)
      } else {
        notifyProfileStatus(result.error || 'Invalid profile JSON format', true)
      }
    } catch {
      notifyProfileStatus('Failed to parse profile file', true)
    } finally {
      target.value = ''
    }
  }
  reader.onerror = () => {
    notifyProfileStatus('Failed to read file from disk', true)
    target.value = ''
  }
  reader.readAsText(file)
}
</script>
