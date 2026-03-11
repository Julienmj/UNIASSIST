<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'
import AppModal from '../../components/common/AppModal.vue'
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard.vue'
import EnrollmentRequestRow from '../../components/student/EnrollmentRequestRow.vue'
import { formatDate } from '../../utils/helpers.js'

const router = useRouter()
const auth = useAuthStore()
const enrollStore = useEnrollmentsStore()
const courseStore = useCoursesStore()
const toast = useToast()

const activeTab = ref('enrolled')
const showCancelModal = ref(false)
const selectedRequest = ref(null)

const userId = computed(() => auth.currentUser?.id ?? '')
const approved = computed(() => enrollStore.getApprovedForStudent(userId.value))
const pending = computed(() => enrollStore.getPendingForStudent(userId.value))
const rejected = computed(() => enrollStore.getRejectedForStudent(userId.value))

const approvedCourseIds = computed(() => approved.value.map(r => r.courseId))
const approvedCourses = computed(() => courseStore.getCoursesByIds(approvedCourseIds.value))

const semesterCredits = computed(() => {
  const map = {}
  approved.value.forEach(r => {
    if (!map[r.semester]) map[r.semester] = 0
    map[r.semester] += r.courseCredits ?? 0
  })
  return map
})

function openCancelModal(request) {
  selectedRequest.value = request
  showCancelModal.value = true
}

function confirmCancel() {
  if (selectedRequest.value) {
    enrollStore.cancelRequest(selectedRequest.value.id)
    toast.info('Enrollment request cancelled')
    showCancelModal.value = false
    selectedRequest.value = null
  }
}

function viewCourse(course) {
  router.push(`/student/courses/${course.id}`)
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="student" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 24px 0; color: var(--text);">My Enrollments</h1>
        
        <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--surface); padding: 6px; border-radius: var(--radius-md); border: 1px solid var(--border); width: fit-content;">
          <button
            :class="['tab-btn', { active: activeTab === 'enrolled' }]"
            @click="activeTab = 'enrolled'"
          >
            Enrolled ({{ approved.length }})
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'pending' }]"
            @click="activeTab = 'pending'"
          >
            Pending ({{ pending.length }})
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'history' }]"
            @click="activeTab = 'history'"
          >
            History ({{ rejected.length }})
          </button>
        </div>
        
        <div v-if="Object.keys(semesterCredits).length > 0" style="margin-bottom: 24px;">
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0; color: var(--text);">Credit Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <AppCard v-for="(credits, semester) in semesterCredits" :key="semester">
              <div style="font-weight: 600; margin-bottom: 4px; color: var(--text);">{{ semester }}</div>
              <div style="font-size: 24px; font-weight: 700; color: var(--primary);">{{ credits }}/19</div>
              <div style="font-size: 13px; color: var(--text-muted);">credits enrolled</div>
            </AppCard>
          </div>
        </div>
        
        <div v-if="activeTab === 'enrolled'">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: var(--text);">Enrolled Courses</h2>
          <div v-if="approvedCourses.length > 0">
            <div v-for="semester in [...new Set(approved.map(r => r.semester))]" :key="semester" style="margin-bottom: 32px;">
              <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 12px 0; color: var(--text-muted);">{{ semester }}</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
                <EnrolledCourseCard
                  v-for="course in approvedCourses.filter(c => c.semester === semester)"
                  :key="course.id"
                  :course="course"
                  :enrollment="approved.find(r => r.courseId === course.id)"
                  @view-course="viewCourse"
                />
              </div>
            </div>
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0; padding: 20px 0;">
              You have no enrolled courses yet.
            </p>
          </AppCard>
        </div>
        
        <div v-else-if="activeTab === 'pending'">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: var(--text);">Pending Requests</h2>
          <div v-if="pending.length > 0" style="display: grid; gap: 12px;">
            <EnrollmentRequestRow
              v-for="(req, idx) in pending"
              :key="req.id"
              :request="req"
              :queue-number="req.queueNumber"
              @cancel="openCancelModal"
            />
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0; padding: 20px 0;">
              No pending enrollment requests.
            </p>
          </AppCard>
        </div>
        
        <div v-else-if="activeTab === 'history'">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: var(--text);">Enrollment History</h2>
          <div v-if="rejected.length > 0" style="display: grid; gap: 12px;">
            <AppCard v-for="req in rejected" :key="req.id">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px; color: var(--text);">{{ req.courseCode }} - {{ req.courseName }}</div>
                  <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">
                    Requested: {{ formatDate(req.requestDate) }} • Responded: {{ formatDate(req.responseDate) }}
                  </div>
                  <AppBadge variant="danger" label="Rejected" />
                </div>
              </div>
              <div v-if="req.teacherNotes" style="margin-top: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius-sm);">
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Teacher's Note:</div>
                <div style="font-size: 14px; color: var(--text-muted);">{{ req.teacherNotes }}</div>
              </div>
            </AppCard>
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0; padding: 20px 0;">
              No enrollment history yet.
            </p>
          </AppCard>
        </div>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showCancelModal"
    title="Cancel Enrollment Request"
    confirm-text="Yes, Cancel"
    variant="danger"
    @confirm="confirmCancel"
    @cancel="showCancelModal = false"
  >
    <p style="margin: 0; color: var(--text-body);">Are you sure you want to cancel this enrollment request?</p>
    <div v-if="selectedRequest" style="margin-top: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius-sm);">
      <div style="font-weight: 600; color: var(--text);">{{ selectedRequest.courseCode }} - {{ selectedRequest.courseName }}</div>
    </div>
  </AppModal>
</template>

<style scoped>
.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--primary);
  color: white;
}
.tab-btn:hover:not(.active) {
  background: var(--bg);
}
</style>
