import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/', component: () => import('../views/HomePage.vue'), meta: { public: true, title: 'UNIASSIST - University Management Platform' } },
  { path: '/system', component: () => import('../views/SystemPage.vue'), meta: { public: true, title: 'Login to UNIASSIST' } },
  { path: '/student/dashboard', component: () => import('../views/student/StudentDashboard.vue'), meta: { role: 'student', title: 'Student Dashboard' } },
  { path: '/student/courses', component: () => import('../views/student/CourseCatalog.vue'), meta: { role: 'student', title: 'Course Catalog' } },
  { path: '/student/courses/:courseId', component: () => import('../views/student/CourseDetail.vue'), meta: { role: 'student', title: 'Course Details' } },
  { path: '/student/enrollments', component: () => import('../views/student/MyEnrollments.vue'), meta: { role: 'student', title: 'My Enrollments' } },
  { path: '/student/timetable', component: () => import('../views/student/TimetableView.vue'), meta: { role: 'student', title: 'Timetable' } },
  { path: '/student/assignments', component: () => import('../views/student/AssignmentsView.vue'), meta: { role: 'student', title: 'Assignments' } },
  { path: '/teacher/dashboard', component: () => import('../views/teacher/TeacherDashboard.vue'), meta: { role: 'teacher', title: 'Teacher Dashboard' } },
  { path: '/teacher/requests', component: () => import('../views/teacher/EnrollmentRequests.vue'), meta: { role: 'teacher', title: 'Enrollment Requests' } },
  { path: '/teacher/courses', component: () => import('../views/teacher/TeacherCourses.vue'), meta: { role: 'teacher', title: 'My Courses' } },
  { path: '/teacher/courses/:courseId', component: () => import('../views/teacher/CourseManagement.vue'), meta: { role: 'teacher', title: 'Course Management' } },
  { path: '/teacher/announcements', component: () => import('../views/teacher/AnnouncementsView.vue'), meta: { role: 'teacher', title: 'Announcements' } },
  { path: '/teacher/assignments', component: () => import('../views/teacher/AssignmentManagement.vue'), meta: { role: 'teacher', title: 'Assignment Management' } },
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
