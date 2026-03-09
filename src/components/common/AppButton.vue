<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button 
    :type="type"
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :disabled="loading || disabled"
    @click="emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="sm" />
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-sm { padding: 6px 16px; font-size: 13px; border-radius: 8px; }
.btn-md { padding: 10px 20px; }
.btn-lg { padding: 14px 28px; font-size: 15px; }

.btn-primary {
  background: #3B82F6;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #2563EB;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #F8FAFC;
  color: #374151;
  border: 1px solid #E2E8F0;
}
.btn-secondary:hover:not(:disabled) {
  background: #F1F5F9;
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
  color: #6B7280;
  border: 1px solid #E2E8F0;
}
.btn-ghost:hover:not(:disabled) {
  background: #F8FAFC;
}
</style>
