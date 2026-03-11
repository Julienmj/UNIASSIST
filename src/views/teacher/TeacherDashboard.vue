<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useRemindersStore } from '../../stores/reminders.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppNavbar from '../../components/common/AppNavbar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import EnrollmentQueueRow from '../../components/teacher/EnrollmentQueueRow.vue'
import { BookOpen, Users, Clock, AlertCircle, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const remindersStore = useRemindersStore()
const toast = useToast()

const teacherId = computed(() => auth.currentUser?.id ?? '')
const myCourses = computed(() => courseStore.getCoursesByTeacher(teacherId.value))
const myCourseIds = computed(() => myCourses.value.map(c => c.id))
const allRequests = computed(() => enrollStore.getTeacherRequests(myCourseIds.value))
const pendingRequests = computed(() => allRequests.value.filter(r => r.status === 'pending'))
const myReminders = computed(() => remindersStore.getByTeacher(teacherId.value))

const enrolledCountByCourse = computed(() => {
  const map = {}
  myCourseIds.value.forEach(id => {
    map[id] = enrollStore.getEnrolledForCourse(id).length
  })
  return map
})
const totalStudents = computed(() => Object.values(enrolledCountByCourse.value).reduce((a,b)=>a+b,0))

const showModal = ref(false)
const modalAction = ref('approve')
const selectedRequest = ref(null)
const modalNotes = ref('')
const modalLoading = ref(false)

function openApprove(req) { selectedRequest.value=req; modalAction.value='approve'; modalNotes.value=''; showModal.value=true }
function openReject(req) { selectedRequest.value=req; modalAction.value='reject'; modalNotes.value=''; showModal.value=true }
async function confirmAction() {
  if (!selectedRequest.value) return
  modalLoading.value = true
  await new Promise(r => setTimeout(r, 400))
  if (modalAction.value === 'approve') {
    enrollStore.approveRequest(selectedRequest.value.id, modalNotes.value)
    toast.success(`Enrollment approved for ${selectedRequest.value.studentName}`)
  } else {
    enrollStore.rejectRequest(selectedRequest.value.id, modalNotes.value)
    toast.info(`Enrollment rejected for ${selectedRequest.value.studentName}`)
  }
  modalLoading.value = false
  showModal.value = false
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="teacher" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <div style="margin-bottom: 28px;">
          <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 6px 0; color: var(--text);">
            Welcome, {{ auth.currentUser?.name?.split(' ')[0] }}!
          </h1>
          <p style="color: var(--text-muted); margin: 0; font-size: 14px;">
            {{ auth.currentUser?.departmentName }} • {{ auth.currentUser?.employeeId }}
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px;">
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #EFF6FF; display: flex; align-items: center; justify-content: center;">
                <BookOpen :size="24" color="#3B82F6" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ myCourses.length }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">My Courses</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #ECFDF5; display: flex; align-items: center; justify-content: center;">
                <Users :size="24" color="#10B981" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ totalStudents }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Total Students</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #FFFBEB; display: flex; align-items: center; justify-content: center;">
                <Clock :size="24" color="#F59E0B" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ allRequests.filter(r => r.status === 'pending').length }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Pending Requests</div>
              </div>
            </div>
          </AppCard>
          
          <AppCard>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--bg); display: flex; align-items: center; justify-content: center;">
                <AlertCircle :size="24" color="var(--text-muted)" />
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700; color: var(--text); line-height: 1;">{{ myReminders.length }}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Active Reminders</div>
              </div>
            </div>
          </AppCard>
        </div>
        
        <AppCard>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 18px; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 8px; color: var(--text);">
              <Clock :size="20" color="#F59E0B" />
              Enrollment Queue
            </h2>
            <AppButton variant="secondary" size="sm" @click="router.push('/teacher/requests')">
              View All →
            </AppButton>
          </div>
          <div v-if="pendingRequests.length > 0" style="display: grid; gap: 12px;">
            <EnrollmentQueueRow
              v-for="(req, idx) in pendingRequests"
              :key="req.id"
              :request="req"
              :index="idx"
              @approve="openApprove"
              @reject="openReject"
            />
          </div>
          <div v-else style="text-align: center; padding: 40px 20px;">
            <CheckCircle :size="48" style="color: #10B981; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;" />
            <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-body); font-size: 16px;">No pending requests</div>
            <div style="font-size: 13px; color: var(--text-muted);">Student enrollment requests will appear here.</div>
          </div>
        </AppCard>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showModal"
    :title="modalAction === 'approve' ? 'Approve Enrollment' : 'Reject Enrollment'"
    :confirm-text="modalAction === 'approve' ? 'Approve' : 'Reject'"
    :variant="modalAction === 'approve' ? 'success' : 'danger'"
    :loading="modalLoading"
    @confirm="confirmAction"
    @cancel="showModal = false"
  >
    <div v-if="selectedRequest">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: var(--text-body);">
        {{ modalAction === 'approve' ? 'Approve' : 'Reject' }} enrollment for:
      </p>
      <div style="padding: 12px; background: var(--bg); border-radius: 8px; margin-bottom: 16px;">
        <div style="font-weight: 600; color: var(--text);">{{ selectedRequest.studentName }}</div>
        <div style="font-size: 13px; color: var(--text-muted);">{{ selectedRequest.studentEmail }}</div>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
          {{ selectedRequest.courseCode }} - {{ selectedRequest.courseName }}
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--text-body);">Notes (Optional)</label>
        <textarea
          v-model="modalNotes"
          rows="3"
          placeholder="Add a note for the student..."
          style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; font-family: inherit; background: var(--surface); color: var(--text);"
        ></textarea>
      </div>
    </div>
  </AppModal>
</template>
