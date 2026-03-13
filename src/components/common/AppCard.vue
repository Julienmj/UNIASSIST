<script setup>
defineProps({
  padding: { type: String, default: 'md' },
  hoverable: { type: Boolean, default: false }
})
</script>

<template>
  <div :class="['card', `card-${padding}`, { 'card-hoverable': hoverable }]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease;
  font-size: inherit !important;
}
.card-sm { 
  padding: 16px 20px; 
  font-size: calc(var(--text-font-size) * 0.875) !important;
}
.card-md { 
  padding: 20px 24px; 
  font-size: var(--text-font-size) !important;
}
.card-lg { 
  padding: 28px 32px; 
  font-size: calc(var(--text-font-size) * 1.125) !important;
}
.card-hoverable {
  cursor: pointer;
}
.card-hoverable:hover {
  box-shadow: var(--shadow-hover);
}
</style>
