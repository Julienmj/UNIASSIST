<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useCoursesStore } from '../../stores/courses.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import { Grid, List } from 'lucide-vue-next'
import { getDeptColor, calculateEndTime, safeInt } from '../../utils/helpers.js'

const auth = useAuthStore()
const enrollStore = useEnrollmentsStore()
const courseStore = useCoursesStore()

const viewMode = ref('grid')

const userId = computed(() => auth.currentUser?.id ?? '')
const approved = computed(() => enrollStore.getApprovedForStudent(userId.value))
const approvedCourseIds = computed(() => approved.value.map(r => r.courseId))
const approvedCourses = computed(() => courseStore.getCoursesByIds(approvedCourseIds.value))

const COURSE_COLORS = ['#3B82F6','#10B981','#F59E0B','#8B5CF6','#EF4444','#EC4899']

const coursesByDay = computed(() => {
  const days = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] }
  approvedCourses.value.forEach((course, idx) => {
    const color = COURSE_COLORS[idx % COURSE_COLORS.length]
    course.schedule.days.forEach(day => {
      if (days[day]) {
        days[day].push({ ...course, color })
      }
    })
  })
  return days
})

function getRowStart(time) {
  const [h, m] = time.split(':').map(Number)
  return h - 6
}

function getRowSpan(course) {
  const startTime = course.schedule.startTime
  const endTime = course.schedule.endTime || calculateEndTime(startTime, course.credits)
  const [sh] = startTime.split(':').map(Number)
  const [eh] = endTime.split(':').map(Number)
  return eh - sh
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="student" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <main class="page-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h1 style="font-size: 32px; font-weight: 800; margin: 0;">My Timetable</h1>
          <div style="display: flex; gap: 8px;">
            <AppButton :variant="viewMode === 'grid' ? 'primary' : 'secondary'" size="sm" @click="viewMode = 'grid'">
              <Grid :size="16" />
              Grid
            </AppButton>
            <AppButton :variant="viewMode === 'list' ? 'primary' : 'secondary'" size="sm" @click="viewMode = 'list'">
              <List :size="16" />
              List
            </AppButton>
          </div>
        </div>
        
        <div v-if="approvedCourses.length === 0">
          <AppCard>
            <p style="text-align: center; color: var(--text-muted); margin: 0;">
              You haven't enrolled in any courses yet. Your timetable will appear here once you enroll.
            </p>
          </AppCard>
        </div>
        
        <div v-else-if="viewMode === 'grid'" class="timetable-grid">
          <div class="time-label"></div>
          <div class="day-header">Monday</div>
          <div class="day-header">Tuesday</div>
          <div class="day-header">Wednesday</div>
          <div class="day-header">Thursday</div>
          <div class="day-header">Friday</div>
          
          <template v-for="hour in 13" :key="hour">
            <div class="time-label">{{ String(hour + 6).padStart(2, '0') }}:00</div>
            <div class="time-slot"></div>
            <div class="time-slot"></div>
            <div class="time-slot"></div>
            <div class="time-slot"></div>
            <div class="time-slot"></div>
          </template>
          
          <template v-for="(course, idx) in approvedCourses" :key="course.id">
            <div
              v-for="day in course.schedule.days"
              :key="`${course.id}-${day}`"
              class="course-block"
              :style="{
                gridColumn: ['Monday','Tuesday','Wednesday','Thursday','Friday'].indexOf(day) + 2,
                gridRow: `${getRowStart(course.schedule.startTime) + 2} / span ${getRowSpan(course)}`,
                background: COURSE_COLORS[idx % COURSE_COLORS.length] + '33',
                borderLeft: `4px solid ${COURSE_COLORS[idx % COURSE_COLORS.length]}`
              }"
            >
              <div class="course-code">{{ course.code }}</div>
              <div class="course-room">{{ course.schedule.room }}</div>
              <div class="course-time">{{ course.schedule.startTime }}-{{ course.schedule.endTime || calculateEndTime(course.schedule.startTime, course.credits) }}</div>
            </div>
          </template>
        </div>
        
        <div v-else style="display: grid; gap: 20px;">
          <AppCard v-for="(courses, day) in coursesByDay" :key="day">
            <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">{{ day }}</h3>
            <div v-if="courses.length > 0" style="display: grid; gap: 12px;">
              <div
                v-for="course in courses"
                :key="course.id"
                style="padding: 12px; border-radius: var(--radius-sm); border-left: 4px solid;"
                :style="{ background: course.color + '22', borderLeftColor: course.color }"
              >
                <div style="font-weight: 600; margin-bottom: 4px;">{{ course.code }} - {{ course.name }}</div>
                <div style="font-size: 14px; color: var(--text-muted);">
                  {{ course.schedule.startTime }} - {{ course.schedule.endTime || calculateEndTime(course.schedule.startTime, course.credits) }} • {{ course.schedule.room }}
                </div>
              </div>
            </div>
            <div v-else style="color: var(--text-muted); font-size: 14px;">No classes</div>
          </AppCard>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.timetable-grid {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
}
.time-label {
  background: var(--bg);
  padding: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
.day-header {
  background: var(--primary-light);
  padding: 16px;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
}
.time-slot {
  background: white;
  min-height: 60px;
}
.course-block {
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}
.course-code {
  font-weight: 700;
  font-size: 14px;
}
.course-room {
  font-size: 12px;
  opacity: 0.8;
}
.course-time {
  font-size: 11px;
  opacity: 0.7;
}

@media (max-width: 1024px) {
  .timetable-grid {
    grid-template-columns: 60px repeat(5, minmax(100px, 1fr));
    font-size: 11px;
  }
}
</style>
