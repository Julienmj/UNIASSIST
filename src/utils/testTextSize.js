/**
 * Test utility for text size functionality
 */
import { getCurrentTextSize, setTextSize, applyTextSize } from './textSize.js'

export function testTextSizeSystem() {
  console.log('🔍 Testing Text Size System...')
  
  // Test 1: Check current size
  const currentSize = getCurrentTextSize()
  console.log(`✅ Current size: ${currentSize}`)
  
  // Test 2: Apply different sizes
  const sizes = ['small', 'normal', 'large', 'extraLarge', 'huge']
  
  sizes.forEach(size => {
    setTextSize(size)
    const appliedSize = getCurrentTextSize()
    console.log(`✅ Set size to ${size}: ${appliedSize === size ? 'PASS' : 'FAIL'}`)
    
    // Check CSS variable
    const rootElement = document.documentElement
    const cssScale = rootElement.style.getPropertyValue('--text-scale')
    console.log(`   CSS scale: ${cssScale}`)
    
    // Check data attribute
    const dataAttr = rootElement.getAttribute('data-text-size')
    console.log(`   Data attribute: ${dataAttr}`)
  })
  
  // Reset to normal
  setTextSize('normal')
  console.log('✅ Reset to normal size')
  
  console.log('🎉 Text Size System Test Complete!')
}

// Auto-run test in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testTextSizeSystem)
  } else {
    testTextSizeSystem()
  }
}
