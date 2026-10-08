<template>
  <aside
    class="w-[350px] rounded-3xl bg-surface-container/80 backdrop-blur-2xl border border-white/5 shadow-2xl p-6 flex flex-col justify-between shrink-0 select-none"
  >
    <div class="flex flex-col gap-5">
      <!-- Preview Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold tracking-wide text-white">Preview</h2>
        <div
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-all"
          :class="
            store.isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="store.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'"
          />
          <span>{{ store.isConnected ? 'Live Sync' : 'Standby' }}</span>
        </div>
      </div>

      <!-- Pure Discord-styled presence card -->
      <div class="rounded-2xl overflow-hidden bg-[#111726] border border-white/[0.08] shadow-2xl">
        <!-- Discord Profile Banner Decorator -->
        <div
          class="h-20 bg-gradient-to-r from-violet-900/50 via-indigo-900/40 to-slate-900 relative"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#111726] to-transparent"
          />
        </div>

        <!-- Profile Info & Body -->
        <div class="px-4 pb-4 relative flex flex-col gap-3.5">
          <!-- Avatar cluster -->
          <div class="flex justify-between items-end -mt-9 mb-0.5">
            <div class="relative">
              <div class="w-16 h-16 rounded-full p-1 bg-[#111726]">
                <div
                  class="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center"
                >
                  <img alt="avatar" class="w-full h-full object-cover" :src="userAvatarUrl" />
                </div>
              </div>
              <!-- Status dot -->
              <span
                class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-[3px] border-[#111726] transition-colors"
                :class="store.isConnected ? 'bg-[#23a55a]' : 'bg-slate-500'"
              />
            </div>
            <span
              class="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/5 text-[10px] font-mono text-slate-400"
            >
              {{ displayUsername }}
            </span>
          </div>

          <!-- User name -->
          <div>
            <div class="text-white font-semibold text-sm tracking-tight">{{ displayUsername }}</div>
            <div class="text-xs text-slate-400 mt-0.5">
              {{ store.isConnected ? 'Active via Richcord' : 'Discord Disconnected' }}
            </div>
          </div>

          <!-- Activity Card Container -->
          <div class="rounded-xl bg-[#171f33] p-3.5 flex flex-col gap-3 border border-white/[0.04]">
            <div
              class="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center justify-between"
            >
              <span>Playing a Game</span>
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400" />
            </div>

            <div class="flex gap-3 items-center">
              <!-- Large + Overlaid Small asset key placeholders -->
              <div class="relative w-14 h-14 shrink-0 rounded-xl overflow-visible">
                <div
                  class="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center text-violet-400 font-mono text-xs"
                >
                  <div
                    class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-600/30 to-indigo-600/30 text-white"
                  >
                    <span class="material-symbols-outlined text-[24px]">terminal</span>
                  </div>
                </div>

                <!-- Small badge overlaid -->
                <div
                  v-if="store.smallImageKey"
                  class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#171f33] p-0.5 flex items-center justify-center"
                >
                  <div
                    class="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10 text-sky-400"
                  >
                    <span class="material-symbols-outlined text-[12px]">code</span>
                  </div>
                </div>
              </div>

              <!-- Text lines -->
              <div class="flex flex-col min-w-0 justify-center">
                <span class="text-xs font-semibold text-white truncate">Richcord</span>
                <span class="text-xs text-slate-300 truncate mt-0.5">
                  {{ store.details || 'Building Richcord Desktop Client' }}
                </span>
                <span class="text-[11px] text-slate-400 truncate">
                  {{ store.state || 'refactoring ipc sockets' }}
                </span>
                <div
                  v-if="timerString"
                  class="text-[10px] font-mono text-sky-400 flex items-center gap-1 mt-0.5"
                >
                  <span class="material-symbols-outlined text-[11px]">schedule</span>
                  <span>{{ timerString }}</span>
                </div>
              </div>
            </div>

            <!-- Two Discord-style action buttons -->
            <div v-if="store.button1.label || store.button2.label" class="flex flex-col gap-2 pt-1">
              <a
                v-if="store.button1.label"
                class="w-full py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                :href="store.button1.url || '#'"
                target="_blank"
                rel="noreferrer"
              >
                <span>{{ store.button1.label }}</span>
                <span class="material-symbols-outlined text-[13px] text-slate-400"
                  >open_in_new</span
                >
              </a>
              <a
                v-if="store.button2.label"
                class="w-full py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                :href="store.button2.url || '#'"
                target="_blank"
                rel="noreferrer"
              >
                <span>{{ store.button2.label }}</span>
                <span class="material-symbols-outlined text-[13px] text-slate-400"
                  >open_in_new</span
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subtle minimal bottom bar in preview panel -->
    <div
      class="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500"
    >
      <span>IPC Pipe: {{ store.pipeChannel }}</span>
      <span class="text-slate-400">Status: {{ store.isConnected ? 'Active' : 'Standby' }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()

const userAvatarUrl = computed(() => {
  if (store.currentUser?.avatar && store.currentUser?.id) {
    return `https://cdn.discordapp.com/avatars/${store.currentUser.id}/${store.currentUser.avatar}.png`
  }
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
})

const displayUsername = computed(() => {
  return store.currentUser?.username || 'alexander.dev'
})

const timerString = ref('')
let intervalId: number | null = null

function updateTimer(): void {
  if (store.endTime) {
    const endMs = store.endTime < 10000000000 ? store.endTime * 1000 : store.endTime
    const diffSec = Math.max(0, Math.floor((endMs - Date.now()) / 1000))
    const mins = Math.floor(diffSec / 60)
    const secs = diffSec % 60
    timerString.value = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} remaining`
  } else if (store.startTime) {
    const startMs = store.startTime < 10000000000 ? store.startTime * 1000 : store.startTime
    const diffSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000))
    const mins = Math.floor(diffSec / 60)
    const secs = diffSec % 60
    timerString.value = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} elapsed`
  } else {
    timerString.value = ''
  }
}

function syncTimerLoop(): void {
  const needsTimer = Boolean(store.startTime || store.endTime)
  if (needsTimer && !document.hidden) {
    updateTimer()
    if (!intervalId) {
      intervalId = window.setInterval(updateTimer, 1000)
    }
  } else {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (!needsTimer) {
      timerString.value = ''
    }
  }
}

const handleVisibilityChange = (): void => {
  syncTimerLoop()
}

watch([() => store.startTime, () => store.endTime], () => {
  syncTimerLoop()
})

onMounted(() => {
  syncTimerLoop()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
