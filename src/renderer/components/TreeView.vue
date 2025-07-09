<template>
  <div class="tree-view">
    <ul>
      <li v-for="item in sortedTree" :key="item.path" class="tree-item">
        <div
          class="tree-label"
          @click="toggle(item.path)"
          :class="{ folder: !!item.children }"
        >
          <div class="flex row align-center gap-8">
            <font-awesome-icon
              v-if="item.children"
              :icon="isOpen(item.path) ? 'chevron-down' : 'chevron-right'"
              class="icon"
            />
            <font-awesome-icon
              v-if="item.children"
              icon="folder"
              class="icon"
            />
            <font-awesome-icon
              v-if="!item.children"
              :icon="getFileIcon(item.name)"
              :class="'file-icon ' + getFileIcon(item.name)"
            />
            <span class="item-name">{{ item.name }}</span>
          </div>
          <span class="item-size">{{ formatSize(item.size) }}</span>
        </div>

        <!-- Sous-dossiers visibles seulement si ouvert -->
        <TreeView
          v-if="item.children && isOpen(item.path)"
          :treeData="item.children"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";

interface TreeNode {
  name: string;
  path: string;
  size: number;
  children?: TreeNode[];
}

const props = defineProps<{
  treeData: TreeNode[];
}>();

const openNodes = ref<Set<string>>(new Set());

function toggle(path: string) {
  if (openNodes.value.has(path)) {
    openNodes.value.delete(path);
  } else {
    openNodes.value.add(path);
  }
}

function isOpen(path: string) {
  return openNodes.value.has(path);
}

const sortedTree = computed(() =>
  props.treeData.slice().sort((a, b) => b.size - a.size)
);

function formatSize(size: number) {
  if (size > 1e9) return `${(size / 1e9).toFixed(2)} Go`;
  if (size > 1e6) return `${(size / 1e6).toFixed(2)} Mo`;
  if (size > 1e3) return `${(size / 1e3).toFixed(2)} Ko`;
  return `${size} octets`;
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "zip":
    case "rar":
      return "file-zipper";
    case "pdf":
      return "file-pdf";
    case "mp4":
    case "mov":
      return "file-video";
    case "mp3":
    case "wav":
      return "file-audio";
    case "doc":
    case "docx":
      return "file-word";
    case "xls":
    case "xlsx":
      return "file-excel";
    case "ppt":
      return "file-powerpoint";
    case "txt":
    case "md":
      return "file-lines";
    default:
      return "file";
  }
}
</script>

<style scoped>
.tree-view ul {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}

.tree-item {
  margin: 0.2rem 0;
}

.tree-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 5px;
}

.folder {
  padding: 10px;
}

.item-name {
  flex: 1;
  font-size: 14px;
  color: #121826;
}

.item-size {
  color: #121826;
  font-size: 14px;
  font-weight: 700;
}

.icon {
  color: #9da3ae;
  font-size: 12px;
}

.file-icon {
  font-size: 12px;
  color: #4C83EE;
}
.file-pdf { color: #EF4444; }
.file-zipper { color: #A855F7; }
.file-video { color: #3b82f6; }
.file-audio { color: #10b981; }
.file-word { color: #2563eb; }
.file-excel { color: #22c55e; }
.file-powerpoint { color: #ea580c; }
.file-lines { color: #6b7280; }

.flex {
  display: flex;
}
.row {
  flex-direction: row;
}
.align-center {
  align-items: center;
}
.gap-8 {
  gap: 8px;
}
</style>
