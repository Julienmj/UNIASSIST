/**
 * Accessibility utilities for screen reader support
 */

// Announce messages to screen readers
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Generate unique IDs for accessibility
let idCounter = 0
export function generateId(prefix = 'a11y') {
  return `${prefix}-${++idCounter}`
}

// Focus trap utility for modals
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  firstFocusable?.focus()

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// Skip to main content link
export function addSkipLink() {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'skip-link'
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 9999;
    transition: top 0.3s;
  `
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px'
  })
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })
  
  document.body.insertBefore(skipLink, document.body.firstChild)
}
