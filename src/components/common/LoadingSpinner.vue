<script setup>
defineProps({
  size: { type: String, default: 'md' },
  color: { type: String, default: 'currentColor' }
})
</script>

<template>
  <div class="spinner" :class="`spinner-${size}`" :style="{ borderTopColor: color }"></div>
</template>

<style scoped>
.spinner {
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.spinner-sm { width: 16px; height: 16px; }
.spinner-md { width: 24px; height: 24px; }
.spinner-lg { width: 32px; height: 32px; }
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
