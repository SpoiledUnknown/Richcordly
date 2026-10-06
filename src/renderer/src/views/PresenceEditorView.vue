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
            class="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all flex items-center gap-2 cursor-pointer"
            @click="handleUpdatePresence"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :class="{ 'animate-spin': isUpdating }"
            >
              {{ isUpdating ? 'refresh' : 'bolt' }}
            </span>
            <span>{{ isUpdating ? 'Synced' : 'Update Presence' }}</span>
          </button>
        </div>
      </div>

      <!-- Form Sections -->
      <div class="mt-5 flex flex-col gap-4">
        <!-- Section 1: Basic Activity -->
        <section
          class="bg-[#121829]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
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
          class="bg-[#121829]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
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
          class="bg-[#121829]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
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
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  Start Time (Elapsed)
                </label>
                <span class="text-[11px] font-mono text-sky-400">Current Session</span>
              </div>
              <input
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-xs transition-all"
                type="text"
                value="Auto-synchronized from launch"
                readonly
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label
                  class="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium"
                >
                  End Time (Optional)
                </label>
                <span class="text-[11px] font-mono text-slate-500">Disabled</span>
              </div>
              <input
                class="bg-[#090d18] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-xs transition-all"
                placeholder="Unix timestamp or empty"
                type="text"
              />
            </div>
          </div>
        </section>

        <!-- Section 4: Party Settings -->
        <section
          class="bg-[#121829]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
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
          class="bg-[#121829]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 shadow-lg"
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
import { ref } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()
const isUpdating = ref(false)

function handleUpdatePresence(): void {
  isUpdating.value = true
  setTimeout(() => {
    isUpdating.value = false
  }, 1200)
}
</script>
