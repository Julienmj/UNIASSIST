<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useRemindersStore } from '../../stores/reminders.js'
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

const userId = computed(() => auth.currentUser?.id ?? '')
const approved = computed(() => enrollStore.getApprovedForStudent(userId.value))
const pending = computed(() => enrollStore.getPendingForStudent(userId.value))
const approvedCourseIds = computed(() => approved.value.map(r => r.courseId))
const approvedCourses = computed(() => courseStore.getCoursesByIds(approvedCourseIds.value))
const reminders = computed(() => remindersStore.getForStudent(approvedCourseIds.value))

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
          <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 6px 0; color: #0F172A;">
            Welcome back, {{ auth.currentUser?.name?.split(' ')[0] }}!
          </h1>
          <p style="color: #6B7280; margin: 0; font-size: 14px;">
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
                <div style="font-size: 32px; font-weight: 700; color: #0F172A; line-height: 1;">{{ approved.length }}</div>
                <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">Enrolled Courses</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #FFFBEB; display: flex; align-items: center; justify-content: center;">
                <Clock :size="24" color="#F59E0B" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: #0F172A; line-height: 1;">{{ pending.length }}</div>
                <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">Pending Requests</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #EFF6FF; display: flex; align-items: center; justify-content: center;">
                <Award :size="24" color="#3B82F6" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: #0F172A; line-height: 1;">{{ totalCredits }}/19</div>
                <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">Total Credits</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #F8FAFC; display: flex; align-items: center; justify-content: center;">
                <Building2 :size="24" color="#6B7280" />
              </div>
              <div>
                <div style="font-size: 16px; font-weight: 700; color: #0F172A; line-height: 1.2;">{{ auth.currentUser?.university }}</div>
                <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">University</div>
              </div>
            </div>
          </AppCard>
        </div>
        
        <div v-if="Object.keys(semesterCredits).length > 0" style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #0F172A;">Credit Progress</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <AppCard v-for="(data, semester) in semesterCredits" :key="semester">
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; color: #0F172A; margin-bottom: 4px; font-size: 15px;">{{ semester }}</div>
                <div style="font-size: 13px; color: #6B7280;">
                  {{ data.approved }} enrolled + {{ data.pending }} pending = {{ data.approved + data.pending }}/19 credits
                </div>
              </div>
              <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: #10B981; border-radius: 4px; transition: width 300ms;" :style="{ width: ((data.approved / 19) * 100) + '%' }"></div>
              </div>
            </AppCard>
          </div>
        </div>
        
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #0F172A;">My Courses</h2>
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
              <GraduationCap :size="48" style="color: #CBD5E1; margin-bottom: 12px;" />
              <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 6px 0; color: #374151;">No enrolled courses yet</h3>
              <p style="color: #9CA3AF; margin: 0 0 16px 0; font-size: 13px;">Browse available courses and request enrollment.</p>
              <AppButton variant="primary" size="sm" @click="router.push('/student/courses')">Browse Courses</AppButton>
            </div>
          </AppCard>
        </div>
        
        <div v-if="reminders.length > 0">
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #0F172A;">Reminders & Announcements</h2>
          <div style="display: grid; gap: 12px;">
            <AppCard v-for="reminder in reminders" :key="reminder.id" style="border-left: 4px solid;" :style="{ borderLeftColor: reminder.type === 'urgent' ? '#EF4444' : reminder.type === 'warning' ? '#F59E0B' : '#3B82F6' }">
              <div style="font-weight: 600; margin-bottom: 4px; font-size: 15px; color: #0F172A;">{{ reminder.title }}</div>
              <div style="font-size: 13px; color: #6B7280; margin-bottom: 8px;">{{ reminder.message }}</div>
              <div style="font-size: 12px; color: #9CA3AF;">
                {{ reminder.courseCode }} • {{ reminder.teacherName }}
              </div>
            </AppCard>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
