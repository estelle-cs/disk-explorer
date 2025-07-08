<template>
  <div class="app-container">
    <CardContainer>
      <section class="flex space-between items-center">
        <div class="left-content">
          <h2>Disk Explorer</h2>
        </div>
        <button class="refresh-btn"><span>🔄</span> Actualiser</button>
      </section>
    </CardContainer>

    <CardContainer>
      <section class="flex column g8">
        <span class="body-xs">Sélectionnez un dossier ou un disque</span>
        <div class="flex g8">
          <PathInput
            :modelValue="selectedPath"
            @click="selectFolder()"
          />
          <BaseButton variant="blue-button" @click="selectFolder()">
            Parcourir
          </BaseButton>
          <BaseButton variant="green-button" @click="scanSelectedFolder()" :disabled="!selectedPath">
            Analyser
          </BaseButton>
        </div>
      </section>
    </CardContainer>

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
import { ref } from "vue";
import TreeView from "./components/TreeView.vue";
import CardContainer from "@/components/CardContainer.vue";
import BaseButton from "@/components/BaseButton.vue";
import PathInput from "@/components/PathInput.vue";

const loading = ref(false);
const results = ref<any>(null);

const selectedPath = ref('');

async function selectFolder() {
  const folderPath = await window.electron.invoke("select-folder")
  if (folderPath) {
    selectedPath.value = folderPath
    results.value = null
  }
}

async function scanSelectedFolder() {
  if (!selectedPath.value) {
    alert("Veuillez d'abord sélectionner un dossier.")
    return
  }

  loading.value = true
  try {
    const data = await window.electron.invoke("start-scan", selectedPath.value)
    results.value = data ? [data] : null
  } finally {
    loading.value = false
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

.body-xs {
  font-size: 12px;
  color: #3a4150;
}

.flex {
  display: flex;
}

.column {
  flex-direction: column;
}

.space-between {
  justify-content: space-between;
}

.left-content {
  align-items: center;
}

.g8 {
  gap: 8px;
}
</style>

<style>
body {
  margin: 0;
  padding: 2em 5em;
  font-family: "Inter", sans-serif;
  background-color: #f9fafb;
}

h2 {
  margin: 0;
  font-size: 21px;
}
</style>
