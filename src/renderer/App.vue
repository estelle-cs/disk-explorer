<template>
  <div class="app-container">
    <AppHeader @select-folder="selectFolderAndScan" />

    <main class="app-main">
      <div v-if="loading">
        <p>Scan en cours…</p>
      </div>

      <TreeView v-else-if="results" :treeData="results" />

      <div v-else>
        <p>Sélectionnez un dossier pour commencer l'analyse.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/Header.vue';
import TreeView from './components/TreeView.vue';

const loading = ref(false);
const results = ref<any>(null);

async function selectFolderAndScan() {
  const folderPath = await window.electron.invoke('select-folder');
  if (folderPath) {
    loading.value = true;
    try {
      const data = await window.electron.invoke('start-scan', folderPath);
      // Always wrap the result in an array for TreeView
      results.value = data ? [data] : null;
    } finally {
      loading.value = false;
    }
  }
}

</script>

<style scoped>
.app-container {
  font-family: sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-main {
  flex: 1;
  padding: 1rem;
  overflow: auto;
}
</style>
