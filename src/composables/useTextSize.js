/**
 * Composable for text size functionality
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { getCurrentTextSize, setTextSize, increaseTextSize, decreaseTextSize } from '../utils/textSize.js'

export function useTextSize() {
  const currentSize = ref(getCurrentTextSize())
  
  // Update current size when it changes
  function updateCurrentSize() {
    currentSize.value = getCurrentTextSize()
  }
  
  // Listen for storage changes (cross-tab sync)
  function handleStorageChange(event) {
    if (event.key === 'uniassist_text_size') {
      updateCurrentSize()
    }
  }
  
  // Listen for custom text size changes
  function handleTextSizeChange() {
    updateCurrentSize()
  }
  
  onMounted(() => {
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom text size events
    window.addEventListener('textSizeChanged', handleTextSizeChange)
    
    // Initial update
    updateCurrentSize()
  })
  
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener('textSizeChanged', handleTextSizeChange)
  })
  
  function setCurrentSize(newSize) {
    setTextSize(newSize)
    updateCurrentSize()
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('textSizeChanged', { detail: newSize }))
  }
  
  function increase() {
    increaseTextSize()
    updateCurrentSize()
  }
  
  function decrease() {
    decreaseTextSize()
    updateCurrentSize()
  }
  
  return {
    currentSize,
    setCurrentSize,
    increase,
    decrease,
    updateCurrentSize
  }
}
