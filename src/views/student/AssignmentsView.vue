<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useAssignmentsStore } from '../../stores/assignments.js'
import { formatFileSize, formatDateTime } from '../../utils/helpers.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import { Download, FileText, Calendar, Filter, Search } from 'lucide-vue-next'

const auth = useAuthStore()
const enrollStore = useEnrollmentsStore()
const courseStore = useCoursesStore()
const assignmentsStore = useAssignmentsStore()

const selectedCourse = ref('')
const searchQuery = ref('')
const selectedType = ref('all')

const userId = computed(() => auth.currentUser?.id ?? '')
const approved = computed(() => enrollStore.getApprovedForStudent(userId.value))
const approvedCourseIds = computed(() => approved.value.map(r => r.courseId))
const approvedCourses = computed(() => courseStore.getCoursesByIds(approvedCourseIds.value))

const courseOptions = computed(() => [
  { value: '', label: 'All Courses' },
  ...approvedCourses.value.map(course => ({
    value: course.id,
    label: `${course.code} - ${course.name}`
  }))
])

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'quiz', label: 'Quizzes' }
]

const allAssignments = computed(() => {
  const assignments = []
  
  approvedCourseIds.value.forEach(courseId => {
    const courseAssignments = assignmentsStore.getByCourse(courseId)
    assignments.push(...courseAssignments.map(assignment => ({
      ...assignment,
      course: approvedCourses.value.find(c => c.id === courseId)
    })))
  })
  
  return assignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const filteredAssignments = computed(() => {
  let filtered = allAssignments.value

  // Filter by course
  if (selectedCourse.value) {
    filtered = filtered.filter(assignment => assignment.courseId === selectedCourse.value)
  }

  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(assignment => assignment.type === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(assignment => 
      assignment.title.toLowerCase().includes(query) ||
      assignment.description?.toLowerCase().includes(query) ||
      assignment.fileName.toLowerCase().includes(query) ||
      assignment.course?.name.toLowerCase().includes(query) ||
      assignment.course?.code.toLowerCase().includes(query)
    )
  }

  return filtered
})

const clearFilters = () => {
  selectedCourse.value = ''
  searchQuery.value = ''
  selectedType.value = 'all'
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
  return FileText
}

const getTypeColor = (type) => {
  return type === 'quiz' ? '#F59E0B' : '#3B82F6'
}

const getTypeLabel = (type) => {
  return type === 'quiz' ? 'QUIZ' : 'ASSIGNMENT'
}

onMounted(() => {
  enrollStore.initFromStorage()
  courseStore.initFromStorage()
  assignmentsStore.initFromStorage()
})
</script>

<template>
  <div style="display: flex; min-height: calc(100vh - 64px); margin-top: 64px;">
    <AppSidebar role="student" />
    
    <div style="flex: 1; display: flex; flex-direction: column; margin-left: 256px;">
      <main class="page-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: var(--text);">
            Assignments & Quizzes
          </h1>
        </div>

        <!-- Filters -->
        <AppCard style="margin-bottom: 24px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <div style="position: relative; flex: 1;">
                <Search :size="20" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search assignments..."
                  style="width: 100%; padding: 10px 14px 10px 44px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; background: var(--surface); color: var(--text);"
                />
              </div>
              <AppSelect v-model="selectedCourse" :options="courseOptions" style="width: 250px;" />
              <AppSelect v-model="selectedType" :options="typeOptions" style="width: 150px;" />
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="color: var(--text-muted); font-size: 14px;">
                {{ filteredAssignments.length }} {{ filteredAssignments.length === 1 ? 'item' : 'items' }} found
              </div>
              <AppButton variant="ghost" size="sm" @click="clearFilters">
                <Filter :size="16" />
                Clear Filters
              </AppButton>
            </div>
          </div>
        </AppCard>

        <!-- Assignments List -->
        <div v-if="filteredAssignments.length > 0">
          <div style="display: grid; gap: 16px;">
            <AppCard 
              v-for="assignment in filteredAssignments" 
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
                      {{ getTypeLabel(assignment.type) }}
                    </div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0; color: var(--text);">
                      {{ assignment.title }}
                    </h3>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="padding: 2px 8px; background: var(--bg); border-radius: 4px; font-size: 12px; font-weight: 500; color: var(--text-muted);">
                      {{ assignment.course?.code }}
                    </span>
                    <span style="font-size: 14px; color: var(--text-muted);">
                      {{ assignment.course?.name }}
                    </span>
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
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <Calendar :size="14" />
                      {{ formatDateTime(assignment.createdAt) }}
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-weight: 500;">{{ assignment.teacherName }}</span>
                    </div>
                  </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                  <AppButton 
                    variant="primary" 
                    size="sm"
                    @click="downloadFile(assignment)"
                  >
                    <Download :size="16" />
                    Download
                  </AppButton>
                </div>
              </div>
            </AppCard>
          </div>
        </div>

        <!-- Empty States -->
        <div v-else-if="allAssignments.length === 0" style="text-align: center; padding: 80px 20px;">
          <FileText :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
            No assignments yet
          </h3>
          <p style="color: var(--text-muted); margin: 0 0 24px 0;">
            Assignments and quizzes will appear here once your teachers upload them
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <AppCard style="text-align: left; max-width: 300px;">
              <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
                📚 Assignments
              </h4>
              <p style="font-size: 14px; color: var(--text-muted); margin: 0;">
                Homework, projects, and coursework from your teachers
              </p>
            </AppCard>
            <AppCard style="text-align: left; max-width: 300px;">
              <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
                📝 Quizzes
              </h4>
              <p style="font-size: 14px; color: var(--text-muted); margin: 0;">
                Tests and assessments for your courses
              </p>
            </AppCard>
          </div>
        </div>

        <div v-else style="text-align: center; padding: 60px 20px;">
          <Search :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--text);">
            No assignments match your filters
          </h3>
          <p style="color: var(--text-muted); margin: 0 0 24px 0;">
            Try adjusting your search or filters
          </p>
          <AppButton variant="primary" @click="clearFilters">
            Clear Filters
          </AppButton>
        </div>
      </main>
    </div>
  </div>
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
