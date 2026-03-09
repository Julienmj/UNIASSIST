<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X, LayoutDashboard, BookOpen, ClipboardList, Calendar, ClipboardCheck, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'

const props = defineProps({
  role: { type: String, required: true }
})

const router = useRouter()
const auth = useAuthStore()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()

const showDrawer = ref(false)

const pendingCount = computed(() => {
  if (props.role !== 'teacher') return 0
  const teacherId = auth.currentUser?.id ?? ''
  const courseIds = courseStore.getCoursesByTeacher(teacherId).map(c => c.id)
  return enrollStore.getPendingCount(courseIds)
})

function closeDrawer() {
  showDrawer.value = false
}

function handleLogout() {
  auth.logout()
  router.push('/login')
  closeDrawer()
}
</script>

<template>
  <nav class="navbar">
    <button class="menu-btn" @click="showDrawer = true">
      <Menu :size="24" />
    </button>
    <h1 class="navbar-brand">UNIASSIST</h1>
    <div class="navbar-avatar" :style="{ background: auth.deptColor }">
      {{ auth.userInitials }}
    </div>
  </nav>

  <Transition name="drawer">
    <div v-if="showDrawer" class="drawer-backdrop" @click="closeDrawer">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h2 class="drawer-title">Menu</h2>
          <button class="close-btn" @click="closeDrawer">
            <X :size="24" />
          </button>
        </div>
        
        <div class="drawer-nav">
          <template v-if="role === 'student'">
            <RouterLink to="/student/dashboard" class="drawer-link" @click="closeDrawer">
              <LayoutDashboard :size="20" />
              <span>Dashboard</span>
            </RouterLink>
            <RouterLink to="/student/courses" class="drawer-link" @click="closeDrawer">
              <BookOpen :size="20" />
              <span>Browse Courses</span>
            </RouterLink>
            <RouterLink to="/student/enrollments" class="drawer-link" @click="closeDrawer">
              <ClipboardList :size="20" />
              <span>My Enrollments</span>
            </RouterLink>
            <RouterLink to="/student/timetable" class="drawer-link" @click="closeDrawer">
              <Calendar :size="20" />
              <span>Timetable</span>
            </RouterLink>
          </template>
          
          <template v-else-if="role === 'teacher'">
            <RouterLink to="/teacher/dashboard" class="drawer-link" @click="closeDrawer">
              <LayoutDashboard :size="20" />
              <span>Dashboard</span>
            </RouterLink>
            <RouterLink to="/teacher/requests" class="drawer-link" @click="closeDrawer">
              <ClipboardCheck :size="20" />
              <span>Enrollment Requests</span>
              <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
            </RouterLink>
            <RouterLink to="/teacher/courses" class="drawer-link" @click="closeDrawer">
              <BookOpen :size="20" />
              <span>My Courses</span>
            </RouterLink>
          </template>
        </div>
        
        <div class="drawer-footer">
          <div class="user-info">
            <div class="avatar" :style="{ background: auth.deptColor }">
              {{ auth.userInitials }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ auth.currentUser?.name }}</div>
              <div class="user-dept">{{ auth.currentUser?.departmentName }}</div>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <LogOut :size="18" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.navbar {
  display: none;
}

@media (max-width: 1024px) {
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 64px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  .menu-btn {
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
  }
  .navbar-brand {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    margin: 0;
  }
  .navbar-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
}
.drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0,0,0,0.1);
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}
.drawer-title {
  font-size: 20px;
  font-weight: 700;
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
}
.drawer-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}
.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}
.drawer-link:hover {
  background: var(--bg);
  color: var(--text);
}
.badge-count {
  margin-left: auto;
  background: var(--warning);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
.drawer-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}
.user-details {
  flex: 1;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.user-dept {
  font-size: 12px;
  color: var(--text-muted);
}
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.3s;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active .drawer {
  transition: transform 0.3s;
}
.drawer-enter-from .drawer {
  transform: translateX(-100%);
}
.drawer-leave-active .drawer {
  transition: transform 0.3s;
}
.drawer-leave-to .drawer {
  transform: translateX(-100%);
}
</style>
