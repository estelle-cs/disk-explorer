<!-- components/PathInput.vue -->
<template>
  <div class="path-input" @click="onClick">
    <input
      type="text"
      class="input"
      :value="modelValue"
      readonly
    />
    <span class="icon">📁</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function onClick() {
  emit('click')
}
</script>

<style scoped>
.path-input {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0rem 1rem;
  font-size: 1rem;
  color: #6b7280;
  cursor: pointer;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  width: 20rem;
}

.icon {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  color: #9ca3af;
}
</style>
