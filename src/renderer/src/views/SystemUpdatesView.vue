<template>
  <main class="flex-1 min-w-0 flex flex-col justify-between overflow-y-auto px-2 lg:px-4">
    <div class="flex flex-col w-full gap-5 pb-6 max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col gap-1 shrink-0 pt-1">
        <div class="flex items-center gap-2">
          <span class="font-mono text-[11px] uppercase tracking-widest text-primary font-semibold">
            OTA Channel: {{ store.updateState.channel }}
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">System Updates &amp; Changelog</h1>
        <p class="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Review client updates, cryptographic release integrity, and local installation telemetry.
        </p>
      </div>

      <!-- Active Update Card / Release Hero Section -->
      <section
        class="rounded-2xl bg-[#121826]/70 border border-white/5 p-5 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20"
          >
            <span class="material-symbols-outlined text-[24px]">system_update_alt</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-semibold text-xs">
                {{ store.updateState.pendingVersion }} Ready to Install
              </span>
              <span class="text-xs font-mono text-slate-400">{{ store.updateState.releaseDate }}</span>
              <span
                class="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-secondary font-mono text-[11px]"
              >
                Build {{ store.updateState.buildNumber }}
              </span>
            </div>
            <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
              Fast global hotkeys, 38MB idle memory footprint, and refined floating UI architecture.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            @click="handleApplyUpdate"
            class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-medium text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :class="{ 'animate-spin': isApplying }"
            >
              {{ isApplying ? 'sync' : 'restart_alt' }}
            </span>
            <span>{{ isApplying ? 'Applying Update...' : 'Apply Now' }}</span>
          </button>
        </div>
      </section>

      <!-- Two Columns: Changelog & Update Controls/Integrity -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- What's New Section (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-5">
          <div
            class="rounded-2xl bg-[#121826]/70 border border-white/5 p-5 backdrop-blur-xl shadow-xl flex flex-col gap-4"
          >
            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">
                  featured_play_list
                </span>
                <h2 class="text-sm font-semibold text-white">What's New in v1.1.0</h2>
              </div>
              <span class="font-mono text-[11px] text-slate-500">diff: +1,248 / -312</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Added Card -->
              <div
                class="p-4 rounded-xl bg-surface-container-high/60 border border-white/5 flex flex-col gap-2.5"
              >
                <div class="flex items-center gap-1.5 text-primary">
                  <span class="material-symbols-outlined text-[16px]">add_circle</span>
                  <span class="font-mono text-xs font-semibold uppercase tracking-wider">Added</span>
                </div>
                <ul class="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed">
                  <li class="flex items-start gap-2">
                    <span class="text-primary mt-0.5 font-bold">•</span>
                    <span>Multi-profile preset manager with global IPC hotkeys.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-primary mt-0.5 font-bold">•</span>
                    <span>Pixel-perfect Discord Rich Presence live preview card.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-primary mt-0.5 font-bold">•</span>
                    <span>Automated system-tray minimize on workstation lock.</span>
                  </li>
                </ul>
              </div>

              <!-- Improved Card -->
              <div
                class="p-4 rounded-xl bg-surface-container-high/60 border border-white/5 flex flex-col gap-2.5"
              >
                <div class="flex items-center gap-1.5 text-secondary">
                  <span class="material-symbols-outlined text-[16px]">trending_up</span>
                  <span class="font-mono text-xs font-semibold uppercase tracking-wider">
                    Improved
                  </span>
                </div>
                <ul class="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed">
                  <li class="flex items-start gap-2">
                    <span class="text-secondary mt-0.5 font-bold">•</span>
                    <span>Reduced background idle memory consumption to 38MB.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary mt-0.5 font-bold">•</span>
                    <span>Instantaneous reconnect handler for dropped Discord client pipes.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary mt-0.5 font-bold">•</span>
                    <span>Upgraded bundled WebGL compositor runtime.</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Fixed Card -->
            <div
              class="p-4 rounded-xl bg-surface-container-high/60 border border-white/5 flex flex-col gap-2.5"
            >
              <div class="flex items-center gap-1.5 text-tertiary">
                <span class="material-symbols-outlined text-[16px]">bug_report</span>
                <span class="font-mono text-xs font-semibold uppercase tracking-wider">Fixed</span>
              </div>
              <ul class="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed">
                <li class="flex items-start gap-2">
                  <span class="text-tertiary mt-0.5 font-bold">•</span>
                  <span>Resolved percent-encoded URI parsing failures on custom button links.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-tertiary mt-0.5 font-bold">•</span>
                  <span>
                    Fixed platform pipe path resolution on Linux Flatpak runtimes (
                    <code class="font-mono text-[11px] text-primary px-1.5 py-0.5 rounded bg-surface-container">
                      /run/user/1000/discord-ipc-0
                    </code>
                    ).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Side: Integrity and Controls (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <div
            class="rounded-2xl bg-[#121826]/70 border border-white/5 p-4 backdrop-blur-xl shadow-xl flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-white">Integrity Verification</span>
              <span class="text-[11px] font-mono text-emerald-400">100% SHA256</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary to-secondary w-full rounded-full" />
            </div>
            <div class="font-mono text-[10px] text-slate-400 truncate bg-[#080d18] p-2 rounded-lg border border-white/5">
              8fbc923a9d4...e109
            </div>

            <div class="flex flex-col gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                @click="handleApplyUpdate"
                class="w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-medium text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">bolt</span>
                <span>Restart &amp; Apply Update</span>
              </button>
              <button
                type="button"
                @click="handleRemindLater"
                class="w-full py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[15px] text-slate-400">schedule</span>
                <span>{{ remindText }}</span>
              </button>
            </div>

            <!-- Background Update Toggle -->
            <div class="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <div class="flex flex-col">
                <span class="text-xs text-white font-medium">Automatic Updates</span>
                <span class="text-[11px] text-slate-400">Download patches silently</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input v-model="store.updateState.autoUpdate" class="sr-only peer" type="checkbox" />
                <div
                  class="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:bg-primary transition-all"
                />
                <div
                  class="absolute left-0.5 top-0.5 bg-outline peer-checked:bg-on-primary w-4 h-4 rounded-full transition-all peer-checked:translate-x-4"
                />
              </label>
            </div>
          </div>

          <!-- Key Signature Badge -->
          <div
            class="rounded-xl bg-[#121826]/70 border border-white/5 p-3 backdrop-blur-xl flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-outline text-[16px]">verified_user</span>
              <span class="text-[11px] font-mono text-slate-400">Ed25519 Hardware Key</span>
            </div>
            <span class="font-mono text-[11px] text-emerald-400 font-semibold">Valid</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePresenceStore } from '../stores/presenceStore'

const store = usePresenceStore()
const isApplying = ref(false)
const remindText = ref('Remind Me on Next Launch')

function handleApplyUpdate(): void {
  isApplying.value = true
  setTimeout(() => {
    isApplying.value = false
  }, 1500)
}

function handleRemindLater(): void {
  remindText.value = 'Deferred'
  setTimeout(() => {
    remindText.value = 'Remind Me on Next Launch'
  }, 1500)
}
</script>
