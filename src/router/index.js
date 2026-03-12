import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/', component: () => import('../views/HomePage.vue'), meta: { public: true } },
  { path: '/system', component: () => import('../views/SystemPage.vue'), meta: { public: true } },
  { path: '/student/dashboard', component: () => import('../views/student/StudentDashboard.vue'), meta: { role: 'student' } },
  { path: '/student/courses', component: () => import('../views/student/CourseCatalog.vue'), meta: { role: 'student' } },
  { path: '/student/courses/:courseId', component: () => import('../views/student/CourseDetail.vue'), meta: { role: 'student' } },
  { path: '/student/enrollments', component: () => import('../views/student/MyEnrollments.vue'), meta: { role: 'student' } },
  { path: '/student/timetable', component: () => import('../views/student/TimetableView.vue'), meta: { role: 'student' } },
  { path: '/student/assignments', component: () => import('../views/student/AssignmentsView.vue'), meta: { role: 'student' } },
  { path: '/teacher/dashboard', component: () => import('../views/teacher/TeacherDashboard.vue'), meta: { role: 'teacher' } },
  { path: '/teacher/requests', component: () => import('../views/teacher/EnrollmentRequests.vue'), meta: { role: 'teacher' } },
  { path: '/teacher/courses', component: () => import('../views/teacher/TeacherCourses.vue'), meta: { role: 'teacher' } },
  { path: '/teacher/courses/:courseId', component: () => import('../views/teacher/CourseManagement.vue'), meta: { role: 'teacher' } },
  { path: '/teacher/announcements', component: () => import('../views/teacher/AnnouncementsView.vue'), meta: { role: 'teacher' } },
  { path: '/teacher/assignments', component: () => import('../views/teacher/AssignmentManagement.vue'), meta: { role: 'teacher' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) {
    return next()
  }
  if (!auth.isAuthenticated) return next('/system')
  if (to.meta.role && to.meta.role !== auth.role) {
    return next(auth.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
  }
  next()
})

export default router
