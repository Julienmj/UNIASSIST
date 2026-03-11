import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const initTheme = () => {
    const saved = localStorage.getItem('uniassist_theme')
    isDark.value = saved === 'dark'
    applyTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('uniassist_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('uniassist_theme', 'light')
    }
  }

  watch(isDark, applyTheme)

  return { isDark, initTheme, toggleTheme }
})
