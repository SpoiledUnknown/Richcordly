<template>
  <div
    class="relative h-screen w-screen overflow-hidden text-[#d6dcfa] transition-colors duration-300"
    :style="{ backgroundColor: store.settings.customTheme?.backgroundColor || '#070b14' }"
  >
    <!-- Ambient WebGL Night Sky Background Layer -->
    <AmbientShader />

    <!-- Window Frame with Floating Island Architecture -->
    <div class="relative z-10 flex flex-col h-screen p-4 lg:p-6 box-border gap-4">
      <!-- Sleek Titlebar Header -->
      <TitleBar />

      <!-- Main Floating Layout (Left Nav + Active Workspace + Right Discord Preview) -->
      <div class="flex-1 flex gap-4 lg:gap-5 min-h-0 items-stretch">
        <!-- 1. Left Nav Rail -->
        <NavRail />

        <!-- 2. Active Center Workspace -->
        <PresenceEditorView v-if="store.activeTab === 'presence'" />
        <ProfileManagerView v-else-if="store.activeTab === 'profiles'" />
        <SettingsView v-else-if="store.activeTab === 'settings'" />

        <!-- 3. Right Live Discord Preview -->
        <DiscordPreview />
      </div>
    </div>

    <!-- Global Update Check Status Modal -->
    <UpdateStatusModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePresenceStore } from './stores/presenceStore'
import AmbientShader from './components/AmbientShader.vue'
import TitleBar from './components/TitleBar.vue'
import NavRail from './components/NavRail.vue'
import DiscordPreview from './components/DiscordPreview.vue'
import UpdateStatusModal from './components/UpdateStatusModal.vue'
import PresenceEditorView from './views/PresenceEditorView.vue'
import ProfileManagerView from './views/ProfileManagerView.vue'
import SettingsView from './views/SettingsView.vue'

const store = usePresenceStore()

onMounted(async () => {
  await store.loadSettings()
  store.initDiscord()
  store.checkForUpdates(true)
})
</script>
