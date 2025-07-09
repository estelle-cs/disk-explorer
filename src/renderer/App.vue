<template>
  <div class="app-container">
    <CardContainer>
      <section class="flex space-between items-center">
        <div class="flex row g12 align-center">
          <font-awesome-icon
              icon="hard-drive"
              class="logo"
            />
          <h2>Disk Explorer</h2>
        </div>
        <button class="refresh-btn" @click="scanSelectedFolder()"><font-awesome-icon
              icon="rotate-right"
            /> Actualiser</button>
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
          <span class="body-l">État du scan</span>
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

        <div v-if="errors.length > 0" class="error-box">
          <p class="body-xs"><strong>Erreurs rencontrées :</strong></p>
          <ul class="error-list">
            <li v-for="(err, i) in errors" :key="i">
              ⚠️ {{ err.path }} — {{ err.message }}
            </li>
          </ul>
        </div>
      </section>
    </CardContainer>

    <CardContainer>
      <section class="flex column g4">
        <span class="body-l">Résultats de l'analyse</span>
        <span class="body-xs"
          >Fichiers et dossiers par taille décroissante</span
        >
        <hr />
      </section>
      <section class="results">
        <div v-if="loading">
          <p class="body-m">Scan en cours…</p>
        </div>
        <TreeView v-else-if="results" :treeData="results" />
        <div v-else>
          <p class="body-m">Sélectionnez un dossier pour commencer l'analyse.</p>
        </div>
      </section>
    </CardContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const errors = ref<{ path: string; message: string }[]>([]);

onMounted(() => {
  window.electron.on(
    "scan-progress",
    (payload: { current: number; total: number }) => {
      scannedCount.value = payload.current;
      totalCount.value = payload.total;
    }
  );
});

onMounted(() => {
  window.electron.on("scan-error", (err: { path: string; message: string }) => {
    errors.value.push(err);
  });
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.results {
  height: 30rem;
  overflow: scroll;
}

.body-l {
  font-size: 16px;
  color: #121826;
  font-weight: 600;
}

.body-m {
  font-size: 14px;
  color: #121826;
  font-weight: 500;
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

.g12 {
  gap: 12px;
}

hr {
  border-bottom: 0px #E6E7EB solid;
  width: 100%;
  margin: 25px 0px;
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
  animation: 1s linear infinite alternate;
}

.progress-bar.foreground.full {
  width: 100%;
}

.error-box {
  margin-top: 0.5rem;
  background-color: #fff7ed;
  border-left: 4px solid #f97316;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.error-list {
  font-size: 12px;
  color: #92400e;
  margin: 0;
  padding-left: 1rem;
}

.logo {
  color: #4C83EE;
  font-size: 24px;
}

.refresh-btn {
  background-color: #F3F4F6;
    color: #3A4150;
    font-size: 12px;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
}

.refresh-btn:hover {
  background-color: #e7e7e7;
  cursor: pointer;
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
