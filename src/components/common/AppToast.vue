<script setup>
import { useToast } from '../../composables/useToast.js'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const { toasts } = useToast()

function removeToast(id) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

function getIcon(type) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  }
  return icons[type] || Info
}

function getColor(type) {
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B'
  }
  return colors[type] || '#64748B'
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :style="{ borderLeftColor: getColor(toast.type) }"
      >
        <component :is="getIcon(toast.type)" :size="20" :color="getColor(toast.type)" />
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">
          <X :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
.toast {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 4px solid;
  min-width: 300px;
}
.toast-message {
  flex: 1;
  font-size: 14px;
  color: var(--text);
}
.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
.toast-close:hover {
  background: var(--bg);
  color: var(--text);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
