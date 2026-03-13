/**
 * Text size accessibility utilities
 */

// Text size levels
export const TEXT_SIZES = {
  small: { name: 'Small', scale: 0.875, label: 'A' },
  normal: { name: 'Normal', scale: 1, label: 'A' },
  large: { name: 'Large', scale: 1.125, label: 'A' },
  extraLarge: { name: 'Extra Large', scale: 1.25, label: 'A' },
  huge: { name: 'Huge', scale: 1.5, label: 'A' }
}

// Default text size
const DEFAULT_SIZE = 'normal'

// Storage key
const STORAGE_KEY = 'uniassist_text_size'

// Get current text size
export function getCurrentTextSize() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_SIZE
}

// Set text size
export function setTextSize(size) {
  if (!TEXT_SIZES[size]) {
    console.warn(`Invalid text size: ${size}`)
    return
  }
  
  localStorage.setItem(STORAGE_KEY, size)
  applyTextSize(size)
  
  // Announce to screen readers
  if (typeof window !== 'undefined' && window.announceToScreenReader) {
    window.announceToScreenReader(`Text size changed to ${TEXT_SIZES[size].name}`)
  }
  
  // Dispatch custom event for HomePage
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('textSizeChanged', { detail: size }))
  }
}

// Apply text size to document
export function applyTextSize(size) {
  if (!TEXT_SIZES[size]) return
  
  const scale = TEXT_SIZES[size].scale
  
  // Apply CSS custom property to root
  document.documentElement.style.setProperty('--text-scale', scale)
  
  // Update data attribute for CSS targeting
  document.documentElement.setAttribute('data-text-size', size)
  
  // Force reflow to ensure styles apply
  document.documentElement.style.display = 'none'
  document.documentElement.offsetHeight // Force reflow
  document.documentElement.style.display = ''
  
  // Apply to body for older browsers as fallback
  document.body.style.fontSize = `${scale * 16}px`
  
  // Update all elements with explicit font-size
  const allElements = document.querySelectorAll('*')
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element)
    const currentFontSize = computedStyle.fontSize
    
    if (currentFontSize && currentFontSize !== '0px') {
      // Only apply if element has explicit font-size
      element.style.setProperty('--original-font-size', currentFontSize)
    }
  })
}

// Initialize text size
export function initTextSize() {
  const currentSize = getCurrentTextSize()
  applyTextSize(currentSize)
  
  // Add keyboard shortcuts
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyboardShortcuts)
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + Plus: Increase text size
  if ((event.ctrlKey || event.metaKey) && event.key === '+' || event.key === '=') {
    event.preventDefault()
    increaseTextSize()
  }
  
  // Ctrl/Cmd + Minus: Decrease text size
  if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    event.preventDefault()
    decreaseTextSize()
  }
  
  // Ctrl/Cmd + 0: Reset text size
  if ((event.ctrlKey || event.metaKey) && event.key === '0') {
    event.preventDefault()
    resetTextSize()
  }
}

// Increase text size
export function increaseTextSize() {
  const sizes = Object.keys(TEXT_SIZES)
  const currentSize = getCurrentTextSize()
  const currentIndex = sizes.indexOf(currentSize)
  const nextIndex = Math.min(currentIndex + 1, sizes.length - 1)
  const newSize = sizes[nextIndex]
  setTextSize(newSize)
  return newSize
}

// Decrease text size
export function decreaseTextSize() {
  const sizes = Object.keys(TEXT_SIZES)
  const currentSize = getCurrentTextSize()
  const currentIndex = sizes.indexOf(currentSize)
  const prevIndex = Math.max(currentIndex - 1, 0)
  const newSize = sizes[prevIndex]
  setTextSize(newSize)
  return newSize
}

// Get available text sizes
export function getTextSizeOptions() {
  return Object.entries(TEXT_SIZES).map(([key, value]) => ({
    key,
    name: value.name,
    scale: value.scale,
    label: value.label,
    current: key === getCurrentTextSize()
  }))
}

// Reset to default
export function resetTextSize() {
  setTextSize(DEFAULT_SIZE)
}

// Get current scale
export function getCurrentScale() {
  const size = getCurrentTextSize()
  return TEXT_SIZES[size]?.scale || 1
}
