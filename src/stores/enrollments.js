import { defineStore } from 'pinia'
import { safeInt } from '../utils/helpers.js'

const KEY = 'uniassist_enrollments'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export const useEnrollmentsStore = defineStore('enrollments', {
  state: () => ({ requests: load() }),
  getters: {
    getStudentRequests: (state) => (studentId) =>
      [...(state.requests ?? []).filter(r => r.studentId === studentId)]
        .sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate)),
    getApprovedForStudent: (state) => (studentId) =>
      (state.requests ?? []).filter(r => r.studentId === studentId && r.status === 'approved'),
    getPendingForStudent: (state) => (studentId) =>
      (state.requests ?? []).filter(r => r.studentId === studentId && r.status === 'pending'),
    getRejectedForStudent: (state) => (studentId) =>
      (state.requests ?? []).filter(r => r.studentId === studentId && r.status === 'rejected'),
    getTeacherRequests: (state) => (courseIds) => {
      if (!Array.isArray(courseIds)) return []
      return [...(state.requests ?? []).filter(r => courseIds.includes(r.courseId))]
        .sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate))
    },
    getPendingCount: (state) => (courseIds) => {
      if (!Array.isArray(courseIds)) return 0
      return (state.requests ?? []).filter(r => courseIds.includes(r.courseId) && r.status === 'pending').length
    },
    getEnrollmentStatus: (state) => (studentId, courseId) => {
      const req = (state.requests ?? []).find(r => r.studentId === studentId && r.courseId === courseId)
      return req?.status ?? null
    },
    getEnrolledForCourse: (state) => (courseId) =>
      (state.requests ?? []).filter(r => r.courseId === courseId && r.status === 'approved'),
    getCommittedCredits: (state) => (studentId, semester) =>
      (state.requests ?? [])
        .filter(r => {
          if (r.studentId !== studentId) return false
          if (r.semester !== semester) return false
          if (r.status === 'rejected') return false
          if (r.status === 'cancelled') return false
          return r.status === 'approved' || r.status === 'pending'
        })
        .reduce((sum, r) => {
          const credits = safeInt(r.courseCredits)
          return sum + credits
        }, 0),
    getApprovedCredits: (state) => (studentId, semester) =>
      (state.requests ?? [])
        .filter(r => r.studentId === studentId && r.semester === semester && r.status === 'approved')
        .reduce((sum, r) => sum + safeInt(r.courseCredits), 0),
    getPendingCredits: (state) => (studentId, semester) =>
      (state.requests ?? [])
        .filter(r => r.studentId === studentId && r.semester === semester && r.status === 'pending')
        .reduce((sum, r) => sum + safeInt(r.courseCredits), 0)
  },
  actions: {
    submitRequest(student, course) {
      const exists = (this.requests ?? []).find(r =>
        r.studentId === student.id && r.courseId === course.id &&
        (r.status === 'pending' || r.status === 'approved'))
      if (exists) throw new Error('You already have a pending or approved enrollment for this course.')
      const currentCredits = this.getCommittedCredits(student.id, course.semester)
      const courseCredits = safeInt(course.credits)
      if (currentCredits + courseCredits > 19) {
        throw new Error(
          `Cannot enroll. You have ${currentCredits} credits in ${course.semester}. ` +
          `This course adds ${courseCredits} credits, which would exceed the 19-credit maximum. ` +
          `You can only add courses totaling up to ${19 - currentCredits} more credits this semester.`
        )
      }
      const courseRequests = (this.requests ?? []).filter(r => r.courseId === course.id)
      const newReq = {
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
        studentId: student.id, studentName: student.name, studentEmail: student.email,
        courseId: course.id, courseCode: course.code, courseName: course.name,
        courseCredits: safeInt(course.credits), semester: course.semester, teacherId: course.teacherId,
        status: 'pending', queueNumber: courseRequests.length + 1,
        requestDate: new Date().toISOString(), responseDate: null, teacherNotes: ''
      }
      this.requests.push(newReq)
      save(this.requests)
      return newReq
    },
    approveRequest(id, notes = '') {
      const r = this.requests.find(r => r.id === id)
      if (r) { r.status = 'approved'; r.responseDate = new Date().toISOString(); r.teacherNotes = notes; save(this.requests) }
    },
    rejectRequest(id, notes = '') {
      const r = this.requests.find(r => r.id === id)
      if (r) { r.status = 'rejected'; r.responseDate = new Date().toISOString(); r.teacherNotes = notes; save(this.requests) }
    },
    cancelRequest(id) {
      const idx = this.requests.findIndex(r => r.id === id)
      if (idx !== -1) { this.requests.splice(idx, 1); save(this.requests) }
    },
    removeStudentFromCourse(studentId, courseId) {
      const idx = this.requests.findIndex(r =>
        r.studentId === studentId && r.courseId === courseId && r.status === 'approved')
      if (idx !== -1) { this.requests.splice(idx, 1); save(this.requests) }
    },
    removeAllRequestsForCourse(courseId) {
      this.requests = (this.requests ?? []).filter(r => r.courseId !== courseId)
      save(this.requests)
    },
    initFromStorage() {
      this.requests = load()
    }
  }
})
