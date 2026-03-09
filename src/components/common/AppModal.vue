<script setup>
import { watch } from 'vue'
import { X } from 'lucide-vue-next'
import AppButton from './AppButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  variant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])

watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function handleEscape(e) {
  if (e.key === 'Escape' && props.show) {
    emit('cancel')
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="emit('cancel')">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="close-btn" @click="emit('cancel')">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <AppButton variant="ghost" @click="emit('cancel')">
            {{ cancelText }}
          </AppButton>
          <AppButton :variant="variant" :loading="loading" @click="emit('confirm')">
            {{ confirmText }}
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
.close-btn:hover {
  background: var(--bg);
  color: var(--text);
}
.modal-body {
  padding: 24px;
}
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-card {
  transition: transform 0.2s, opacity 0.2s;
}
.modal-enter-from .modal-card {
  transform: scale(0.95);
  opacity: 0;
}
</style>
