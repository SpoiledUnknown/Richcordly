<template>
  <header
    class="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-surface-container/75 backdrop-blur-xl border border-white/5 shadow-lg shrink-0 titlebar-drag"
  >
    <!-- Left Logo & Status -->
    <div class="flex items-center gap-3">
      <div
        class="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]"
      >
        <span class="material-symbols-outlined text-[15px] text-white">sports_esports</span>
      </div>
      <span class="font-mono text-xs font-semibold tracking-wider text-slate-300">RICHCORD</span>
      <span class="text-slate-600 text-xs">•</span>
      <div
        class="flex items-center gap-1.5 text-xs font-mono transition-colors"
        :class="store.isConnected ? 'text-emerald-400' : 'text-slate-500'"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="
            store.isConnected
              ? 'bg-emerald-400 animate-pulse'
              : store.isConnecting
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-500'
          "
        />
        <span>
          {{
            store.isConnected
              ? 'Discord Connected'
              : store.isConnecting
                ? 'Connecting...'
                : 'Disconnected'
          }}
        </span>
      </div>
    </div>

    <!-- Center/Right Profile Pill and Window Controls -->
    <div class="flex items-center gap-4 text-xs titlebar-no-drag">
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-mono text-[11px] border border-white/5 transition-all cursor-pointer group"
        title="Active Profile"
        @click="store.activeTab = 'profiles'"
      >
        <span
          class="material-symbols-outlined text-[13px] text-violet-400 group-hover:scale-110 transition-transform"
          >layers</span
        >
        <span>{{ activePresetName }}</span>
      </button>

      <!-- Window controls -->
      <div class="flex items-center gap-1.5 text-slate-500 pl-2 border-l border-white/10">
        <button
          type="button"
          class="w-6 h-6 rounded hover:bg-white/10 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          title="Minimize"
          @click="minimize"
        >
          <span class="material-symbols-outlined text-[14px]">remove</span>
        </button>
        <button
          type="button"
          class="w-6 h-6 rounded hover:bg-white/10 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          title="Maximize / Restore"
          @click="maximize"
        >
          <span class="material-symbols-outlined text-[13px]">check_box_outline_blank</span>
        </button>
        <button
          type="button"
          class="w-6 h-6 rounded hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
          @click="close"
        >
          <span class="material-symbols-outlined text-[15px]">close</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()

const activePresetName = computed(() => {
  const current = store.presets.find((p) => p.id === store.activeProfileId)
  return current ? current.name : 'Default (Dev)'
})

function minimize(): void {
  if (window.api?.minimizeWindow) {
    window.api.minimizeWindow()
  }
}

function maximize(): void {
  if (window.api?.maximizeWindow) {
    window.api.maximizeWindow()
  }
}

function close(): void {
  if (window.api?.closeWindow) {
    window.api.closeWindow()
  }
}
</script>
