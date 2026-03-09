import { defineStore } from 'pinia'

const KEY = 'uniassist_assignments'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d))

export const useAssignmentsStore = defineStore('assignments', {
  state: () => ({ assignments: load() }),
  getters: {
    getByCourse: (state) => (courseId) =>
      [...(state.assignments ?? []).filter(a => a.courseId === courseId)]
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    getByTeacher: (state) => (teacherId) =>
      (state.assignments ?? []).filter(a => a.teacherId === teacherId)
  },
  actions: {
    addAssignment(data) {
      const a = { id: 'asgn_' + Date.now(), ...data, createdAt: new Date().toISOString() }
      this.assignments.push(a); save(this.assignments); return a
    },
    deleteAssignment(id) {
      const idx = this.assignments.findIndex(a => a.id === id)
      if (idx !== -1) { this.assignments.splice(idx, 1); save(this.assignments) }
    },
    initFromStorage() {
      this.assignments = load()
    }
  }
})
