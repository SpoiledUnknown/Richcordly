<template>
  <main class="flex-1 min-w-0 flex flex-col overflow-y-auto px-2 lg:px-4 pr-1">
    <div class="flex flex-col w-full gap-5 pb-6">
      <!-- Top Context Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] font-semibold tracking-wider text-purple-300 uppercase">
              Workspace / Configuration
            </span>
            <span class="text-slate-600 text-xs">/</span>
            <span class="font-mono text-[11px] text-sky-400 flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">sync_alt</span>
              v2.4.0 Engine
            </span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Profile Manager</h1>
          <p class="text-xs text-slate-400 max-w-xl leading-relaxed">
            Create, customize, and switch between instant Discord presence presets. Map system processes or trigger configurations on demand.
          </p>
        </div>

        <!-- Quick Action / Status Bar -->
        <div class="flex items-center gap-3 shrink-0">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121826]/90 border border-white/5 text-xs shadow-sm"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-slate-400 font-mono text-[11px]">Active:</span>
            <span class="text-white font-medium">{{ activePreset?.name }}</span>
            <span
              class="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 font-mono text-[10px] border border-white/5 ml-0.5"
            >
              {{ activePreset?.hotkey }}
            </span>
          </div>
          <button
            type="button"
            @click="createNewPreset"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-900/30 transition-all hover:shadow-violet-700/40 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[15px]">add</span>
            <span>New Preset</span>
          </button>
        </div>
      </div>

      <!-- Presets Selector Strip -->
      <div class="flex flex-col gap-2 p-3 rounded-2xl bg-[#0e1422]/80 border border-white/5 shadow-sm">
        <div class="flex items-center justify-between pb-1">
          <span class="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-medium">
            Stored Presets ({{ filteredPresets.length }})
          </span>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-slate-400">search</span>
            <input
              v-model="searchQuery"
              class="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-48 border-0 p-0"
              placeholder="Filter presets..."
              type="text"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            v-for="preset in filteredPresets"
            :key="preset.id"
            type="button"
            @click="store.selectProfile(preset)"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap',
              store.activeProfileId === preset.id
                ? 'bg-violet-600/30 border-violet-500/50 text-white shadow-sm'
                : 'bg-[#080d18] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#121826]'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="store.activeProfileId === preset.id ? 'bg-violet-400' : 'bg-slate-600'" />
            <span>{{ preset.name }}</span>
            <span class="font-mono text-[10px] text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded">
              {{ preset.category }}
            </span>
          </button>
        </div>
      </div>

      <!-- Group 1: Preset Identity & Trigger -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-[#0e1422]/75 border border-white/5 shadow-lg flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300"
            >
              <span class="material-symbols-outlined text-[18px]">badge</span>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-white tracking-wide">
                Preset Details &amp; Identity
              </h2>
              <p class="text-xs text-slate-400">Title, category tags, and quick global shortcut</p>
            </div>
          </div>
          <span
            class="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[11px]"
          >
            {{ activePreset.id }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div class="md:col-span-2 flex flex-col gap-1.5">
            <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Preset Name
            </label>
            <input
              v-model="activePreset.name"
              class="w-full bg-[#080d18] border border-white/[0.08] hover:border-white/20 focus:border-violet-500 text-xs text-white px-3.5 py-2.5 rounded-xl shadow-inner focus:outline-none transition-colors"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Hotkey Trigger
            </label>
            <div
              class="flex items-center justify-between bg-[#080d18] border border-white/[0.08] px-3.5 py-2.5 rounded-xl"
            >
              <span class="font-mono text-xs text-sky-300">{{ activePreset.hotkey }}</span>
              <button
                type="button"
                class="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
              @click="activePreset.category = cat.name"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer',
                activePreset.category === cat.name
                  ? 'bg-violet-600/30 border border-violet-500/50 text-violet-200 shadow-sm'
                  : 'bg-[#131b2e] border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#18223a]'
              ]"
            >
              <span class="material-symbols-outlined text-[15px]">{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Group 2: Process Detection & Auto-Launch -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-[#0e1422]/75 border border-white/5 shadow-lg flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300"
            >
              <span class="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-white tracking-wide">
                Process Detection &amp; Auto-Launch
              </h2>
              <p class="text-xs text-slate-400">Switch rich presence when native executable launches</p>
            </div>
          </div>
          <!-- Toggle switch -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="autoTriggerActive" class="sr-only peer" type="checkbox" />
            <div
              class="w-10 h-5 bg-slate-800 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"
            />
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
          <div class="md:col-span-7 flex flex-col gap-1.5">
            <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Executable Binary / Process Name
            </label>
            <div
              class="flex items-center bg-[#080d18] border border-white/[0.08] hover:border-white/20 focus-within:border-sky-500 px-3.5 py-2.5 rounded-xl gap-2 transition-colors"
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
          <div class="md:col-span-5 flex flex-col gap-1.5">
            <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Trigger Mode
            </label>
            <div
              class="flex items-center bg-[#080d18] border border-white/[0.08] px-3.5 py-2.5 rounded-xl text-xs text-white justify-between"
            >
              <span>{{ activePreset.triggerMode }}</span>
              <span class="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </div>
          </div>
        </div>

        <!-- Telemetry status indicator -->
        <div
          class="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#080d18] border border-white/5 font-mono text-[11px] text-slate-400"
        >
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Daemon listener active on socket</span>
          </div>
          <span class="text-sky-400">PID: 4920 • 0.2% CPU</span>
        </div>
      </section>

      <!-- Group 3: Rich Presence Payload Binding -->
      <section
        v-if="activePreset"
        class="p-5 rounded-2xl bg-[#0e1422]/75 border border-white/5 shadow-lg flex flex-col gap-4"
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
                Rich Presence Payload Binding
              </h2>
              <p class="text-xs text-slate-400">Default state broadcasts pushed when activated</p>
            </div>
          </div>
          <span
            class="font-mono text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5"
          >
            OAuth Scope: rpc
          </span>
        </div>

        <div class="flex flex-col gap-3.5 pt-1">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Application ID
            </label>
            <div
              class="flex items-center justify-between bg-[#080d18] border border-white/[0.08] px-3.5 py-2.5 rounded-xl"
            >
              <input
                v-model="activePreset.applicationId"
                class="bg-transparent font-mono text-xs text-sky-300 focus:outline-none flex-1 border-0 p-0"
                type="text"
              />
              <span
                class="px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 font-mono text-[10px] border border-white/5"
              >
                Client Application
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Details Field
              </label>
              <input
                v-model="activePreset.details"
                class="bg-[#080d18] border border-white/[0.08] hover:border-white/20 focus:border-violet-500 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none transition-colors"
                type="text"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                State Field
              </label>
              <input
                v-model="activePreset.state"
                class="bg-[#080d18] border border-white/[0.08] hover:border-white/20 focus:border-violet-500 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none transition-colors"
                type="text"
              />
            </div>
          </div>

          <!-- Summary counters -->
          <div class="grid grid-cols-3 gap-3 pt-1">
            <div class="bg-[#080d18] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Assets
              </span>
              <span class="font-mono text-xs text-white font-semibold">2 registered</span>
            </div>
            <div class="bg-[#080d18] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Timestamps
              </span>
              <span class="font-mono text-xs text-sky-400 font-semibold">Elapsed (Live)</span>
            </div>
            <div class="bg-[#080d18] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                Interactive
              </span>
              <span class="font-mono text-xs text-white font-semibold">
                {{ activePreset.buttons.length }} active
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Action Bar inside center column -->
      <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            @click="saveCurrentProfile"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-900/30 hover:shadow-violet-700/40 transition-all cursor-pointer"
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
            @click="duplicatePreset"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0e1422] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px] text-slate-400">content_copy</span>
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            @click="exportJson"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0e1422] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px] text-slate-400">download</span>
            <span>Export JSON</span>
          </button>
        </div>
        <button
          type="button"
          @click="deletePreset"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium text-xs transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">delete</span>
          <span>Delete Preset</span>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePresenceStore, type ProfilePreset } from '../stores/presenceStore'

const store = usePresenceStore()

const searchQuery = ref('')
const autoTriggerActive = ref(true)
const isSaving = ref(false)

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
  return store.presets.find((p) => p.id === store.activeProfileId)
})

function saveCurrentProfile(): void {
  isSaving.value = true
  if (activePreset.value) {
    store.selectProfile(activePreset.value)
  }
  setTimeout(() => {
    isSaving.value = false
  }, 700)
}

function duplicatePreset(): void {
  if (!activePreset.value) return
  const newId = `PR-010${store.presets.length + 1}`
  const copy: ProfilePreset = {
    ...activePreset.value,
    id: newId,
    name: `${activePreset.value.name} (Copy)`,
    hotkey: `Ctrl + Shift + ${store.presets.length + 1}`
  }
  store.presets.push(copy)
  store.selectProfile(copy)
}

function exportJson(): void {
  if (!activePreset.value) return
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePreset.value, null, 2))
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
      store.selectProfile(store.presets[0])
    }
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
    applicationId: '1092837498172983741',
    details: 'Custom Activity',
    state: 'Active state',
    largeImageKey: 'richcord_crystallite',
    largeImageText: 'Custom App',
    smallImageKey: '',
    smallImageText: '',
    buttons: []
  }
  store.presets.push(newPreset)
  store.selectProfile(newPreset)
}
</script>
