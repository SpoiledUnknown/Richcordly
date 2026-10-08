<template>
  <Teleport to="body">
    <Transition name="update-modal">
      <div
        v-if="store.isUpdateModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        @click.self="store.closeUpdateModal"
      >
        <div
          class="relative w-full max-w-md bg-surface-container/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 gap-5"
        >
          <!-- Case 1: Client Already Up to Date -->
          <template v-if="store.updateModalType === 'up_to_date'">
            <div class="flex items-center justify-between pb-3 border-b border-white/5">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm"
                >
                  <span class="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">Client is Up to Date</h3>
                  <p class="text-[11px] text-slate-400">
                    You are running the newest official release
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="w-7 h-7 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                @click="store.closeUpdateModal"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <!-- Version Details Grid -->
            <div class="grid grid-cols-2 gap-2.5">
              <!-- Channel -->
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >Channel</span
                >
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400" />
                  <span class="text-xs font-semibold text-white"
                    >{{ store.updateState.channel || 'Stable' }} Channel</span
                  >
                </div>
              </div>

              <!-- Last Checked -->
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >Checked</span
                >
                <span class="text-xs font-semibold text-white truncate">
                  {{
                    store.updateState.checkedAt
                      ? new Date(store.updateState.checkedAt).toLocaleTimeString()
                      : 'Just now'
                  }}
                </span>
              </div>

              <!-- Current Installed Version -->
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >Current Version</span
                >
                <span class="font-mono text-xs font-bold text-emerald-400">
                  {{ formatVersion(store.updateState.currentVersion) }}
                </span>
              </div>

              <!-- Upstream Version -->
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >Upstream Version</span
                >
                <span class="font-mono text-xs font-bold text-primary">
                  {{ formatVersion(store.updateState.latestVersion) }}
                </span>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end pt-2 border-t border-white/5">
              <button
                type="button"
                class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-black font-semibold text-xs transition-transform active:scale-95 shadow-md cursor-pointer"
                @click="store.closeUpdateModal"
              >
                Close
              </button>
            </div>
          </template>

          <!-- Case 2: Update Available -->
          <template v-else>
            <div class="flex items-center justify-between pb-3 border-b border-white/5">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-sm"
                >
                  <span class="material-symbols-outlined text-[20px]">system_update_alt</span>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-white">New Update Available!</h3>
                  <p class="text-[11px] text-slate-400">A new version has been released upstream</p>
                </div>
              </div>
              <button
                type="button"
                class="w-7 h-7 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                @click="store.closeUpdateModal"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <!-- Version Details Grid -->
            <div class="grid grid-cols-2 gap-2.5">
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                  >Current Version</span
                >
                <span class="font-mono text-xs font-bold text-slate-300">
                  {{ formatVersion(store.updateState.currentVersion) }}
                </span>
              </div>
              <div
                class="p-3 rounded-xl bg-surface-container-low border border-primary/20 flex flex-col gap-1 bg-primary/5"
              >
                <span class="text-[11px] font-mono uppercase tracking-wider text-primary"
                  >Latest Version</span
                >
                <span class="font-mono text-xs font-bold text-primary">
                  {{ formatVersion(store.updateState.latestVersion) }}
                </span>
              </div>
            </div>

            <!-- Release Notes Preview -->
            <div
              v-if="store.updateState.releaseNotes"
              class="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1.5 max-h-36 overflow-y-auto"
            >
              <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400"
                >What's New</span
              >
              <p class="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {{ store.updateState.releaseNotes.trim() }}
              </p>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
              <button
                type="button"
                class="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                @click="store.closeUpdateModal"
              >
                Remind Later
              </button>
              <button
                type="button"
                class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-black font-semibold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                :disabled="store.updateState.isApplying"
                @click="handleApply"
              >
                <span
                  class="material-symbols-outlined text-[16px]"
                  :class="{ 'animate-spin': store.updateState.isApplying }"
                >
                  {{ store.updateState.isApplying ? 'sync' : 'bolt' }}
                </span>
                <span>{{ store.updateState.isApplying ? 'Applying...' : 'Update Now' }}</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()

function formatVersion(ver?: string): string {
  if (!ver || !ver.trim()) return 'v1.0.0'
  const v = ver.trim().replace(/^v/i, '')
  return `v${v || '1.0.0'}`
}

async function handleApply(): Promise<void> {
  await store.applyUpdate()
  store.closeUpdateModal()
}
</script>

<style scoped>
.update-modal-enter-active,
.update-modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.update-modal-enter-from,
.update-modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
