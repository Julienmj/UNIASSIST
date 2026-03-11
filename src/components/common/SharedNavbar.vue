<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useThemeStore } from '../../stores/theme.js'
import { GraduationCap, LogOut, Home, LayoutDashboard, Moon, Sun } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const theme = useThemeStore()

const activeTab = computed(() => {
  if (route.path === '/') return 'home'
  return 'system'
})

const isLoggedIn = computed(() => auth.isAuthenticated)
const userInitials = computed(() => auth.userInitials)
const userName = computed(() => auth.currentUser?.name)
const deptColor = computed(() => auth.deptColor)

function goToHome() {
  router.push('/')
}

function goToSystem() {
  if (isLoggedIn.value) {
    const role = auth.role
    router.push(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
  } else {
    router.push('/system')
  }
}

function handleLogout() {
  auth.logout()
  router.push('/system')
}
</script>

<template>
  <nav class="shared-navbar">
    <div class="navbar-left">
      <div class="logo-container">
        <div class="logo-square">
          <GraduationCap :size="20" color="white" />
        </div>
        <div class="brand-text">
          <span class="brand-uni">UNI</span><span class="brand-assist">ASSIST</span>
        </div>
      </div>
    </div>
    
    <div class="navbar-center">
      <div class="tab-container">
        <button 
          :class="['tab-btn', { active: activeTab === 'home' }]"
          @click="goToHome"
        >
          <Home :size="16" />
          Home
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'system' }]"
          @click="goToSystem"
        >
          <LayoutDashboard :size="16" />
          System
        </button>
      </div>
    </div>
    
    <div class="navbar-right">
      <button class="theme-toggle" @click="theme.toggleTheme" title="Toggle theme">
        <Moon v-if="!theme.isDark" :size="18" />
        <Sun v-if="theme.isDark" :size="18" />
      </button>
      <template v-if="isLoggedIn">
        <div class="user-info">
          <div class="user-avatar" :style="{ background: deptColor }">
            {{ userInitials }}
          </div>
          <span class="user-name">{{ userName }}</span>
        </div>
        <button class="auth-btn ghost" @click="handleLogout">
          <LogOut :size="16" />
          Logout
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.shared-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-square {
  width: 36px;
  height: 36px;
  background: #3B82F6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-size: 22px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-uni {
  color: #3B82F6;
}

.brand-assist {
  color: var(--text);
}

.navbar-center {
  display: flex;
}

.tab-container {
  background: var(--bg);
  border-radius: 999px;
  padding: 4px;
  display: inline-flex;
  gap: 2px;
}

.tab-btn {
  padding: 8px 28px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-muted);
}

.tab-btn:hover {
  color: var(--text);
}

.tab-btn.active {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  justify-content: flex-end;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-body);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms;
}

.theme-toggle:hover {
  background: var(--bg);
  border-color: var(--primary);
  color: var(--primary);
}

.auth-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;
  display: flex;
  align-items: center;
  gap: 6px;
}

.auth-btn.ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-body);
}

.auth-btn.ghost:hover {
  background: var(--bg);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 13px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

@media (max-width: 768px) {
  .shared-navbar {
    padding: 0 20px;
  }
  
  .tab-container {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>
