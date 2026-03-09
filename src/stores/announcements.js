import { defineStore } from 'pinia'

const KEY = 'uniassist_announcements'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export const useAnnouncementsStore = defineStore('announcements', {
  state: () => ({ announcements: load() }),
  getters: {
    getByTeacher: (state) => (teacherId) =>
      (state.announcements ?? []).filter(a => a.teacherId === teacherId)
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
          return new Date(b.createdAt) - new Date(a.createdAt)
        }),
    getForStudent: (state) => (enrolledCourseIds) =>
      (state.announcements ?? []).filter(a => 
        a.target === 'all' || enrolledCourseIds.includes(a.courseId)
      ).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  },
  actions: {
    createAnnouncement(data) {
      const newAnnouncement = {
        id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...data,
        createdAt: new Date().toISOString()
      }
      this.announcements.push(newAnnouncement)
      save(this.announcements)
      return newAnnouncement
    },
    deleteAnnouncement(id) {
      const idx = this.announcements.findIndex(a => a.id === id)
      if (idx !== -1) {
        this.announcements.splice(idx, 1)
        save(this.announcements)
      }
    },
    initFromStorage() {
      this.announcements = load()
    }
  }
})
