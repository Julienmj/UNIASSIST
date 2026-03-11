<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useToast } from '../../composables/useToast.js'
import { calculateEndTime, safeInt } from '../../utils/helpers.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import TeacherCourseCard from '../../components/teacher/TeacherCourseCard.vue'

const router = useRouter()
const auth = useAuthStore()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const toast = useToast()

const COURSE_TEMPLATES = {
  SE: [
    { code: 'IT101', name: 'Introduction to Programming', credits: 4, desc: 'Learn fundamental programming concepts using Python and Java. Covers variables, loops, functions, and OOP basics.' },
    { code: 'IT201', name: 'Data Structures & Algorithms', credits: 4, desc: 'Advanced problem-solving using arrays, linked lists, trees, graphs, and sorting algorithms.' },
    { code: 'IT202', name: 'Web Development', credits: 3, desc: 'Build modern web applications with HTML, CSS, JavaScript and Vue.js. Includes responsive design principles.' },
    { code: 'IT302', name: 'Software Engineering', credits: 3, desc: 'Software development lifecycle, Agile methodology, version control, testing and deployment practices.' },
    { code: 'IT501', name: 'Mobile App Development', credits: 4, desc: 'Build native and cross-platform mobile applications for iOS and Android.' },
    { code: 'IT502', name: 'Cloud Computing', credits: 4, desc: 'Cloud architecture, AWS, Azure, containerization, and serverless computing.' },
    { code: 'IT503', name: 'DevOps & CI/CD', credits: 3, desc: 'Continuous integration, deployment pipelines, infrastructure as code, and monitoring.' }
  ],
  NC: [
    { code: 'IT251', name: 'Computer Networks', credits: 4, desc: 'Network protocols, TCP/IP, routing, switching, and network design principles.' },
    { code: 'IT351', name: 'Network Security', credits: 4, desc: 'Firewalls, VPNs, intrusion detection, and network security best practices.' },
    { code: 'IT352', name: 'Ethical Hacking', credits: 3, desc: 'Penetration testing, vulnerability assessment, and ethical hacking techniques.' },
    { code: 'IT451', name: 'Cryptography', credits: 4, desc: 'Encryption algorithms, public key infrastructure, and cryptographic protocols.' },
    { code: 'IT452', name: 'Cyber Forensics', credits: 3, desc: 'Digital forensics, incident response, and evidence collection techniques.' },
    { code: 'IT453', name: 'Wireless Networks', credits: 3, desc: 'WiFi, cellular networks, IoT, and wireless security.' }
  ],
  IM: [
    { code: 'IT301', name: 'Database Systems', credits: 4, desc: 'Design and implement relational databases. SQL, normalization, transactions, and indexing.' },
    { code: 'IT401', name: 'Artificial Intelligence', credits: 4, desc: 'Machine learning fundamentals, neural networks, natural language processing, and AI ethics.' },
    { code: 'IT402', name: 'Data Science & Analytics', credits: 4, desc: 'Statistical analysis, data visualization, predictive modeling, and big data tools.' },
    { code: 'IT403', name: 'Business Intelligence', credits: 3, desc: 'Data warehousing, OLAP, reporting, and business analytics dashboards.' },
    { code: 'IT404', name: 'Machine Learning', credits: 4, desc: 'Supervised and unsupervised learning, deep learning, and model deployment.' },
    { code: 'IT405', name: 'Big Data Technologies', credits: 4, desc: 'Hadoop, Spark, NoSQL databases, and distributed computing frameworks.' }
  ]
}

const teacherId = computed(() => auth.currentUser?.id ?? '')
const myCourses = computed(() => courseStore.getCoursesByTeacher(teacherId.value))

const enrolledCountByCourse = computed(() => {
  const map = {}
  myCourses.value.forEach(c => {
    map[c.id] = enrollStore.getEnrolledForCourse(c.id).length
  })
  return map
})

const pendingCountByCourse = computed(() => {
  const map = {}
  myCourses.value.forEach(c => {
    map[c.id] = enrollStore.getTeacherRequests([c.id]).filter(r => r.status === 'pending').length
  })
  return map
})

function manageCourse(course) {
  router.push(`/teacher/courses/${course.id}`)
}

const showAddCourseForm = ref(false)
const addCourseForm = ref({ courseTemplate: '', semester: '', days: [], startTime: '', room: '', credits: 3, description: '' })
const addCourseErrors = ref({})

const teacherDept = computed(() => auth.currentUser?.department ?? '')
const availableCourseTemplates = computed(() => {
  const templates = COURSE_TEMPLATES[teacherDept.value] ?? []
  const existingCodes = myCourses.value.map(c => c.code)
  return templates.filter(t => !existingCodes.includes(t.code))
})

const courseTemplateOptions = computed(() => 
  availableCourseTemplates.value.map(t => ({ 
    value: t.code, 
    label: `${t.code} - ${t.name} (${t.credits} credits)` 
  }))
)

const selectedTemplate = computed(() => {
  if (!addCourseForm.value.courseTemplate) return null
  const templates = COURSE_TEMPLATES[teacherDept.value] ?? []
  return templates.find(t => t.code === addCourseForm.value.courseTemplate)
})

const calculatedEndTime = computed(() => {
  if (!addCourseForm.value.startTime || !addCourseForm.value.credits) return ''
  const [h, m] = addCourseForm.value.startTime.split(':').map(Number)
  const endH = h + parseInt(addCourseForm.value.credits, 10)
  return String(endH).padStart(2,'0') + ':' + String(m).padStart(2,'0')
})

function toggleDay(day) {
  const idx = addCourseForm.value.days.indexOf(day)
  if (idx > -1) addCourseForm.value.days.splice(idx, 1)
  else addCourseForm.value.days.push(day)
}

function resetAddCourseForm() {
  addCourseForm.value = { courseTemplate: '', semester: '', days: [], startTime: '', room: '', credits: 3, description: '' }
  addCourseErrors.value = {}
  showAddCourseForm.value = false
}

function submitAddCourse() {
  addCourseErrors.value = {}
  if (!addCourseForm.value.courseTemplate) addCourseErrors.value.courseTemplate = 'Please select a course'
  if (!addCourseForm.value.semester) addCourseErrors.value.semester = 'Semester is required'
  if (addCourseForm.value.days.length === 0) addCourseErrors.value.days = 'Select at least one day'
  if (!addCourseForm.value.startTime) addCourseErrors.value.startTime = 'Start time is required'
  if (!addCourseForm.value.room) addCourseErrors.value.room = 'Room is required'
  
  if (Object.keys(addCourseErrors.value).length > 0) return
  
  const template = selectedTemplate.value
  if (!template) return
  
  const deptMap = { SE: 'Software Engineering', NC: 'Networks & Cybersecurity', IM: 'Information Management' }
  const newCourse = {
    code: template.code,
    name: template.name,
    department: teacherDept.value,
    departmentName: deptMap[teacherDept.value] ?? '',
    credits: safeInt(addCourseForm.value.credits),
    semester: addCourseForm.value.semester,
    description: addCourseForm.value.description || template.desc,
    schedule: {
      days: [...addCourseForm.value.days].sort(),
      startTime: addCourseForm.value.startTime,
      endTime: calculateEndTime(addCourseForm.value.startTime, addCourseForm.value.credits),
      room: addCourseForm.value.room
    },
    university: auth.currentUser?.university ?? '',
    teacherId: teacherId.value,
    teacher: auth.currentUser?.name ?? ''
  }
  
  courseStore.addCourse(newCourse)
  toast.success(`Course ${template.code} added to your list!`)
  resetAddCourseForm()
}

const showRemoveCourseModal = ref(false)
const courseToRemove = ref(null)

function openRemoveCourseModal(course) {
  courseToRemove.value = course
  showRemoveCourseModal.value = true
}

function confirmRemoveCourse() {
  if (!courseToRemove.value) return
  enrollStore.removeAllRequestsForCourse(courseToRemove.value.id)
  courseStore.removeCourse(courseToRemove.value.id)
  toast.info(`Course ${courseToRemove.value.code} removed`)
  showRemoveCourseModal.value = false
  courseToRemove.value = null
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="teacher" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 16px;">
            <h1 style="font-size: 32px; font-weight: 800; margin: 0; flex: 1;">My Courses</h1>
            <AppButton variant="primary" style="margin-left: 16px;" @click="showAddCourseForm = !showAddCourseForm">
              {{ showAddCourseForm ? 'Cancel' : '+ Add Course' }}
            </AppButton>
          </div>
          <p style="color: var(--text-muted); margin: 0;">
            {{ myCourses.length }} course{{ myCourses.length !== 1 ? 's' : '' }}
          </p>
        </div>
        
        <AppCard v-if="showAddCourseForm" style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Add New Course</h3>
          <div style="display: grid; gap: 16px;">
            <AppSelect
              v-model="addCourseForm.courseTemplate"
              label="Select Course"
              :options="courseTemplateOptions"
              :error="addCourseErrors.courseTemplate"
              placeholder="Choose a course..."
              required
            />
            <AppSelect
              v-model="addCourseForm.semester"
              label="Semester"
              :options="[
                { value: 'Fall 2024', label: 'Fall 2024' },
                { value: 'Spring 2025', label: 'Spring 2025' },
                { value: 'Fall 2025', label: 'Fall 2025' },
                { value: 'Spring 2026', label: 'Spring 2026' }
              ]"
              :error="addCourseErrors.semester"
              required
            />
            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Schedule Days *</label>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button
                  v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']"
                  :key="day"
                  type="button"
                  @click="toggleDay(day)"
                  :style="{
                    padding: '8px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: addCourseForm.days.includes(day) ? 'var(--primary)' : 'var(--surface)',
                    color: addCourseForm.days.includes(day) ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }"
                >
                  {{ day.slice(0, 3) }}
                </button>
              </div>
              <p v-if="addCourseErrors.days" style="font-size: 13px; color: var(--danger); margin: 4px 0 0 0;">{{ addCourseErrors.days }}</p>
            </div>
            <AppSelect
              v-model="addCourseForm.startTime"
              label="Start Time"
              :options="[
                { value: '07:00', label: '07:00' }, { value: '07:30', label: '07:30' },
                { value: '08:00', label: '08:00' }, { value: '08:30', label: '08:30' },
                { value: '09:00', label: '09:00' }, { value: '09:30', label: '09:30' },
                { value: '10:00', label: '10:00' }, { value: '10:30', label: '10:30' },
                { value: '11:00', label: '11:00' }, { value: '11:30', label: '11:30' },
                { value: '12:00', label: '12:00' }, { value: '12:30', label: '12:30' },
                { value: '13:00', label: '13:00' }, { value: '13:30', label: '13:30' },
                { value: '14:00', label: '14:00' }, { value: '14:30', label: '14:30' },
                { value: '15:00', label: '15:00' }, { value: '15:30', label: '15:30' },
                { value: '16:00', label: '16:00' }, { value: '16:30', label: '16:30' },
                { value: '17:00', label: '17:00' }, { value: '17:30', label: '17:30' },
                { value: '18:00', label: '18:00' }
              ]"
              :error="addCourseErrors.startTime"
              required
            />
            <AppSelect
              v-model="addCourseForm.credits"
              label="Credits"
              :options="[
                { value: 3, label: '3 Credits' },
                { value: 4, label: '4 Credits' }
              ]"
              required
            />
            <p v-if="calculatedEndTime" style="font-size: 13px; color: var(--text-muted); margin: -8px 0 0 0;">
              Class ends at: {{ calculatedEndTime }}
            </p>
            <AppInput
              v-model="addCourseForm.room"
              label="Room"
              placeholder="e.g. Room A101"
              :error="addCourseErrors.room"
              required
            />
            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Description (Optional)</label>
              <textarea
                v-model="addCourseForm.description"
                rows="3"
                style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit; background: var(--surface); color: var(--text);"
                :placeholder="selectedTemplate?.desc || ''"
              ></textarea>
            </div>
            <AppButton @click="submitAddCourse">Add Course</AppButton>
          </div>
        </AppCard>
        <div v-if="myCourses.length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          <div v-for="course in myCourses" :key="course.id" style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">{{ course.code }} - {{ course.name }}</div>
                <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">
                  {{ course.schedule.days.join(', ') }} • {{ course.schedule.startTime }}-{{ course.schedule.endTime }}
                </div>
                <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">
                  {{ course.schedule.room }} • {{ course.semester }}
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <span style="font-size: 13px; color: var(--success); font-weight: 500;">{{ enrolledCountByCourse[course.id] }} enrolled</span>
                  <span v-if="pendingCountByCourse[course.id] > 0" style="font-size: 13px; color: var(--warning); font-weight: 500;">
                    • {{ pendingCountByCourse[course.id] }} pending
                  </span>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <AppButton variant="primary" size="sm" style="flex: 1;" @click="manageCourse(course)">Manage</AppButton>
              <AppButton variant="danger" size="sm" @click="openRemoveCourseModal(course)">Remove</AppButton>
            </div>
          </div>
        </div>
        <AppCard v-else-if="!showAddCourseForm">
          <p style="text-align: center; color: var(--text-muted); margin: 0;">No courses added yet. Click "+ Add Course" to get started.</p>
        </AppCard>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showRemoveCourseModal"
    title="Remove Course"
    confirm-text="Remove"
    variant="danger"
    @confirm="confirmRemoveCourse"
    @cancel="showRemoveCourseModal = false"
  >
    <p style="margin: 0 0 12px 0;">Are you sure you want to remove this course? All enrollment requests for this course will also be deleted.</p>
    <div v-if="courseToRemove" style="padding: 12px; background: var(--bg); border-radius: var(--radius-sm);">
      <div style="font-weight: 600;">{{ courseToRemove.code }} - {{ courseToRemove.name }}</div>
      <div style="font-size: 14px; color: var(--text-muted);">{{ courseToRemove.semester }}</div>
    </div>
  </AppModal>
</template>
