<!-- components/BaseButton.vue -->
<template>
  <button :class="['base-button', variant]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant: string
  disabled?: boolean
}>()
</script>

<style scoped>
.base-button {
  border: none;
  padding: 12px 18px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: white;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.green-button {
  background-color: #55B785;
}
.green-button:hover {
  background-color: #489d71;
}

.blue-button {
  background-color: #4C83EE;
}
.blue-button:hover {
  background-color: #3f6cc7;
}

.red-button {
  background-color: #EF4444;
}
.red-button:hover {
  background-color: #b83333;
}
</style>
