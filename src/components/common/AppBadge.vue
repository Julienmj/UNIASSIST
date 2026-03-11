<script setup>
defineProps({
  variant: { type: String, default: 'neutral' },
  label: { type: String, default: '' },
  color: { type: String, default: '' }
})
</script>

<template>
  <span 
    v-if="color"
    class="badge"
    :style="{ 
      background: color + '33', 
      color: color,
      border: `1px solid ${color}66`
    }"
  >
    {{ label }}
  </span>
  <span v-else :class="['badge', `badge-${variant}`]">
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-success {
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #6EE7B7;
}
.badge-warning {
  background: #FFFBEB;
  color: #B45309;
  border: 1px solid #FCD34D;
}
.badge-danger {
  background: #FEF2F2;
  color: #991B1B;
  border: 1px solid #FCA5A5;
}
.badge-info {
  background: #EFF6FF;
  color: #3B82F6;
  border: 1px solid #3B82F6;
}
.badge-neutral {
  background: transparent;
  color: var(--text-body);
  border: 1px solid var(--border);
}
</style>
