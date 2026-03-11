<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useRemindersStore } from '../../stores/reminders.js'
import { useAnnouncementsStore } from '../../stores/announcements.js'
import { safeInt } from '../../utils/helpers.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppNavbar from '../../components/common/AppNavbar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard.vue'
import { BookOpen, Clock, Award, Building2, GraduationCap } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const enrollStore = useEnrollmentsStore()
const courseStore = useCoursesStore()
const remindersStore = useRemindersStore()
const announcementsStore = useAnnouncementsStore()

const userId = computed(() => auth.currentUser?.id ?? '')
const approved = computed(() => enrollStore.getApprovedForStudent(userId.value))
const pending = computed(() => enrollStore.getPendingForStudent(userId.value))
const approvedCourseIds = computed(() => approved.value.map(r => r.courseId))
const approvedCourses = computed(() => courseStore.getCoursesByIds(approvedCourseIds.value))
const reminders = computed(() => remindersStore.getForStudent(approvedCourseIds.value))
const announcements = computed(() => announcementsStore.getForStudent(approvedCourseIds.value))

const semesterCredits = computed(() => {
  const map = {}
  approved.value.forEach(r => {
    if (!map[r.semester]) map[r.semester] = { approved: 0, pending: 0 }
    map[r.semester].approved += safeInt(r.courseCredits)
  })
  pending.value.forEach(r => {
    if (!map[r.semester]) map[r.semester] = { approved: 0, pending: 0 }
    map[r.semester].pending += safeInt(r.courseCredits)
  })
  return map
})

const totalCredits = computed(() => {
  return approved.value.reduce((sum, r) => sum + safeInt(r.courseCredits), 0)
})

function viewCourse(course) {
  router.push(`/student/courses/${course.id}`)
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="student" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <div style="margin-bottom: 28px;">
          <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 6px 0; color: var(--text);">
            Welcome back, {{ auth.currentUser?.name?.split(' ')[0] }}!
          </h1>
          <p style="color: var(--text-muted); margin: 0; font-size: 14px;">
            {{ auth.currentUser?.departmentName }} • {{ auth.currentUser?.university }} • {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px;">
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #ECFDF5; display: flex; align-items: center; justify-content: center;">
                <BookOpen :size="24" color="#10B981" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ approved.length }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Enrolled Courses</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #FFFBEB; display: flex; align-items: center; justify-content: center;">
                <Clock :size="24" color="#F59E0B" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ pending.length }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Pending Requests</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #EFF6FF; display: flex; align-items: center; justify-content: center;">
                <Award :size="24" color="#3B82F6" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ totalCredits }}/19</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Total Credits</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--bg); display: flex; align-items: center; justify-content: center;">
                <Building2 :size="24" color="var(--text-muted)" />
              </div>
              <div>
                <div style="font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.2;">{{ auth.currentUser?.university }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">University</div>
              </div>
            </div>
          </AppCard>
        </div>
        
        <div v-if="Object.keys(semesterCredits).length > 0" style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: var(--text);">Credit Progress</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <AppCard v-for="(data, semester) in semesterCredits" :key="semester">
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: var(--text); margin-bottom: 4px; font-size: 15px;">{{ semester }}</div>
                <div style="font-size: 13px; color: var(--text-muted);">
                  {{ data.approved }} enrolled + {{ data.pending }} pending = {{ data.approved + data.pending }}/19 credits
                </div>
              </div>
              <div style="height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: #10B981; border-radius: 4px; transition: width 300ms;" :style="{ width: ((data.approved / 19) * 100) + '%' }"></div>
              </div>
            </AppCard>
          </div>
        </div>
        
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: var(--text);">My Courses</h2>
          <div v-if="approvedCourses.length > 0" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <EnrolledCourseCard
              v-for="course in approvedCourses"
              :key="course.id"
              :course="course"
              :enrollment="approved.find(r => r.courseId === course.id)"
              @view-course="viewCourse"
            />
          </div>
          <AppCard v-else>
            <div style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px; text-align: center;">
              <GraduationCap :size="48" style="color: var(--text-muted); margin-bottom: 12px;" />
              <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 6px 0; color: var(--text-body);">No enrolled courses yet</h3>
              <p style="color: var(--text-muted); margin: 0 0 16px 0; font-size: 13px;">Browse available courses and request enrollment.</p>
              <AppButton variant="primary" size="sm" @click="router.push('/student/courses')">Browse Courses</AppButton>
            </div>
          </AppCard>
        </div>
        
        <div v-if="announcements.length > 0 || reminders.length > 0">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: var(--text);">Announcements & Reminders</h2>
          
          <!-- Announcements Section -->
          <div v-if="announcements.length > 0" style="margin-bottom: 20px;">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Announcements</h3>
            <div style="display: grid; gap: 12px;">
              <AppCard v-for="announcement in announcements" :key="announcement.id" :style="{ borderLeft: announcement.pinned ? '4px solid var(--primary)' : '4px solid var(--success)' }">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                      <h4 style="font-size: 15px; font-weight: 600; margin: 0; color: var(--text);">{{ announcement.title }}</h4>
                      <span v-if="announcement.pinned" style="padding: 2px 6px; background: var(--primary-light); color: var(--primary); border-radius: 4px; font-size: 10px; font-weight: 600;">PINNED</span>
                    </div>
                    <p style="font-size: 14px; color: var(--text-muted); margin: 0 0 8px 0; line-height: 1.4;">{{ announcement.message }}</p>
                    <div style="font-size: 12px; color: var(--text-muted);">
                      {{ announcement.target === 'all' ? 'All Students' : `${announcement.courseCode} - ${announcement.courseName}` }} • {{ announcement.teacherName }} • {{ new Date(announcement.createdAt).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>
          </div>
          
          <!-- Reminders Section -->
          <div v-if="reminders.length > 0">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 12px 0; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Reminders</h3>
            <div style="display: grid; gap: 12px;">
              <AppCard v-for="reminder in reminders" :key="reminder.id" style="border-left: 4px solid;" :style="{ borderLeftColor: reminder.type === 'urgent' ? '#EF4444' : reminder.type === 'warning' ? '#F59E0B' : '#3B82F6' }">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 15px; color: var(--text);">{{ reminder.title }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">{{ reminder.message }}</div>
                <div style="font-size: 12px; color: var(--text-muted);">
                  {{ reminder.courseCode || 'All Courses' }} • {{ reminder.teacherName }}
                  <span v-if="reminder.expiresAt"> • Expires: {{ new Date(reminder.expiresAt).toLocaleDateString() }}</span>
                </div>
              </AppCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
