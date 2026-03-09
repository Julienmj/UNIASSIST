import { defineStore } from 'pinia'

const KEY = 'uniassist_courses'

function fixCourseSchedule(course) {
  if (!course.schedule) return course
  const start = course.schedule.startTime
  const credits = parseInt(course.credits, 10)
  if (!start || isNaN(credits)) return course
  const [h, m] = start.split(':').map(Number)
  const endH = h + credits
  const endTime = String(endH).padStart(2,'0') + ':' + String(m).padStart(2,'0')
  return { ...course, schedule: { ...course.schedule, endTime } }
}

function loadCoursesFromStorage() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) {
      let courses = JSON.parse(saved)
      courses = courses.map(fixCourseSchedule)
      localStorage.setItem(KEY, JSON.stringify(courses))
      return courses
    }
    return []
  } catch {
    return []
  }
}

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export const useCoursesStore = defineStore('courses', {
  state: () => ({ courses: loadCoursesFromStorage() }),
  getters: {
    getCourseById: (state) => (id) => state.courses.find(c => c.id === id) ?? null,
    getCoursesByTeacher: (state) => (teacherId) =>
      state.courses.filter(c => c.teacherId === teacherId),
    getCoursesByIds: (state) => (ids) => {
      if (!Array.isArray(ids)) return []
      return state.courses.filter(c => ids.includes(c.id))
    }
  },
  actions: {
    updateDescription(courseId, description) {
      const course = this.courses.find(c => c.id === courseId)
      if (course) {
        course.description = description
        save(this.courses)
      }
    },
    addCourse(courseData) {
      const newCourse = fixCourseSchedule({
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...courseData
      })
      this.courses.push(newCourse)
      save(this.courses)
      return newCourse
    },
    removeCourse(courseId) {
      const idx = this.courses.findIndex(c => c.id === courseId)
      if (idx !== -1) {
        this.courses.splice(idx, 1)
        save(this.courses)
      }
    },
    initFromStorage() {
      this.courses = loadCoursesFromStorage()
    }
  }
})
