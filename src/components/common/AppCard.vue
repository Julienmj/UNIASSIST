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
}
.card-sm { padding: 16px 20px; }
.card-md { padding: 20px 24px; }
.card-lg { padding: 28px 32px; }
.card-hoverable {
  cursor: pointer;
}
.card-hoverable:hover {
  box-shadow: var(--shadow-hover);
}
</style>
