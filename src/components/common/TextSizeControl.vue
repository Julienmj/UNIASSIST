<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTextSizeOptions, setTextSize, getCurrentTextSize, increaseTextSize, decreaseTextSize } from '../../utils/textSize.js'
import { Type, Minus, Plus } from 'lucide-vue-next'

const currentSize = ref(getCurrentTextSize())
const showDropdown = ref(false)

const textSizes = computed(() => getTextSizeOptions())

const currentSizeInfo = computed(() => {
  const size = textSizes.value.find(s => s.key === currentSize.value)
  return size || textSizes.value[1] // fallback to normal
})

function selectSize(sizeKey) {
  currentSize.value = sizeKey
  setTextSize(sizeKey)
  showDropdown.value = false
  
  // Dispatch custom event for HomePage
  window.dispatchEvent(new CustomEvent('textSizeChanged', { detail: sizeKey }))
}

function handleIncreaseSize() {
  increaseTextSize()
  currentSize.value = getCurrentTextSize()
  
  // Dispatch custom event for HomePage
  window.dispatchEvent(new CustomEvent('textSizeChanged', { detail: currentSize.value }))
}

function handleDecreaseSize() {
  decreaseTextSize()
  currentSize.value = getCurrentTextSize()
  
  // Dispatch custom event for HomePage
  window.dispatchEvent(new CustomEvent('textSizeChanged', { detail: currentSize.value }))
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.text-size-control')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="text-size-control">
    <!-- Compact Button -->
    <button
      class="text-size-btn"
      @click="toggleDropdown"
      :aria-label="`Text size: ${currentSizeInfo.name}. Click to change text size`"
      :aria-expanded="showDropdown"
    >
      <Type :size="16" />
      <span class="text-size-label">{{ currentSizeInfo.label }}</span>
      <span class="text-size-name">{{ currentSizeInfo.name }}</span>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="showDropdown" class="text-size-dropdown" role="menu">
      <div class="text-size-header">
        <h3>Text Size</h3>
        <div class="text-size-controls">
          <button
            @click="handleDecreaseSize"
            class="size-btn decrease"
            :aria-label="'Decrease text size'"
            :disabled="currentSize === 'small'"
          >
            <Minus :size="14" />
          </button>
          <button
            @click="handleIncreaseSize"
            class="size-btn increase"
            :aria-label="'Increase text size'"
            :disabled="currentSize === 'huge'"
          >
            <Plus :size="14" />
          </button>
        </div>
      </div>
      
      <div class="text-size-options">
        <button
          v-for="size in textSizes"
          :key="size.key"
          class="size-option"
          :class="{ active: size.current }"
          @click="selectSize(size.key)"
          :aria-label="`Set text size to ${size.name}`"
          :aria-current="size.current"
          role="menuitem"
        >
          <span class="size-preview" :style="{ fontSize: `${size.scale}rem` }">{{ size.label }}</span>
          <span class="size-name">{{ size.name }}</span>
          <span v-if="size.current" class="size-current">✓</span>
        </button>
      </div>
      
      <div class="text-size-footer">
        <button
          @click="selectSize('normal')"
          class="reset-btn"
          aria-label="Reset text size to normal"
        >
          Reset to Normal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-size-control {
  position: relative;
  display: inline-block;
}

.text-size-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.text-size-btn:hover {
  background: var(--bg-hover);
  border-color: var(--primary);
}

.text-size-label {
  font-weight: 600;
  font-size: 16px;
}

.text-size-name {
  font-size: 12px;
  color: var(--text-muted);
}

.text-size-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
}

.text-size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.text-size-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.text-size-controls {
  display: flex;
  gap: 4px;
}

.size-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.size-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-size-options {
  padding: 8px 0;
}

.size-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.size-option:hover {
  background: var(--bg-hover);
}

.size-option.active {
  background: var(--primary-light);
  color: var(--primary);
}

.size-preview {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.size-name {
  flex: 1;
  font-size: 14px;
}

.size-current {
  color: var(--primary);
  font-weight: 600;
}

.text-size-footer {
  padding: 8px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

.reset-btn {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.reset-btn:hover {
  background: var(--bg-hover);
  color: var(--text);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .text-size-btn,
  .text-size-dropdown {
    border-color: ButtonText;
  }
  
  .text-size-btn:hover,
  .size-option:hover,
  .reset-btn:hover {
    background: Highlight;
    color: HighlightText;
  }
  
  .size-option.active {
    background: Highlight;
    color: HighlightText;
  }
}
</style>
