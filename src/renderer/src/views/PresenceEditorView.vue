<template>
  <main class="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto px-2 lg:px-4">
    <div class="max-w-4xl w-full mx-auto pb-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between pt-1 pb-5 border-b border-white/[0.06]">
        <div>
          <h1 class="text-xl lg:text-2xl font-semibold tracking-tight text-white">
            Presence Editor
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Configure active Discord Rich Presence payload
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="h-9 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/5 text-xs font-mono transition-all cursor-pointer"
            @click="store.clearPresence"
          >
            Clear
          </button>
          <button
            type="button"
            class="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            :disabled="store.isUpdating"
            @click="handleUpdatePresence"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :class="{ 'animate-spin': store.isUpdating }"
            >
              {{ store.isUpdating ? 'refresh' : isSuccessFeedback ? 'check' : 'bolt' }}
            </span>
            <span>
              {{
                store.isUpdating ? 'Syncing...' : isSuccessFeedback ? 'Synced' : 'Update Presence'
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- Error notification if present -->
      <div
        v-if="store.errorMessage"
        class="mt-3 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">error</span>
          <span>{{ store.errorMessage }}</span>
        </div>
        <button
          type="button"
          class="text-rose-400 hover:text-rose-200 cursor-pointer"
          @click="store.errorMessage = null"
        >
          <span class="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>

      <!-- Form Sections -->
      <div class="mt-5 flex flex-col gap-4">
        <!-- Application Credentials & Sync Bar -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0"
            >
              <span class="material-symbols-outlined text-[18px]">key</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-white"
                >Discord Application ID (Client ID)</span
              >
              <span class="text-[11px] text-slate-400"
                >Must be a valid Discord App Snowflake ID</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="store.applicationId"
              class="bg-[#090d18] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 w-48 sm:w-56"
              placeholder="e.g. 886576833838088243"
              type="text"
            />
            <button
              type="button"
              class="h-8 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/5 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="Load configured credentials from Richcord CLI"
              @click="handleImportCli"
            >
              <span class="material-symbols-outlined text-[14px]">download</span>
              <span>Sync CLI</span>
            </button>
          </div>
        </section>

        <!-- Section 1: Basic Activity -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
        >
          <h2
            class="text-xs font-mono tracking-wider uppercase text-violet-300 font-semibold mb-3 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Basic Activity
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Details
              </label>
              <input
                v-model="store.details"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="What you are doing..."
                type="text"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                State
              </label>
              <input
                v-model="store.state"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="Current party/level status..."
                type="text"
              />
            </div>
          </div>
        </section>

        <!-- Section 2: Keys & Visual -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
        >
          <h2
            class="text-xs font-mono tracking-wider uppercase text-sky-300 font-semibold mb-3 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Keys &amp; Visual
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Large Image Key
              </label>
              <input
                v-model="store.largeImageKey"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono text-xs transition-all"
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
                v-model="store.largeImageText"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
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
                v-model="store.smallImageKey"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono text-xs transition-all"
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
                v-model="store.smallImageText"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="Hover tooltip text..."
                type="text"
              />
            </div>
          </div>
        </section>

        <!-- Section 3: Timestamps -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <h2
              class="text-xs font-mono tracking-wider uppercase text-purple-300 font-semibold flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Timestamps
            </h2>
            <span class="text-[11px] font-mono text-slate-500">Epoch Sync Active</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Time -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Start Time (Elapsed)
                </label>
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-mono text-sky-400">
                    {{ startTimePreview }}
                  </span>
                  <button
                    type="button"
                    class="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors cursor-pointer"
                    title="Set to Current Time"
                    @click="setStartToNow"
                  >
                    Now
                  </button>
                  <button
                    v-if="store.startTime"
                    type="button"
                    class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                    title="Clear Start Time"
                    @click="clearStartTime"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <input
                v-model="startTimeInput"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-xs transition-all"
                placeholder="Unix timestamp (e.g. 1786549337255) or click Now"
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
                  <span class="text-[11px] font-mono text-purple-400">
                    {{ endTimePreview }}
                  </span>
                  <button
                    type="button"
                    class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                    title="Add 30 Minutes from now"
                    @click="setEndOffset(30)"
                  >
                    +30m
                  </button>
                  <button
                    type="button"
                    class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                    title="Add 1 Hour from now"
                    @click="setEndOffset(60)"
                  >
                    +1h
                  </button>
                  <button
                    v-if="store.endTime"
                    type="button"
                    class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                    title="Clear End Time"
                    @click="clearEndTime"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <input
                v-model="endTimeInput"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-xs transition-all"
                placeholder="Unix timestamp or use +30m / +1h buttons"
                type="text"
              />
            </div>
          </div>
        </section>

        <!-- Section 4: Party Settings -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
        >
          <h2
            class="text-xs font-mono tracking-wider uppercase text-indigo-300 font-semibold mb-3 flex items-center gap-2"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Party Settings
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
              >
                Party ID
              </label>
              <input
                v-model="store.partyId"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                v-model.number="store.partySize"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono text-xs text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                v-model.number="store.partyMax"
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono text-xs text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                max="100"
                min="1"
                type="number"
              />
            </div>
          </div>
        </section>

        <!-- Section 5: Action Buttons -->
        <section
          class="bg-surface-container/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <h2
              class="text-xs font-mono tracking-wider uppercase text-violet-300 font-semibold flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Action Buttons
            </h2>
            <span class="text-[11px] font-mono text-slate-500">2 / 2 Slots</span>
          </div>
          <div class="flex flex-col gap-3">
            <!-- Button slot 1 -->
            <div
              class="flex items-center gap-3 bg-[#090d18] border border-white/10 rounded-xl p-2.5"
            >
              <span class="font-mono text-xs text-slate-500 px-2 font-medium">#1</span>
              <input
                v-model="store.button1.label"
                class="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                placeholder="Label"
                type="text"
              />
              <input
                v-model="store.button1.url"
                class="flex-[2] bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-violet-500"
                placeholder="URL"
                type="text"
              />
              <button
                type="button"
                class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear button 1"
                @click="store.button1 = { label: '', url: '' }"
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
                v-model="store.button2.label"
                class="flex-1 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                placeholder="Label"
                type="text"
              />
              <input
                v-model="store.button2.url"
                class="flex-[2] bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-violet-500"
                placeholder="URL"
                type="text"
              />
              <button
                type="button"
                class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear button 2"
                @click="store.button2 = { label: '', url: '' }"
              >
                <span class="material-symbols-outlined text-[17px]">delete</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()
const isSuccessFeedback = ref(false)

const startTimeInput = computed({
  get: () => (store.startTime ? String(store.startTime) : ''),
  set: (val: string) => {
    const trimmed = val.trim()
    if (!trimmed) {
      store.startTime = null
    } else {
      const num = Number(trimmed)
      store.startTime = isNaN(num) ? null : num
    }
  }
})

const endTimeInput = computed({
  get: () => (store.endTime ? String(store.endTime) : ''),
  set: (val: string) => {
    const trimmed = val.trim()
    if (!trimmed) {
      store.endTime = null
    } else {
      const num = Number(trimmed)
      store.endTime = isNaN(num) ? null : num
    }
  }
})

function setStartToNow(): void {
  store.startTime = Date.now()
}

function clearStartTime(): void {
  store.startTime = null
}

function setEndOffset(minutes: number): void {
  store.endTime = Date.now() + minutes * 60 * 1000
}

function clearEndTime(): void {
  store.endTime = null
}

const startTimePreview = computed(() => {
  if (!store.startTime) return 'None'
  const ms = store.startTime < 10000000000 ? store.startTime * 1000 : store.startTime
  const date = new Date(ms)
  if (isNaN(date.getTime())) return 'Invalid'
  return date.toLocaleTimeString()
})

const endTimePreview = computed(() => {
  if (!store.endTime) return 'None'
  const ms = store.endTime < 10000000000 ? store.endTime * 1000 : store.endTime
  const date = new Date(ms)
  if (isNaN(date.getTime())) return 'Invalid'
  return date.toLocaleTimeString()
})

async function handleUpdatePresence(): Promise<void> {
  const success = await store.updatePresence()
  if (success) {
    isSuccessFeedback.value = true
    setTimeout(() => {
      isSuccessFeedback.value = false
    }, 2000)
  }
}

async function handleImportCli(): Promise<void> {
  const success = await store.importFromCli()
  if (success) {
    isSuccessFeedback.value = true
    setTimeout(() => {
      isSuccessFeedback.value = false
    }, 1500)
  }
}
</script>
