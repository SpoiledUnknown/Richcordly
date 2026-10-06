<template>
  <aside
    class="w-16 rounded-3xl bg-[#0d121f]/80 backdrop-blur-2xl border border-white/5 shadow-2xl p-3 flex flex-col justify-between items-center shrink-0 select-none"
  >
    <!-- Top Navigation -->
    <div class="flex flex-col items-center gap-3 w-full">
      <div
        class="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary mb-1 shadow-sm"
      >
        <span class="material-symbols-outlined text-[20px]">terminal</span>
      </div>

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
      <!-- System Updates -->
      <button
        type="button"
        :class="[
          'relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
          store.activeTab === 'updates'
            ? 'bg-violet-600/25 border border-violet-500/40 text-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
        ]"
        title="System Updates"
        @click="store.activeTab = 'updates'"
      >
        <span class="material-symbols-outlined text-[20px]">cloud_download</span>
        <span
          class="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]"
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

      <!-- About Info -->
      <button
        type="button"
        class="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all cursor-pointer"
        title="About Richcord"
        @click="store.activeTab = 'updates'"
      >
        <span class="material-symbols-outlined text-[20px]">info</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()

function openGitHub(): void {
  if (window.api?.openExternal) {
    window.api.openExternal('https://github.com/richcord/client')
  } else {
    window.open('https://github.com/richcord/client', '_blank')
  }
}
</script>
