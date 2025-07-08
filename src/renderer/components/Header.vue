<template>
  <header class="app-header">
    <h1>Disk Explorer</h1>
    <button @click="$emit('select-folder')">Choisir un dossier</button>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  background: #f8f8f8;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
