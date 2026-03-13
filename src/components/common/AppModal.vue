<script setup>
import { watch, ref, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import AppButton from './AppButton.vue'
import { trapFocus, generateId } from '/src/utils/accessibility.js'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  variant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])
const modalRef = ref(null)
const modalId = generateId('modal')
const titleId = generateId('title')

let cleanupFocus = null

watch(() => props.show, async (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    await nextTick()
    if (modalRef.value) {
      cleanupFocus = trapFocus(modalRef.value)
    }
  } else {
    document.body.style.overflow = ''
    if (cleanupFocus) {
      cleanupFocus()
      cleanupFocus = null
    }
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
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="modal-backdrop" 
        @click.self="emit('cancel')"
        :id="modalId"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div ref="modalRef" class="modal-card">
          <div class="modal-header">
            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            <button 
              class="close-btn" 
              @click="emit('cancel')"
              aria-label="Close dialog"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <AppButton 
              variant="ghost" 
              @click="emit('cancel')"
              aria-label="Cancel action"
            >
              {{ cancelText }}
            </AppButton>
            <AppButton 
              :variant="variant" 
              :loading="loading" 
              @click="emit('confirm')"
              aria-label="Confirm action"
            >
              {{ confirmText }}
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hover);
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
