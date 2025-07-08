<!-- components/CardContainer.vue -->
<template>
  <div class="card-container">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
.card-container {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #E6E7EB;
  padding: 1.5rem 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}
</style>
