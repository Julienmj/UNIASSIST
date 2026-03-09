<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useAssignmentsStore } from '../../stores/assignments.js'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import { ArrowLeft, User, Clock, Calendar, MapPin, Download } from 'lucide-vue-next'
import { getDeptColor, formatDate, formatFileSize, calculateEndTime } from '../../utils/helpers.js'

const route = useRoute()
const router = useRouter()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const assignStore = useAssignmentsStore()
const auth = useAuthStore()
const toast = useToast()

const showEnrollModal = ref(false)
const enrollLoading = ref(false)

const course = computed(() => courseStore.getCourseById(route.params.courseId))
const userId = computed(() => auth.currentUser?.id ?? '')
const status = computed(() => enrollStore.getEnrollmentStatus(userId.value, course.value?.id))
const isEnrolled = computed(() => status.value === 'approved')
const assignments = computed(() => isEnrolled.value ? assignStore.getByCourse(course.value?.id) : [])
const committed = computed(() => course.value ? enrollStore.getCommittedCredits(userId.value, course.value.semester) : 0)

async function handleEnroll() {
  showEnrollModal.value = true
}

async function confirmEnroll() {
  if (!course.value) return
  enrollLoading.value = true
  try {
    enrollStore.submitRequest(auth.currentUser, course.value)
    toast.success(`Enrollment request submitted!`)
    showEnrollModal.value = false
  } catch(e) {
    toast.error(e.message)
  } finally {
    enrollLoading.value = false
  }
}

function downloadAssignment(a) {
  const link = document.createElement('a')
  link.href = a.fileData
  link.download = a.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('Download started')
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="student" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <button @click="router.back()" style="display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-muted); font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 24px;">
          <ArrowLeft :size="18" />
          Back
        </button>
        
        <AppCard v-if="course" style="margin-bottom: 24px;">
          <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
            <AppBadge :color="getDeptColor(course.department)" :label="course.code" />
            <AppBadge variant="neutral" :label="course.departmentName" />
            <AppBadge variant="info" :label="course.semester" />
            <AppBadge variant="neutral" :label="`${course.credits} Credits`" />
          </div>
          
          <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 16px 0;">{{ course.name }}</h1>
          
          <div style="display: grid; gap: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
              <User :size="18" />
              <span>{{ course.teacher }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
              <Calendar :size="18" />
              <span>{{ course.schedule.days.join(', ') }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
              <Clock :size="18" />
              <span>{{ course.schedule.startTime }} - {{ course.schedule.endTime || calculateEndTime(course.schedule.startTime, course.credits) }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
              <MapPin :size="18" />
              <span>{{ course.schedule.room }}</span>
            </div>
          </div>
          
          <div v-if="!status" style="margin-top: 20px;">
            <AppButton variant="primary" @click="handleEnroll">
              Enroll in This Course
            </AppButton>
            <p style="font-size: 13px; color: var(--text-muted); margin: 8px 0 0 0;">
              Current credits for {{ course.semester }}: {{ committed }}/19
            </p>
          </div>
          <div v-else-if="status === 'pending'" style="margin-top: 20px;">
            <AppBadge variant="warning" label="⏳ Enrollment Pending" />
          </div>
          <div v-else-if="status === 'approved'" style="margin-top: 20px;">
            <AppBadge variant="success" label="✓ You are enrolled in this course" />
          </div>
          <div v-else-if="status === 'rejected'" style="margin-top: 20px;">
            <AppBadge variant="danger" label="✗ Enrollment Rejected" />
            <AppButton variant="primary" size="sm" style="margin-top: 12px;" @click="handleEnroll">
              Request Again
            </AppButton>
          </div>
        </AppCard>
        
        <AppCard v-if="course" style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">Course Description</h2>
          <p style="color: var(--text-muted); margin: 0; line-height: 1.6;">{{ course.description }}</p>
        </AppCard>
        
        <div v-if="isEnrolled">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Assignments</h2>
          <div v-if="assignments.length > 0" style="display: grid; gap: 12px;">
            <AppCard v-for="a in assignments" :key="a.id">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div style="flex: 1;">
                  <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">{{ a.title }}</h3>
                  <p style="font-size: 14px; color: var(--text-muted); margin: 0 0 8px 0;">{{ a.description }}</p>
                  <div style="font-size: 13px; color: var(--text-muted);">
                    Due: {{ formatDate(a.dueDate) }} • {{ a.fileName }} ({{ formatFileSize(a.fileSize) }})
                  </div>
                </div>
                <AppButton variant="secondary" size="sm" @click="downloadAssignment(a)">
                  <Download :size="16" />
                  Download
                </AppButton>
              </div>
            </AppCard>
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0;">No assignments yet</p>
          </AppCard>
        </div>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showEnrollModal"
    title="Confirm Enrollment"
    confirm-text="Submit Request"
    :loading="enrollLoading"
    @confirm="confirmEnroll"
    @cancel="showEnrollModal = false"
  >
    <div v-if="course">
      <p style="margin: 0 0 12px 0;">You are about to request enrollment in:</p>
      <div style="padding: 16px; background: var(--bg); border-radius: var(--radius-sm);">
        <div style="font-weight: 600; margin-bottom: 4px;">{{ course.code }} - {{ course.name }}</div>
        <div style="font-size: 14px; color: var(--text-muted);">{{ course.teacher }}</div>
        <div style="font-size: 14px; color: var(--text-muted); margin-top: 8px;">
          Credits: {{ course.credits }} • {{ course.semester }}
        </div>
      </div>
    </div>
  </AppModal>
</template>
