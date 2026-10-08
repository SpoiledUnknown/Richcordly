<template>
  <aside
    class="w-16 rounded-3xl bg-surface-container/80 backdrop-blur-2xl border border-white/5 shadow-2xl p-3 flex flex-col justify-between items-center shrink-0 select-none"
  >
    <!-- Top Navigation -->
    <div class="flex flex-col items-center gap-3 w-full">
      <nav class="flex flex-col items-center gap-2.5 w-full">
        <!-- Presence Editor -->
        <button
          type="button"
          :class="[
            'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
            store.activeTab === 'presence'
              ? 'bg-violet-600/25 border border-violet-500/40 text-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
          ]"
          title="Presence Editor"
          @click="store.activeTab = 'presence'"
        >
          <span class="material-symbols-outlined text-[20px]">sports_esports</span>
        </button>

        <!-- Profile Manager -->
        <button
          type="button"
          :class="[
            'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
            store.activeTab === 'profiles'
              ? 'bg-violet-600/25 border border-violet-500/40 text-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
          ]"
          title="Profile Manager"
          @click="store.activeTab = 'profiles'"
        >
          <span class="material-symbols-outlined text-[20px]">layers</span>
        </button>

        <!-- Settings -->
        <button
          type="button"
          :class="[
            'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
            store.activeTab === 'settings'
              ? 'bg-violet-600/25 border border-violet-500/40 text-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.25)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
          ]"
          title="Settings"
          @click="store.activeTab = 'settings'"
        >
          <span class="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Navigation -->
    <div class="flex flex-col items-center gap-2.5 w-full">
      <!-- Check for Updates -->
      <button
        type="button"
        class="relative w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all cursor-pointer group"
        title="Check for Updates"
        :disabled="store.updateState.isChecking"
        @click="store.checkAndPromptUpdate()"
      >
        <span
          class="material-symbols-outlined text-[20px] transition-transform"
          :class="{ 'animate-spin': store.updateState.isChecking }"
        >
          cloud_download
        </span>
        <span
          v-if="store.updateState.hasUpdate"
          class="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
        />
      </button>

      <!-- GitHub external link -->
      <button
        type="button"
        class="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all cursor-pointer"
        title="GitHub Repository"
        @click="openGitHub"
      >
        <span class="material-symbols-outlined text-[20px]">code</span>
      </button>

      <!-- Richcord CLI download (Terminal) -->
      <button
        type="button"
        class="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-violet-300 hover:bg-white/[0.05] transition-all cursor-pointer group"
        title="Download Richcord CLI"
        @click="openCliDownload"
      >
        <span
          class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform"
        >
          terminal
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()

function openCliDownload(): void {
  const url = 'https://github.com/SpoiledUnknown/Richcord/releases'
  if (window.api?.openExternal) {
    window.api.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}

function openGitHub(): void {
  const url = 'https://github.com/SpoiledUnknown/Richcordly'
  if (window.api?.openExternal) {
    window.api.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}
</script>
