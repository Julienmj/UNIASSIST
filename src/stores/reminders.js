import { defineStore } from 'pinia'

const KEY = 'uniassist_reminders'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d))

export const useRemindersStore = defineStore('reminders', {
  state: () => ({ reminders: load() }),
  getters: {
    getForStudent: (state) => (enrolledCourseIds) => {
      const now = new Date()
      return [...(state.reminders ?? [])]
        .filter(r => {
          if (r.expiresAt && new Date(r.expiresAt) < now) return false
          if (r.targetAudience === 'all') return true
          if (r.targetAudience === 'enrolled') return (enrolledCourseIds ?? []).includes(r.courseId)
          return false
        })
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    getByTeacher: (state) => (teacherId) =>
      [...(state.reminders ?? []).filter(r => r.teacherId === teacherId)]
        .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  actions: {
    createReminder(data) {
      const r = { id: 'rem_' + Date.now(), ...data, createdAt: new Date().toISOString() }
      this.reminders.push(r); save(this.reminders); return r
    },
    deleteReminder(id) {
      const idx = this.reminders.findIndex(r => r.id === id)
      if (idx !== -1) { this.reminders.splice(idx, 1); save(this.reminders) }
    },
    initFromStorage() {
      this.reminders = load()
    }
  }
})
