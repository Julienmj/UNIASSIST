<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutDashboard, BookOpen, ClipboardList, Calendar, ClipboardCheck, Megaphone, FileText, LogOut } from 'lucide-vue-next'
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

const pendingCount = computed(() => {
  if (props.role !== 'teacher') return 0
  const teacherId = auth.currentUser?.id ?? ''
  const courseIds = courseStore.getCoursesByTeacher(teacherId).map(c => c.id)
  return enrollStore.getPendingCount(courseIds)
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo"></div>
      <h1 class="brand">UNIASSIST</h1>
    </div>
    
    <nav class="nav">
      <template v-if="role === 'student'">
        <RouterLink to="/student/dashboard" class="nav-link" active-class="nav-link-active">
          <LayoutDashboard :size="20" />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/student/courses" class="nav-link" active-class="nav-link-active">
          <BookOpen :size="20" />
          <span>Browse Courses</span>
        </RouterLink>
        <RouterLink to="/student/enrollments" class="nav-link" active-class="nav-link-active">
          <ClipboardList :size="20" />
          <span>My Enrollments</span>
        </RouterLink>
        <RouterLink to="/student/timetable" class="nav-link" active-class="nav-link-active">
          <Calendar :size="20" />
          <span>Timetable</span>
        </RouterLink>
        <RouterLink to="/student/assignments" class="nav-link" active-class="nav-link-active">
          <FileText :size="20" />
          <span>Assignments</span>
        </RouterLink>
      </template>
      
      <template v-else-if="role === 'teacher'">
        <RouterLink to="/teacher/dashboard" class="nav-link" active-class="nav-link-active">
          <LayoutDashboard :size="20" />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/teacher/requests" class="nav-link" active-class="nav-link-active">
          <ClipboardCheck :size="20" />
          <span>Enrollment Requests</span>
          <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
        </RouterLink>
        <RouterLink to="/teacher/courses" class="nav-link" active-class="nav-link-active">
          <BookOpen :size="20" />
          <span>My Courses</span>
        </RouterLink>
        <RouterLink to="/teacher/announcements" class="nav-link" active-class="nav-link-active">
          <Megaphone :size="20" />
          <span>Announcements & Reminders</span>
        </RouterLink>
        <RouterLink to="/teacher/assignments" class="nav-link" active-class="nav-link-active">
          <FileText :size="20" />
          <span>Assignment Management</span>
        </RouterLink>
      </template>
    </nav>
    
    <div class="sidebar-footer">
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
  </aside>
</template>

<style scoped>
.sidebar {
  width: 256px;
  height: calc(100vh - 64px);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 64px;
  left: 0;
}
.sidebar-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}
.logo {
  width: 36px;
  height: 36px;
  background: var(--primary);
  border-radius: 8px;
}
.brand {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}
.nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 10px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: calc(var(--text-font-size) * 0.875) !important;
  font-weight: 500;
  transition: all 150ms;
  position: relative;
}
.nav-link:hover {
  background: var(--bg);
  color: var(--text-body);
}
.nav-link-active {
  background: #EFF6FF;
  color: #3B82F6;
  font-weight: 600;
}
.badge-count {
  margin-left: auto;
  background: var(--warning);
  color: white;
  font-size: calc(var(--text-font-size) * 0.6875) !important;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
.sidebar-footer {
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
  font-size: calc(var(--text-font-size) * 0.875) !important;
}
.user-details {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-size: calc(var(--text-font-size) * 0.875) !important;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-dept {
  font-size: calc(var(--text-font-size) * 0.75) !important;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-radius: 8px;
  color: var(--danger);
  font-size: calc(var(--text-font-size) * 0.875) !important;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;
}
.logout-btn:hover {
  background: var(--danger-light);
  border-color: var(--danger);
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>
