<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  ariaLabel: { type: String, default: null },
  ariaDescribedby: { type: String, default: null }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button 
    :type="type"
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :disabled="loading || disabled"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :aria-busy="loading"
    @click="emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="sm" />
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  font-size: calc(var(--text-font-size) * 0.875) !important;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px; /* Minimum touch target size */
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-sm { 
  padding: 6px 16px; 
  font-size: calc(var(--text-font-size) * 0.75) !important; 
  border-radius: 8px; 
  min-height: 36px;
}
.btn-md { 
  padding: 10px 20px; 
  font-size: calc(var(--text-font-size) * 0.875) !important;
  min-height: 44px;
}
.btn-lg { 
  padding: 14px 28px; 
  font-size: calc(var(--text-font-size) * 1) !important;
  min-height: 52px;
}

.btn-primary {
  background: #3B82F6;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #2563EB;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg);
  color: var(--text-body);
  border: 1px solid var(--border);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--border);
}

.btn-danger {
  background: transparent;
  color: #EF4444;
  border: 1.5px solid #EF4444;
}
.btn-danger:hover:not(:disabled) {
  background: #FEF2F2;
}

.btn-success {
  background: #10B981;
  color: white;
}
.btn-success:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--bg);
}
</style>
