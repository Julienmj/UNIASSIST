import { defineStore } from 'pinia'
import { MOCK_TEACHERS, MOCK_STUDENTS } from '../utils/mockData.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    role: null,
    isAuthenticated: false
  }),
  getters: {
    isTeacher: (state) => state.role === 'teacher',
    isStudent: (state) => state.role === 'student',
    userInitials: (state) => {
      if (!state.currentUser?.name) return 'U'
      return state.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    },
    deptColor: (state) => {
      const map = { SE: '#3B82F6', NC: '#F97316', IM: '#10B981' }
      return map[state.currentUser?.department] ?? '#64748B'
    }
  },
  actions: {
    _getAllUsers() {
      try {
        const saved = JSON.parse(localStorage.getItem('uniassist_registered_users') || '[]')
        return saved
      } catch { return [] }
    },
    initFromStorage() {
      try {
        const saved = localStorage.getItem('uniassist_auth')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.currentUser && data.role && data.isAuthenticated) {
            this.currentUser = data.currentUser
            this.role = data.role
            this.isAuthenticated = true
          }
        }
      } catch(e) { localStorage.removeItem('uniassist_auth') }
    },
    login(email, password, role, university) {
      const users = this._getAllUsers()
      const user = users.find(u =>
        u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
        u.password === password &&
        u.role === role &&
        u.university === university
      )
      if (!user) throw new Error('Invalid email, password, university, or role. Please check your details.')
      const { password: _pw, ...safeUser } = user
      this.currentUser = safeUser
      this.role = role
      this.isAuthenticated = true
      localStorage.setItem('uniassist_auth', JSON.stringify({ currentUser: safeUser, role, isAuthenticated: true }))
      return safeUser
    },
    register(formData, role) {
      const users = this._getAllUsers()
      if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('An account with this email already exists.')
      }
      const deptMap = { SE: 'Software Engineering', NC: 'Networks & Cybersecurity', IM: 'Information Management' }
      const newUser = role === 'teacher'
        ? { id: 't' + Date.now(), role: 'teacher', name: formData.fullName.trim(),
            email: formData.email.trim(), password: formData.password,
            university: formData.university, department: formData.department,
            departmentName: deptMap[formData.department] ?? '',
            employeeId: formData.employeeId?.trim() ?? '', courses: [] }
        : { id: 's' + Date.now(), role: 'student', name: formData.fullName.trim(),
            email: formData.email.trim(), password: formData.password,
            university: formData.university, department: formData.department,
            departmentName: deptMap[formData.department] ?? '',
            studentId: formData.studentId?.trim() ?? '',
            yearOfStudy: formData.yearOfStudy ?? '' }
      const saved = JSON.parse(localStorage.getItem('uniassist_registered_users') || '[]')
      saved.push(newUser)
      localStorage.setItem('uniassist_registered_users', JSON.stringify(saved))
      const { password: _pw, ...safeUser } = newUser
      this.currentUser = safeUser
      this.role = role
      this.isAuthenticated = true
      localStorage.setItem('uniassist_auth', JSON.stringify({ currentUser: safeUser, role, isAuthenticated: true }))
      return safeUser
    },
    logout() {
      this.currentUser = null
      this.role = null
      this.isAuthenticated = false
      localStorage.removeItem('uniassist_auth')
    }
  }
})
