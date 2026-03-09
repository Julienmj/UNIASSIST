<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useAssignmentsStore } from '../../stores/assignments.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppNavbar from '../../components/common/AppNavbar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import { ArrowLeft, User, Clock, Calendar, MapPin, Download, Upload } from 'lucide-vue-next'
import { getDeptColor, formatDate, formatDateTime, formatFileSize } from '../../utils/helpers.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const assignStore = useAssignmentsStore()
const toast = useToast()

const courseId = computed(() => route.params.courseId)
const course = computed(() => courseStore.getCourseById(courseId.value))
const isAuthorized = computed(() => course.value?.teacherId === auth.currentUser?.id)

const activeTab = ref('overview')
const enrolledStudents = computed(() => enrollStore.getEnrolledForCourse(courseId.value))
const courseRequests = computed(() => enrollStore.getTeacherRequests([courseId.value]))
const assignments = computed(() => assignStore.getByCourse(courseId.value))

const editDesc = ref('')
watch(course, (c) => { if (c) editDesc.value = c.description }, { immediate: true })
function saveDesc() { courseStore.updateDescription(courseId.value, editDesc.value); toast.success('Description updated!') }

const showUploadForm = ref(false)
const uploadForm = ref({ title:'', description:'', dueDate:'' })
const uploadErrors = ref({})
const selectedFile = ref(null)
const fileData = ref('')
const fileLoading = ref(false)

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (evt) => { fileData.value = evt.target.result }
  reader.readAsDataURL(file)
}

async function submitUpload() {
  uploadErrors.value = {}
  if (!uploadForm.value.title) { uploadErrors.value.title = 'Title is required'; return }
  if (!uploadForm.value.dueDate) { uploadErrors.value.dueDate = 'Due date is required'; return }
  if (!selectedFile.value) { uploadErrors.value.file = 'Please select a file'; return }
  fileLoading.value = true
  await new Promise(r => setTimeout(r, 500))
  assignStore.addAssignment({
    courseId: courseId.value,
    courseCode: course.value?.code,
    courseName: course.value?.name,
    teacherId: auth.currentUser?.id,
    title: uploadForm.value.title,
    description: uploadForm.value.description,
    dueDate: uploadForm.value.dueDate,
    fileName: selectedFile.value.name,
    fileData: fileData.value,
    fileType: selectedFile.value.type,
    fileSize: selectedFile.value.size
  })
  toast.success('Assignment uploaded!')
  showUploadForm.value = false
  uploadForm.value = { title:'', description:'', dueDate:'' }
  selectedFile.value = null
  fileData.value = ''
  fileLoading.value = false
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

const showRemoveModal = ref(false)
const selectedStudent = ref(null)
function openRemoveModal(student) { selectedStudent.value = student; showRemoveModal.value = true }
function confirmRemove() {
  if (selectedStudent.value) {
    enrollStore.removeStudentFromCourse(selectedStudent.value.studentId, courseId.value)
    toast.info('Student removed from course')
    showRemoveModal.value = false
    selectedStudent.value = null
  }
}

const showReqModal = ref(false)
const modalAction = ref('approve')
const selectedReq = ref(null)
const reqNotes = ref('')
const reqLoading = ref(false)
function openApprove(req) { selectedReq.value=req; modalAction.value='approve'; reqNotes.value=''; showReqModal.value=true }
function openReject(req) { selectedReq.value=req; modalAction.value='reject'; reqNotes.value=''; showReqModal.value=true }
async function confirmReqAction() {
  reqLoading.value=true
  await new Promise(r=>setTimeout(r,400))
  if (modalAction.value==='approve') { enrollStore.approveRequest(selectedReq.value.id, reqNotes.value); toast.success('Approved!') }
  else { enrollStore.rejectRequest(selectedReq.value.id, reqNotes.value); toast.info('Rejected.') }
  reqLoading.value=false; showReqModal.value=false
}

function getInitials(name) {
  if (!name) return 'S'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
}
</script>

<template>
  <div style="display:flex; min-height:100vh;">
    <AppSidebar role="teacher" />
    <div style="flex:1; display:flex; flex-direction:column;">
      <AppNavbar role="teacher" />
      <main class="page-content">
        <button @click="router.push('/teacher/courses')" style="display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-muted); font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 24px;">
          <ArrowLeft :size="18" />
          Back to My Courses
        </button>
        
        <div v-if="!isAuthorized">
          <AppCard>
            <p style="text-align: center; color: var(--danger); margin: 0;">
              You are not authorized to manage this course.
            </p>
          </AppCard>
        </div>
        
        <template v-else-if="course">
          <AppCard style="margin-bottom: 24px;">
            <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
              <AppBadge :color="getDeptColor(course.department)" :label="course.code" />
              <AppBadge variant="neutral" :label="course.departmentName" />
              <AppBadge variant="info" :label="course.semester" />
            </div>
            
            <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 16px 0;">{{ course.name }}</h1>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
                <Calendar :size="18" />
                <span>{{ course.schedule.days.join(', ') }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
                <Clock :size="18" />
                <span>{{ course.schedule.startTime }} - {{ course.schedule.endTime }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; color: var(--text-muted);">
                <MapPin :size="18" />
                <span>{{ course.schedule.room }}</span>
              </div>
            </div>
          </AppCard>
          
          <div style="display: flex; gap: 8px; margin-bottom: 24px; background: white; padding: 6px; border-radius: var(--radius-md); border: 1px solid var(--border); width: fit-content;">
            <button :class="['tab-btn', { active: activeTab === 'overview' }]" @click="activeTab = 'overview'">
              Overview
            </button>
            <button :class="['tab-btn', { active: activeTab === 'students' }]" @click="activeTab = 'students'">
              Students ({{ enrolledStudents.length }})
            </button>
            <button :class="['tab-btn', { active: activeTab === 'requests' }]" @click="activeTab = 'requests'">
              Requests ({{ courseRequests.filter(r => r.status === 'pending').length }})
            </button>
            <button :class="['tab-btn', { active: activeTab === 'assignments' }]" @click="activeTab = 'assignments'">
              Assignments ({{ assignments.length }})
            </button>
          </div>
          
          <div v-if="activeTab === 'overview'">
            <AppCard>
              <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Course Description</h2>
              <textarea
                v-model="editDesc"
                rows="5"
                style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit; margin-bottom: 12px;"
              ></textarea>
              <AppButton @click="saveDesc">Save Description</AppButton>
            </AppCard>
          </div>
          
          <div v-else-if="activeTab === 'students'">
            <div v-if="enrolledStudents.length > 0" style="display: grid; gap: 12px;">
              <AppCard v-for="student in enrolledStudents" :key="student.id">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
                      {{ getInitials(student.studentName) }}
                    </div>
                    <div>
                      <div style="font-weight: 600;">{{ student.studentName }}</div>
                      <div style="font-size: 14px; color: var(--text-muted);">{{ student.studentEmail }}</div>
                      <div style="font-size: 13px; color: var(--text-muted);">Enrolled: {{ formatDate(student.responseDate) }}</div>
                    </div>
                  </div>
                  <AppButton variant="danger" size="sm" @click="openRemoveModal(student)">
                    Remove
                  </AppButton>
                </div>
              </AppCard>
            </div>
            <AppCard v-else>
              <p style="text-align: center; color: var(--text-muted); margin: 0;">No enrolled students yet</p>
            </AppCard>
          </div>
          
          <div v-else-if="activeTab === 'requests'">
            <div v-if="courseRequests.length > 0" style="display: grid; gap: 12px;">
              <AppCard v-for="req in courseRequests" :key="req.id">
                <div style="display: flex; align-items: start; gap: 16px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;">
                    {{ getInitials(req.studentName) }}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">{{ req.studentName }}</div>
                    <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">{{ req.studentEmail }}</div>
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                      Requested: {{ formatDateTime(req.requestDate) }}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <AppBadge
                        :variant="req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'danger'"
                        :label="req.status.charAt(0).toUpperCase() + req.status.slice(1)"
                      />
                      <template v-if="req.status === 'pending'">
                        <AppButton variant="success" size="sm" @click="openApprove(req)">Approve</AppButton>
                        <AppButton variant="danger" size="sm" @click="openReject(req)">Reject</AppButton>
                      </template>
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>
            <AppCard v-else>
              <p style="text-align: center; color: var(--text-muted); margin: 0;">No enrollment requests</p>
            </AppCard>
          </div>
          
          <div v-else-if="activeTab === 'assignments'">
            <div style="margin-bottom: 16px;">
              <AppButton variant="primary" @click="showUploadForm = !showUploadForm">
                <Upload :size="16" />
                {{ showUploadForm ? 'Cancel' : 'Upload Assignment' }}
              </AppButton>
            </div>
            
            <AppCard v-if="showUploadForm" style="margin-bottom: 16px;">
              <div style="display: grid; gap: 16px;">
                <AppInput v-model="uploadForm.title" label="Assignment Title" :error="uploadErrors.title" required />
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Description</label>
                  <textarea
                    v-model="uploadForm.description"
                    rows="3"
                    style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit;"
                  ></textarea>
                </div>
                <AppInput v-model="uploadForm.dueDate" type="date" label="Due Date" :error="uploadErrors.dueDate" required />
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">File</label>
                  <input type="file" @change="handleFileSelect" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-sm);" />
                  <p v-if="uploadErrors.file" style="font-size: 13px; color: var(--danger); margin: 4px 0 0 0;">{{ uploadErrors.file }}</p>
                  <p v-if="selectedFile" style="font-size: 13px; color: var(--text-muted); margin: 4px 0 0 0;">
                    Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                  </p>
                </div>
                <AppButton :loading="fileLoading" @click="submitUpload">Upload Assignment</AppButton>
              </div>
            </AppCard>
            
            <div v-if="assignments.length > 0" style="display: grid; gap: 12px;">
              <AppCard v-for="a in assignments" :key="a.id">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">{{ a.title }}</h3>
                    <p style="font-size: 14px; color: var(--text-muted); margin: 0 0 8px 0;">{{ a.description }}</p>
                    <div style="font-size: 13px; color: var(--text-muted);">
                      Due: {{ formatDate(a.dueDate) }} • {{ a.fileName }} ({{ formatFileSize(a.fileSize) }})
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <AppButton variant="secondary" size="sm" @click="downloadAssignment(a)">
                      <Download :size="16" />
                    </AppButton>
                    <AppButton variant="danger" size="sm" @click="assignStore.deleteAssignment(a.id); toast.info('Assignment deleted')">
                      Delete
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            </div>
            <AppCard v-else-if="!showUploadForm">
              <p style="text-align: center; color: var(--text-muted); margin: 0;">No assignments uploaded yet</p>
            </AppCard>
          </div>
        </template>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showRemoveModal"
    title="Remove Student"
    confirm-text="Remove"
    variant="danger"
    @confirm="confirmRemove"
    @cancel="showRemoveModal = false"
  >
    <p style="margin: 0;">Are you sure you want to remove this student from the course?</p>
    <div v-if="selectedStudent" style="margin-top: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius-sm);">
      <div style="font-weight: 600;">{{ selectedStudent.studentName }}</div>
      <div style="font-size: 14px; color: var(--text-muted);">{{ selectedStudent.studentEmail }}</div>
    </div>
  </AppModal>
  
  <AppModal
    :show="showReqModal"
    :title="modalAction === 'approve' ? 'Approve Enrollment' : 'Reject Enrollment'"
    :confirm-text="modalAction === 'approve' ? 'Approve' : 'Reject'"
    :variant="modalAction === 'approve' ? 'success' : 'danger'"
    :loading="reqLoading"
    @confirm="confirmReqAction"
    @cancel="showReqModal = false"
  >
    <div v-if="selectedReq">
      <p style="margin: 0 0 12px 0;">
        {{ modalAction === 'approve' ? 'Approve' : 'Reject' }} enrollment for:
      </p>
      <div style="padding: 12px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 16px;">
        <div style="font-weight: 600;">{{ selectedReq.studentName }}</div>
        <div style="font-size: 14px; color: var(--text-muted);">{{ selectedReq.studentEmail }}</div>
      </div>
      <div>
        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Notes (Optional)</label>
        <textarea
          v-model="reqNotes"
          rows="3"
          placeholder="Add a note for the student..."
          style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit;"
        ></textarea>
      </div>
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
