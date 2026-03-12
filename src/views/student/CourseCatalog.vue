<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import CourseCard from '../../components/student/CourseCard.vue'
import { Search, X, BookOpen } from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const auth = useAuthStore()
const toast = useToast()

const searchQuery = ref('')
const filterSemester = ref('')
const filterDept = ref('')
const filterCredits = ref('')

const showEnrollModal = ref(false)
const selectedCourse = ref(null)
const enrollLoading = ref(false)

const userId = computed(() => auth.currentUser?.id ?? '')

const allCourses = computed(() => courseStore.courses ?? [])
const coursesWithTeacher = computed(() => allCourses.value.filter(c => c.teacherId && c.teacherId !== ''))

const filteredCourses = computed(() => {
  let list = coursesWithTeacher.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
  }
  if (filterSemester.value) list = list.filter(c => c.semester === filterSemester.value)
  if (filterDept.value) list = list.filter(c => c.department === filterDept.value)
  if (filterCredits.value) list = list.filter(c => c.credits === parseInt(filterCredits.value))
  return list
})

const semesterOptions = [
  { value: 'Fall 2024', label: 'Fall 2024' },
  { value: 'Spring 2025', label: 'Spring 2025' }
]

const deptOptions = [
  { value: 'SE', label: 'Software Engineering' },
  { value: 'NC', label: 'Networks & Cybersecurity' },
  { value: 'IM', label: 'Information Management' }
]

const creditOptions = [
  { value: '3', label: '3 Credits' },
  { value: '4', label: '4 Credits' }
]

function clearFilters() {
  searchQuery.value = ''
  filterSemester.value = ''
  filterDept.value = ''
  filterCredits.value = ''
}

function openEnrollModal(course) {
  selectedCourse.value = course
  showEnrollModal.value = true
}

async function confirmEnroll() {
  if (!selectedCourse.value) return
  enrollLoading.value = true
  try {
    enrollStore.submitRequest(auth.currentUser, selectedCourse.value, courseStore)
    toast.success(`Enrollment request submitted for ${selectedCourse.value.name}!`)
    showEnrollModal.value = false
  } catch(e) {
    toast.error(e.message)
  } finally {
    enrollLoading.value = false
  }
}

function cancelRequest(course) {
  const req = enrollStore.getStudentRequests(userId.value).find(r => r.courseId === course.id && r.status === 'pending')
  if (req) {
    enrollStore.cancelRequest(req.id)
    toast.info('Enrollment request cancelled')
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
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 24px 0; color: var(--text);">Course Catalog</h1>
        
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
          <div style="position: relative; margin-bottom: 16px;">
            <Search :size="20" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search courses by code or name..."
              style="width: 100%; padding: 10px 14px 10px 44px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; background: var(--surface); color: var(--text);"
            />
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
            <AppSelect v-model="filterSemester" :options="semesterOptions" placeholder="All Semesters" />
            <AppSelect v-model="filterDept" :options="deptOptions" placeholder="All Departments" />
            <AppSelect v-model="filterCredits" :options="creditOptions" placeholder="All Credits" />
          </div>
          
          <AppButton variant="ghost" size="sm" @click="clearFilters">
            <X :size="16" />
            Clear Filters
          </AppButton>
        </div>
        
        <div style="margin-bottom: 16px; color: var(--text-muted);">
          {{ filteredCourses.length }} course{{ filteredCourses.length !== 1 ? 's' : '' }} found
        </div>
        
        <div v-if="filteredCourses.length === 0 && coursesWithTeacher.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center;">
          <BookOpen :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: var(--text);">No courses available yet</h3>
          <p style="color: var(--text-muted); margin: 0; max-width: 400px;">Courses will appear here once teachers add them.</p>
        </div>
        
        <div v-else-if="filteredCourses.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center;">
          <BookOpen :size="64" style="color: var(--text-muted); margin-bottom: 16px;" />
          <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: var(--text);">No courses match your filters</h3>
          <p style="color: var(--text-muted); margin: 0; max-width: 400px;">Try adjusting your search or filters.</p>
        </div>
        
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.id"
            :course="course"
            :enrollment-status="enrollStore.getEnrollmentStatus(userId, course.id)"
            :committed-credits="enrollStore.getCommittedCredits(userId, course.semester)"
            :user-id="userId"
            :enrolled-courses="approvedCourses"
            @enroll="openEnrollModal"
            @cancel-request="cancelRequest"
            @view-course="viewCourse"
          />
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
    <div v-if="selectedCourse">
      <p style="margin: 0 0 12px 0; color: var(--text-body);">You are about to request enrollment in:</p>
      <div style="padding: 16px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 12px;">
        <div style="font-weight: 600; margin-bottom: 4px;">{{ selectedCourse.code }} - {{ selectedCourse.name }}</div>
        <div style="font-size: 14px; color: var(--text-muted);">{{ selectedCourse.teacher }}</div>
        <div style="font-size: 14px; color: var(--text-muted); margin-top: 8px;">
          Credits: {{ selectedCourse.credits }} • {{ selectedCourse.semester }}
        </div>
      </div>
      <div style="font-size: 14px; color: var(--text-muted);">
        Current credits for {{ selectedCourse.semester }}: {{ enrollStore.getCommittedCredits(userId, selectedCourse.semester) }}/19
      </div>
    </div>
  </AppModal>
</template>
