<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useThemeStore } from '../../stores/theme.js'
import { initTextSize } from '../../utils/textSize.js'
import { GraduationCap, LogOut, Home, LayoutDashboard, Moon, Sun } from 'lucide-vue-next'
import TextSizeControl from './TextSizeControl.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const theme = useThemeStore()

// Initialize text size on component mount
initTextSize()

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
          <GraduationCap :size="24" color="white" />
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
          <Home :size="18" />
          <span class="tab-text">Home</span>
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'system' }]"
          @click="goToSystem"
        >
          <LayoutDashboard :size="18" />
          <span class="tab-text">System</span>
        </button>
      </div>
    </div>
    
    <div class="navbar-right">
      <TextSizeControl />
      <button class="theme-toggle" @click="theme.toggleTheme" title="Toggle theme">
        <Moon v-if="!theme.isDark" :size="20" />
        <Sun v-if="theme.isDark" :size="20" />
      </button>
      <template v-if="isLoggedIn">
        <div class="user-section">
          <div class="user-info">
            <div class="user-avatar" :style="{ background: deptColor }">
              {{ userInitials }}
            </div>
            <span class="user-name">{{ userName }}</span>
          </div>
          <button class="auth-btn ghost enhanced" @click="handleLogout">
            <LogOut :size="18" />
            <span class="logout-text">Logout</span>
          </button>
        </div>
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  backdrop-filter: blur(20px);
  transition: all 300ms ease;
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
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(59,130,246,0.25);
  transition: all 300ms ease;
  position: relative;
  overflow: hidden;
}

.logo-square::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  transform: rotate(45deg);
  transition: all 0.6s ease;
}

.logo-square:hover::before {
  animation: logoShine 0.6s ease;
}

@keyframes logoShine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.logo-square:hover {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.3px;
  transition: all 300ms ease;
}

.logo-container:hover .brand-text {
  transform: translateX(2px);
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
  display: flex;
  gap: 4px;
  background: rgba(59,130,246,0.05);
  padding: 4px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59,130,246,0.1);
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 250ms ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tab-btn:hover {
  background: rgba(59,130,246,0.1);
  color: var(--text);
  transform: translateY(-1px);
}

.tab-btn.active {
  background: rgba(59,130,246,0.15);
  color: #3B82F6;
  box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59,130,246,0.2);
}

.tab-text {
  font-weight: 600;
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
  transition: all 250ms ease;
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent);
  transition: left 0.4s ease;
}

.theme-toggle:hover::before {
  left: 100%;
}

.theme-toggle:hover {
  background: var(--bg);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 12px rgba(59,130,246,0.2);
}

.auth-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 250ms ease;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.auth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.4s ease;
}

.auth-btn:hover::before {
  left: 100%;
}

.logout-text {
  font-weight: 600;
}

.auth-btn.ghost {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(59,130,246,0.3);
  color: #3B82F6;
}

.auth-btn.ghost:hover {
  background: rgba(255,255,255,0.8);
  border-color: #3B82F6;
  color: #1D4ED8;
  box-shadow: 0 2px 8px rgba(59,130,246,0.2);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  margin: -8px -16px;
  background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(29,78,216,0.05) 100%);
  border-left: 1px solid rgba(59,130,246,0.15);
  backdrop-filter: blur(10px);
  transition: all 300ms ease;
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
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 250ms ease;
  position: relative;
}

.user-avatar::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-avatar:hover::after {
  opacity: 0.3;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1D4ED8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .shared-navbar {
    padding: 0 20px;
    height: 64px;
  }
  
  .tab-container {
    display: none;
  }
  
  .navbar-right {
    gap: 8px;
  }
  
  .brand-text {
    font-size: 18px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .user-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .text-size-control .text-size-name {
    display: none;
  }
  
  .text-size-control .text-size-label {
    font-size: 14px;
  }
}
</style>
