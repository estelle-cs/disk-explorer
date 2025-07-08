<template>
  <div class="tree-view">
    <ul>
      <li v-for="item in treeData" :key="item.path">
        <span>{{ item.name }} - {{ formatSize(item.size) }}</span>
        <TreeView v-if="item.children" :treeData="item.children" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface TreeNode {
  name: string;
  path: string;
  size: number;
  children?: TreeNode[];
}

const props = defineProps<{
  treeData: TreeNode[];
}>();

function formatSize(size: number) {
  if (size > 1e9) return `${(size / 1e9).toFixed(2)} Go`;
  if (size > 1e6) return `${(size / 1e6).toFixed(2)} Mo`;
  if (size > 1e3) return `${(size / 1e3).toFixed(2)} Ko`;
  return `${size} octets`;
}
</script>

<style scoped>
.tree-view ul {
  list-style: none;
  padding-left: 1rem;
}
.tree-view li {
  margin: 0.2rem 0;
}
</style>
