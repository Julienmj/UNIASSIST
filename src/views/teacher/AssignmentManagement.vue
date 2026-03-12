<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useAssignmentsStore } from '../../stores/assignments.js'
import { useToast } from '../../composables/useToast.js'
import { formatFileSize, formatDateTime } from '../../utils/helpers.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import AppModal from '../../components/common/AppModal.vue'
import { Upload, FileText, Download, Trash2, Eye, Plus } from 'lucide-vue-next'

const auth = useAuthStore()
const courseStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()
const toast = useToast()

const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const deletingAssignment = ref(null)
const selectedCourse = ref('')
const uploadingFile = ref(false)
const fileInput = ref(null)

const assignmentForm = ref({
  title: '',
  description: '',
  type: 'assignment' // assignment or quiz
})

const teacherCourses = computed(() => 
  courseStore.getCoursesByTeacher(auth.currentUser.id)
)

const courseOptions = computed(() => 
  teacherCourses.value.map(course => ({
    value: course.id,
    label: `${course.code} - ${course.name}`
  }))
)

const assignments = computed(() => {
  if (!selectedCourse.value) return []
  return assignmentsStore.getByCourse(selectedCourse.value)
})

const typeOptions = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'quiz', label: 'Quiz' }
]

const resetForm = () => {
  assignmentForm.value = {
    title: '',
    description: '',
    type: 'assignment'
  }
  selectedCourse.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  showUploadModal.value = false
  resetForm()
}

const openUploadModal = (courseId = null) => {
  if (courseId) {
    selectedCourse.value = courseId
  }
  showUploadModal.value = true
}

const confirmDelete = (assignment) => {
  deletingAssignment.value = assignment
  showDeleteModal.value = true
}

const deleteAssignment = () => {
  try {
    assignmentsStore.deleteAssignment(deletingAssignment.value.id)
    toast.success('Assignment deleted successfully!')
    showDeleteModal.value = false
    deletingAssignment.value = null
  } catch (error) {
    toast.error('Failed to delete assignment')
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB')
    return
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png'
  ]

  if (!allowedTypes.includes(file.type)) {
    toast.error('File type not supported. Please upload PDF, Word, Excel, PowerPoint, text files, or images.')
    return
  }

  uploadingFile.value = true

  try {
    // Convert file to base64
    const base64 = await fileToBase64(file)
    
    // Create assignment object
    const assignmentData = {
      courseId: selectedCourse.value,
      title: assignmentForm.value.title || file.name.replace(/\.[^/.]+$/, ''),
      description: assignmentForm.value.description,
      type: assignmentForm.value.type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      base64Data: base64,
      teacherId: auth.currentUser.id,
      teacherName: auth.currentUser.name
    }

    assignmentsStore.addAssignment(assignmentData)
    toast.success(`${assignmentForm.value.type === 'quiz' ? 'Quiz' : 'Assignment'} uploaded successfully!`)
    closeModal()
  } catch (error) {
    toast.error('Failed to upload file')
  } finally {
    uploadingFile.value = false
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const downloadFile = (assignment) => {
  // Create download link
  const link = document.createElement('a')
  link.href = assignment.base64Data
  link.download = assignment.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getTypeIcon = (type) => {
  return type === 'quiz' ? FileText : FileText
}

const getTypeColor = (type) => {
  return type === 'quiz' ? '#F59E0B' : '#3B82F6'
}

onMounted(() => {
  courseStore.initFromStorage()
  assignmentsStore.initFromStorage()
})
</script>

<template>
  <div style="display: flex; min-height: calc(100vh - 64px); margin-top: 64px;">
    <AppSidebar role="teacher" />
    
    <div style="flex: 1; display: flex; flex-direction: column; margin-left: 256px;">
      <main class="page-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: var(--text);">
            Assignment Management
          </h1>
        </div>

        <!-- Course Selection -->
        <AppCard style="margin-bottom: 24px;">
          <div style="display: flex; gap: 16px; align-items: end;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--text);">
                Select Course
              </label>
              <AppSelect 
                v-model="selectedCourse" 
                :options="courseOptions" 
                placeholder="Choose a course to manage assignments"
              />
            </div>
            <AppButton 
              variant="primary" 
              :disabled="!selectedCourse"
              @click="openUploadModal()"
            >
              <Plus :size="16" />
              Upload Assignment
            </AppButton>
          </div>
        </AppCard>

        <!-- Assignments List -->
        <div v-if="selectedCourse && assignments.length > 0">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0; color: var(--text);">
            Assignments & Quizzes
          </h2>
          
          <div style="display: grid; gap: 16px;">
            <AppCard 
              v-for="assignment in assignments" 
              :key="assignment.id"
              class="assignment-card"
            >
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <div 
                      style="display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;"
                      :style="{ backgroundColor: getTypeColor(assignment.type) + '20', color: getTypeColor(assignment.type) }"
                    >
                      <component :is="getTypeIcon(assignment.type)" :size="14" />
                      {{ assignment.type === 'quiz' ? 'QUIZ' : 'ASSIGNMENT' }}
                    </div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text);">
                      {{ assignment.title }}
                    </h3>
                  </div>
                  
                  <p v-if="assignment.description" style="color: var(--text-muted); margin: 0 0 12px 0; line-height: 1.5;">
                    {{ assignment.description }}
                  </p>
                  
                  <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: var(--text-muted);">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <FileText :size="14" />
                      {{ assignment.fileName }}
                    </div>
                    <div>{{ formatFileSize(assignment.fileSize) }}</div>
                    <div>{{ formatDateTime(assignment.createdAt) }}</div>
                  </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                  <AppButton 
                    variant="ghost" 
                    size="sm"
                    @click="downloadFile(assignment)"
                    title="Download"
                  >
                    <Download :size="16" />
                  </AppButton>
                  <AppButton 
                    variant="danger" 
                    size="sm"
                    @click="confirmDelete(assignment)"
                    title="Delete"
                  >
                    <Trash2 :size="16" />
                  </AppButton>
                </div>
              </div>
            </AppCard>
          </div>
        </div>

        <!-- Empty States -->
        <div v-else-if="selectedCourse" style="text-align: center; padding: 60px 20px;">
          <Upload :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
            No assignments yet
          </h3>
          <p style="color: var(--text-muted); margin: 0 0 24px 0;">
            Upload your first assignment or quiz for this course
          </p>
          <AppButton variant="primary" @click="openUploadModal()">
            <Plus :size="16" />
            Upload Assignment
          </AppButton>
        </div>

        <div v-else style="text-align: center; padding: 60px 20px;">
          <FileText :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
            Select a course
          </h3>
          <p style="color: var(--text-muted); margin: 0;">
            Choose a course to manage assignments and quizzes
          </p>
        </div>
      </main>
    </div>
  </div>

  <!-- Upload Modal -->
  <AppModal
    :show="showUploadModal"
    :title="assignmentForm.type === 'quiz' ? 'Upload Quiz' : 'Upload Assignment'"
    confirm-text="Upload"
    :loading="uploadingFile"
    @confirm="fileInput?.click()"
    @cancel="closeModal"
  >
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--text);">
          Type
        </label>
        <AppSelect v-model="assignmentForm.type" :options="typeOptions" />
      </div>
      
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--text);">
          Title (optional)
        </label>
        <AppInput 
          v-model="assignmentForm.title" 
          placeholder="Assignment title will be derived from filename if not provided"
        />
      </div>
      
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--text);">
          Description (optional)
        </label>
        <textarea
          v-model="assignmentForm.description"
          style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; resize: vertical; font-family: inherit;"
          placeholder="Add instructions or details about this assignment/quiz"
        ></textarea>
      </div>
      
      <div>
        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--text);">
          Select File
        </label>
        <div 
          style="border: 2px dashed var(--border); border-radius: 8px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s;"
          @click="fileInput?.click()"
          @mouseover="$event.target.style.borderColor = 'var(--primary)'"
          @mouseout="$event.target.style.borderColor = 'var(--border)'"
        >
          <Upload :size="32" style="color: var(--text-muted); margin-bottom: 8px;" />
          <p style="margin: 0; color: var(--text); font-weight: 500;">
            Click to choose file
          </p>
          <p style="margin: 8px 0 0 0; color: var(--text-muted); font-size: 14px;">
            PDF, Word, Excel, PowerPoint, text files, or images (max 10MB)
          </p>
        </div>
        <input
          ref="fileInput"
          type="file"
          style="display: none"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  </AppModal>

  <!-- Delete Confirmation Modal -->
  <AppModal
    :show="showDeleteModal"
    title="Delete Assignment"
    variant="danger"
    confirm-text="Delete"
    @confirm="deleteAssignment"
    @cancel="showDeleteModal = false"
  >
    <p style="margin: 0;">
      Are you sure you want to delete "{{ deletingAssignment?.title }}"? This action cannot be undone.
    </p>
  </AppModal>
</template>

<style scoped>
.page-content {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.assignment-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.assignment-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
</style>
