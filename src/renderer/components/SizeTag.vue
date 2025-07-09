<template>
  <span v-if="tag" class="size-tag" :class="tag.class">
    {{ tag.label }}
  </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{ size: number }>();

const tag = computed(() => {
  const size = props.size;

  if (size >= 10 * 1e9) return { label: 'Volumineux', class: 'tag-red' };
  if (size >= 5 * 1e9) return { label: 'Gros', class: 'tag-orange' };
  if (size >= 1 * 1e9) return { label: 'Moyen', class: 'tag-yellow' };
  if (size >= 100 * 1e6) return { label: 'Petit', class: 'tag-blue' };
  return { label: 'Léger', class: 'tag-green' };
});
</script>

<style scoped>
.size-tag {
  margin-left: 6px;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
  background-color: #e5e7eb;
  color: #1f2937;
}

.tag-red {
  background-color: #fee2e2;
  color: #b91c1c;
}
.tag-orange {
  background-color: #fef3c7;
  color: #b45309;
}
.tag-yellow {
  background-color: #fef9c3;
  color: #92400e;
}
.tag-blue {
  background-color: #dbeafe;
  color: #2563eb;
}
.tag-green {
  background-color: #d1fae5;
  color: #047857;
}
</style>