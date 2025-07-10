<template>
  <div class="filters flex g8 wrap">
    <div class="flex column g4">
      <label class="body-xs">Filtrer par taille</label>
      <select v-model="localSize" @change="emitFilters">
        <option value="">Toutes</option>
        <option value=">=10000000000">≥ 10 Go</option>
        <option value=">=5000000000">≥ 5 Go</option>
        <option value=">=1000000000">≥ 1 Go</option>
        <option value=">=100000000">≥ 100 Mo</option>
        <option value="<100000000">< 100 Mo</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps<{
  sizeFilter: string;
}>();

const emit = defineEmits<(e: "update:filters", size: string) => void>();

const localSize = ref(props.sizeFilter);

watch([localSize], () => {
  emitFilters();
});

function emitFilters() {
  emit("update:filters", localSize.value);
}
</script>

<style scoped>
.filters select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 13px;
}

.flex {
  display: flex;
}
.g4 {
  gap: 4px;
}
.column {
  flex-direction: column;
}
.body-xs {
  font-size: 12px;
  color: #3a4150;
}
</style>
