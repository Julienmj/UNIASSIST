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
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  transition: box-shadow 200ms ease;
}
.card-sm { padding: 16px 20px; }
.card-md { padding: 20px 24px; }
.card-lg { padding: 28px 32px; }
.card-hoverable {
  cursor: pointer;
}
.card-hoverable:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.10);
}
</style>
