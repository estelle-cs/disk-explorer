<template>
  <div class="app-container">
    <CardContainer>
      <section class="flex space-between items-center">
        <div class="align-center">
          <h2>Disk Explorer</h2>
        </div>
        <button class="refresh-btn"><span>🔄</span> Actualiser</button>
      </section>
    </CardContainer>

    <CardContainer>
      <section class="flex column g8">
        <span class="body-xs">Sélectionnez un dossier ou un disque</span>
        <div class="flex g8">
          <PathInput :modelValue="selectedPath" @click="selectFolder()" />
          <BaseButton variant="blue-button" @click="selectFolder()">
            Parcourir
          </BaseButton>
          <BaseButton
            variant="green-button"
            @click="scanSelectedFolder()"
            :disabled="!selectedPath"
          >
            Analyser
          </BaseButton>
        </div>
      </section>
    </CardContainer>

    <CardContainer>
      <section class="flex column g8">
        <div class="flex space-between align-center">
          <span class="body-m">État du scan</span>
          <div class="flex row g4 align-center">
            <span
              class="status-dot"
              :class="{
                gray: scanStatus === 'idle',
                orange: scanStatus === 'loading',
                green: scanStatus === 'done',
              }"
            ></span>
            <span class="body-xs">
              {{
                scanStatus === "idle"
                  ? "En attente du scan"
                  : scanStatus === "loading"
                  ? "Scan en cours"
                  : "Scan terminé"
              }}
            </span>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-bar background"></div>
          <div
            v-if="scanStatus !== 'idle'"
            class="progress-bar foreground"
            :style="{
              width:
                (totalCount > 0 ? (scannedCount / totalCount) * 100 : 0) + '%',
            }"
          ></div>
        </div>
        <p class="scan-count">
          {{ scannedCount }} / {{ totalCount }} fichier{{
            totalCount > 1 ? "s" : ""
          }}
          analysé{{ scannedCount > 1 ? "s" : "" }}
        </p>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import TreeView from "./components/TreeView.vue";
import CardContainer from "@/components/CardContainer.vue";
import BaseButton from "@/components/BaseButton.vue";
import PathInput from "@/components/PathInput.vue";

const loading = ref(false);
const results = ref<any>(null);

const selectedPath = ref("");
const scanStatus = ref<"idle" | "loading" | "done">("idle");

const scannedCount = ref(0);
const totalCount = ref(0);

onMounted(() => {
  window.electron.on(
    "scan-progress",
    (payload: { current: number; total: number }) => {
      scannedCount.value = payload.current;
      totalCount.value = payload.total;
    }
  );
});

async function selectFolder() {
  const folderPath = await window.electron.invoke("select-folder");
  if (folderPath) {
    selectedPath.value = folderPath;
    results.value = null;
  }
}

async function scanSelectedFolder() {
  if (!selectedPath.value) {
    alert("Veuillez d'abord sélectionner un dossier.");
    return;
  }

  loading.value = true;
  scanStatus.value = "loading";
  try {
    const data = await window.electron.invoke("start-scan", selectedPath.value);
    results.value = data ? [data] : null;
    scanStatus.value = "done";
  } catch (error) {
    console.error("Erreur de scan", error);
    scanStatus.value = "idle";
  } finally {
    loading.value = false;
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

.body-m {
  font-size: 16px;
  color: #121826;
  font-weight: 600;
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

.row {
  flex-direction: row;
}

.space-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.g4 {
  gap: 4px;
}

.g8 {
  gap: 8px;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.gray {
  background-color: #9ca3af;
}

.status-dot.orange {
  background-color: #f59e0b;
}

.status-dot.green {
  background-color: #55b785;
}

.graybar {
  background-color: #e5e7eb;
  width: 100%;
}

.bluebar {
  background-color: #4c89ee;
  animation: progress-loading 1s linear infinite alternate;
}

.progress-container {
  position: relative;
  height: 6px;
  border-radius: 5px;
  width: 100%;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-bar.background {
  width: 100%;
  background-color: #e5e7eb;
  z-index: 0;
}

.progress-bar.foreground {
  background-color: #4c89ee; 
  z-index: 1;
  width: 0%;
  transition: width 0.3s ease;
}

.progress-bar.foreground.animated {
  animation: progress-loading 1s linear infinite alternate;
}

.progress-bar.foreground.full {
  width: 100%;
}

@keyframes progress-loading {
  from {
    width: 30%;
  }
  to {
    width: 100%;
  }
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
