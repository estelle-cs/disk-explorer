<template>
  <div class="tree-view">
    <ul>
      <li
        v-for="item in sortedTree"
        :key="item.path"
        class="tree-item"
        :class="getSizeTagClass(item)"
      >
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
              :style="{
                color:
                  getSizeTag(item.size)?.label === 'Volumineux'
                    ? '#EF4444'
                    : getSizeTag(item.size)?.label === 'Gros'
                    ? '#F59E0B'
                    : getSizeTag(item.size)?.label === 'Moyen'
                    ? '#FACC15'
                    : '#9da3ae',
              }"
            />
            <font-awesome-icon
              v-if="!item.children"
              :icon="getFileIcon(item.name)"
              :class="'file-icon ' + getFileIcon(item.name)"
            />
            <span class="item-name">{{ item.name }}</span>
            <SizeTag v-if="item.children" :size="item.size" />
          </div>
          <span class="item-size">{{ formatSize(item.size) }}</span>
        </div>

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
import SizeTag from '@/components/SizeTag.vue';

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

function getSizeTag(size: number): { label: string; class: string } | null {
  if (size >= 10 * 1e9) return { label: 'Volumineux', class: 'tag-red' };
  if (size >= 5 * 1e9) return { label: 'Gros', class: 'tag-orange' };
  if (size >= 1 * 1e9) return { label: 'Moyen', class: 'tag-yellow' };
  if (size >= 100 * 1e6) return { label: 'Petit', class: 'tag-blue' };
  return { label: 'Léger', class: 'tag-green' };
}

function getSizeTagClass(item: any): string {
  if (getSizeTag(item.size)?.label === 'Volumineux' && item.children) {
    return 'tag-red';
  }
  if (getSizeTag(item.size)?.label === 'Gros' && item.children) {
    return 'tag-orange';
  }
  if (getSizeTag(item.size)?.label === 'Moyen' && item.children) {
    return 'tag-yellow';
  }
  if (getSizeTag(item.size)?.label === 'Petit' && item.children) {
    return 'tag-blue';
  }
  if (getSizeTag(item.size)?.label === 'Léger' && item.children) {
    return 'tag-green';
  }
  return '';
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
  padding: 5px 5px 5px 6px;
  border-radius: 5px;
}

.folder {
  padding: 15px;
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
  color: #4c83ee;
}
.file-pdf {
  color: #ef4444;
}
.file-zipper {
  color: #a855f7;
}
.file-video {
  color: #3b82f6;
}
.file-audio {
  color: #10b981;
}
.file-word {
  color: #2563eb;
}
.file-excel {
  color: #22c55e;
}
.file-powerpoint {
  color: #ea580c;
}
.file-lines {
  color: #6b7280;
}

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

.tag-red > .tree-label {
  border-left: 3px solid #EF4444;
  background-color: #ffefef;;
}
.tag-orange > .tree-label {
  border-left: 3px solid #F59E0B;
  background-color: #ffeed3;
}
.tag-yellow > .tree-label {
  border-left: 3px solid #FACC15;
  background-color: #fffef0;
}

.tag-green > .tree-label {
  border-left: 3px solid #10B981;
  background-color: #f1fff8;
}

.tag-blue > .tree-label {
  border-left: 3px solid #3B82F6;
  background-color: #f6faff;
}

.tag-red .size-tag {
  background-color: #fee2e2;
  color: #b91c1c;
}
.tag-orange .size-tag {
  background-color: #fef3c7;
  color: #b45309;
}
.tag-yellow .size-tag {
  background-color: #fef9c3;
  color: #92400e;
}

.tag-blue .size-tag {
  background-color: #dbeafe;
  color: #2563eb;
}
.tag-green .size-tag {
  background-color: #d1fae5;
  color: #047857;
}
</style>
