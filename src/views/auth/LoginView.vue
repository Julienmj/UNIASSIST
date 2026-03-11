<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { UNIVERSITIES } from '../../utils/mockData.js'
import AppInput from '../../components/common/AppInput.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import AppButton from '../../components/common/AppButton.vue'
import { GraduationCap, BookOpen, X } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const showAuthCard = ref(false)
const mode = ref('login')
const activeRole = ref('student')
const lockedRole = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = ref({ university: '', email: '', password: '' })
const loginErrors = ref({})

const registerForm = ref({
  fullName: '', email: '', password: '', confirmPassword: '',
  university: '', department: '', studentId: '', yearOfStudy: '', employeeId: ''
})
const registerErrors = ref({})

const universityOptions = computed(() => UNIVERSITIES.map(u => ({ value: u.id, label: u.name })))
const departmentOptions = [
  { value: 'SE', label: 'Software Engineering' },
  { value: 'NC', label: 'Networks & Cybersecurity' },
  { value: 'IM', label: 'Information Management' }
]
const yearOptions = [
  { value: 'Year 1', label: 'Year 1' },
  { value: 'Year 2', label: 'Year 2' },
  { value: 'Year 3', label: 'Year 3' },
  { value: 'Year 4', label: 'Year 4' }
]

const passwordStrength = computed(() => {
  const pwd = registerForm.value.password
  if (!pwd) return { level: 0, color: '#E2E8F0', text: '' }
  if (pwd.length < 6) return { level: 1, color: '#EF4444', text: 'Weak' }
  if (pwd.length < 10) return { level: 2, color: '#F59E0B', text: 'Medium' }
  return { level: 3, color: '#10B981', text: 'Strong' }
})

async function handleLogin() {
  loginErrors.value = {}
  errorMessage.value = ''
  
  if (!loginForm.value.university) loginErrors.value.university = 'University is required'
  if (!loginForm.value.email) loginErrors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(loginForm.value.email)) loginErrors.value.email = 'Invalid email format'
  if (!loginForm.value.password) loginErrors.value.password = 'Password is required'
  
  if (Object.keys(loginErrors.value).length > 0) return
  
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  
  try {
    auth.login(loginForm.value.email, loginForm.value.password, activeRole.value, loginForm.value.university)
    router.push(activeRole.value === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
  } catch(e) {
    errorMessage.value = e.message
    isLoading.value = false
  }
}

async function handleRegister() {
  registerErrors.value = {}
  errorMessage.value = ''
  
  if (!registerForm.value.fullName) registerErrors.value.fullName = 'Full name is required'
  if (!registerForm.value.email) registerErrors.value.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(registerForm.value.email)) registerErrors.value.email = 'Invalid email format'
  if (!registerForm.value.password) registerErrors.value.password = 'Password is required'
  else if (registerForm.value.password.length < 6) registerErrors.value.password = 'Password must be at least 6 characters'
  if (!registerForm.value.confirmPassword) registerErrors.value.confirmPassword = 'Please confirm password'
  else if (registerForm.value.password !== registerForm.value.confirmPassword) registerErrors.value.confirmPassword = 'Passwords do not match'
  if (!registerForm.value.university) registerErrors.value.university = 'University is required'
  if (!registerForm.value.department) registerErrors.value.department = 'Department is required'
  
  if (activeRole.value === 'student') {
    if (!registerForm.value.studentId) registerErrors.value.studentId = 'Student ID is required'
    if (!registerForm.value.yearOfStudy) registerErrors.value.yearOfStudy = 'Year of study is required'
  } else {
    if (!registerForm.value.employeeId) registerErrors.value.employeeId = 'Employee ID is required'
  }
  
  if (Object.keys(registerErrors.value).length > 0) return
  
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  
  try {
    auth.register(registerForm.value, activeRole.value)
    router.push(activeRole.value === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
  } catch(e) {
    errorMessage.value = e.message
    isLoading.value = false
  }
}

function openAuthCard(role, authMode = 'login') {
  activeRole.value = role
  lockedRole.value = role
  mode.value = authMode
  showAuthCard.value = true
}

function closeAuthCard() {
  showAuthCard.value = false
  lockedRole.value = null
}
</script>

<template>
  <div class="landing-page">
    <nav class="top-navbar">
      <div class="navbar-left">
        <div class="logo-icon">
          <GraduationCap :size="20" color="white" />
        </div>
        <div class="wordmark">
          <span class="word-uni">UNI</span><span class="word-assist">ASSIST</span>
        </div>
      </div>
      <div class="navbar-right">
        <button class="nav-btn nav-btn-ghost" @click="openAuthCard(activeRole, 'login')">Sign In</button>
        <button class="nav-btn nav-btn-primary" @click="openAuthCard(activeRole, 'register')">Get Started</button>
      </div>
    </nav>
    
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-headline">
          <p class="hero-subtitle">Welcome to</p>
          <h1 class="hero-title">UNIASSIST</h1>
          <p class="hero-tagline">Your University Management Platform</p>
        </div>
        
        <div class="role-cards">
          <div class="role-card" @click="openAuthCard('student', 'register')">
            <div class="role-avatar role-avatar-student">
              <GraduationCap :size="48" color="#3B82F6" />
            </div>
            <h3 class="role-name">Student</h3>
            <p class="role-desc">Browse courses & manage enrollments</p>
            <div class="role-btn role-btn-student">Enter as Student</div>
          </div>
          
          <div class="role-card" @click="openAuthCard('teacher', 'register')">
            <div class="role-avatar role-avatar-teacher">
              <BookOpen :size="48" color="#10B981" />
            </div>
            <h3 class="role-name">Teacher</h3>
            <p class="role-desc">Manage courses & student enrollments</p>
            <div class="role-btn role-btn-teacher">Enter as Teacher</div>
          </div>
        </div>
        
        <p class="hero-footer">
          Already have an account? 
          <button class="link-btn" @click="openAuthCard(activeRole, 'login')">Sign In</button>
        </p>
      </div>
    </div>
    
    <Transition name="modal">
      <div v-if="showAuthCard" class="modal-overlay" @click.self="closeAuthCard">
        <div class="auth-card">
          <button class="close-btn" @click="closeAuthCard">
            <X :size="20" />
          </button>
          
          <div class="auth-header">
            <div v-if="lockedRole" :class="['locked-badge', lockedRole === 'student' ? 'locked-badge-student' : 'locked-badge-teacher']">
              {{ lockedRole === 'student' ? '🎓 Student Portal' : '👨🏫 Teacher Portal' }}
            </div>
            <h2 class="auth-title">
              {{ mode === 'login' 
                ? (lockedRole === 'student' ? 'Student Sign In' : lockedRole === 'teacher' ? 'Teacher Sign In' : 'Welcome back')
                : (lockedRole === 'student' ? 'Create Student Account' : lockedRole === 'teacher' ? 'Create Teacher Account' : 'Create Account')
              }}
            </h2>
            <p class="auth-subtitle">{{ mode === 'login' ? 'Sign in to continue' : 'Join UNIASSIST today' }}</p>
          </div>
          
          <div v-if="!lockedRole" class="role-tabs">
            <button :class="['role-tab', { active: activeRole === 'student' }]" @click="activeRole = 'student'">
              Student
            </button>
            <button :class="['role-tab', { active: activeRole === 'teacher' }]" @click="activeRole = 'teacher'">
              Teacher
            </button>
          </div>
          
          <div class="mode-toggle">
            <button :class="['mode-btn', { active: mode === 'login' }]" @click="mode = 'login'">
              Sign In
            </button>
            <button :class="['mode-btn', { active: mode === 'register' }]" @click="mode = 'register'">
              Create Account
            </button>
          </div>
          
          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>
          
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="form">
            <AppSelect
              v-model="loginForm.university"
              label="University"
              :options="universityOptions"
              :error="loginErrors.university"
              required
            />
            <AppInput
              v-model="loginForm.email"
              type="email"
              label="Email"
              placeholder="your.email@university.edu"
              :error="loginErrors.email"
              required
            />
            <AppInput
              v-model="loginForm.password"
              type="password"
              label="Password"
              :error="loginErrors.password"
              required
            />
            <AppButton type="submit" :loading="isLoading" style="width: 100%; margin-top: 8px;">
              Sign In
            </AppButton>
          </form>
          
          <form v-else @submit.prevent="handleRegister" class="form">
            <AppInput
              v-model="registerForm.fullName"
              label="Full Name"
              placeholder="John Doe"
              :error="registerErrors.fullName"
              required
            />
            <AppInput
              v-model="registerForm.email"
              type="email"
              label="Email"
              placeholder="your.email@university.edu"
              :error="registerErrors.email"
              required
            />
            <div>
              <AppInput
                v-model="registerForm.password"
                type="password"
                label="Password"
                :error="registerErrors.password"
                required
              />
              <div v-if="registerForm.password" class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :style="{ width: (passwordStrength.level * 33.33) + '%', background: passwordStrength.color }"></div>
                </div>
                <span class="strength-text" :style="{ color: passwordStrength.color }">{{ passwordStrength.text }}</span>
              </div>
            </div>
            <AppInput
              v-model="registerForm.confirmPassword"
              type="password"
              label="Confirm Password"
              :error="registerErrors.confirmPassword"
              required
            />
            <AppSelect
              v-model="registerForm.university"
              label="University"
              :options="universityOptions"
              :error="registerErrors.university"
              required
            />
            <AppSelect
              v-model="registerForm.department"
              label="Department"
              :options="departmentOptions"
              :error="registerErrors.department"
              required
            />
            
            <template v-if="activeRole === 'student'">
              <AppInput
                v-model="registerForm.studentId"
                label="Student ID"
                placeholder="e.g. S2024001"
                :error="registerErrors.studentId"
                required
              />
              <AppSelect
                v-model="registerForm.yearOfStudy"
                label="Year of Study"
                :options="yearOptions"
                :error="registerErrors.yearOfStudy"
                required
              />
            </template>
            
            <template v-else>
              <AppInput
                v-model="registerForm.employeeId"
                label="Employee ID"
                placeholder="e.g. EMP001"
                :error="registerErrors.employeeId"
                required
              />
            </template>
            
            <AppButton type="submit" :loading="isLoading" style="width: 100%; margin-top: 8px;">
              Create Account
            </AppButton>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
}
.landing-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.4;
  pointer-events: none;
}

.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: #3B82F6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wordmark {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
}
.word-uni {
  color: #3B82F6;
}
.word-assist {
  color: var(--text);
}
.navbar-right {
  display: flex;
  gap: 12px;
}
.nav-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.nav-btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}
.nav-btn-ghost:hover {
  background: var(--bg);
}
.nav-btn-primary {
  background: #3B82F6;
  color: white;
  font-weight: 600;
}
.nav-btn-primary:hover {
  background: #1D4ED8;
}

.hero-section {
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  z-index: 1;
}
.hero-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-headline {
  text-align: center;
  margin-bottom: 48px;
}
.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  font-weight: 400;
  margin: 0 0 8px 0;
}
.hero-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 56px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-tagline {
  font-size: 18px;
  color: var(--text-muted);
  font-weight: 400;
  margin: 8px 0 0 0;
}

.role-cards {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}
.role-card {
  width: 280px;
  height: 320px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 250ms ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px;
}
.role-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-hover);
  border-color: #3B82F6;
}
.role-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.role-avatar-student {
  background: linear-gradient(135deg, #DBEAFE, #EFF6FF);
  border: 3px solid #BFDBFE;
}
.role-avatar-teacher {
  background: linear-gradient(135deg, #D1FAE5, #ECFDF5);
  border: 3px solid #A7F3D0;
}
.role-name {
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.role-desc {
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
  max-width: 200px;
  margin: 0;
}
.role-btn {
  padding: 8px 24px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid;
}
.role-btn-student {
  background: #EFF6FF;
  color: #3B82F6;
  border-color: #BFDBFE;
}
.role-btn-teacher {
  background: #ECFDF5;
  color: #10B981;
  border-color: #A7F3D0;
}

.hero-footer {
  font-size: 14px;
  color: var(--text-muted);
}
.link-btn {
  background: none;
  border: none;
  color: #3B82F6;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.auth-card {
  max-width: 420px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow-hover);
  position: relative;
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--bg);
  color: var(--text);
}

.auth-header {
  margin-bottom: 24px;
}
.locked-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}
.locked-badge-student {
  background: #EFF6FF;
  color: #3B82F6;
}
.locked-badge-teacher {
  background: #ECFDF5;
  color: #10B981;
}
.auth-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--text);
}
.auth-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.role-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: var(--bg);
  padding: 4px;
  border-radius: var(--radius-sm);
}
.role-tab {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.role-tab.active {
  background: var(--surface);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}
.mode-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.mode-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.error-alert {
  padding: 12px 16px;
  background: var(--danger-light);
  border: 1px solid var(--danger);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 14px;
  margin-bottom: 16px;
}

.dark .error-alert {
  color: white;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  transition: all 0.3s;
}
.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .auth-card {
  animation: modalIn 0.2s ease forwards;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 0 20px;
  }
  .hero-title {
    font-size: 40px;
  }
  .role-cards {
    flex-direction: column;
    gap: 20px;
  }
  .role-card {
    width: 100%;
    height: 200px;
  }
  .auth-card {
    padding: 24px;
  }
}
</style>
