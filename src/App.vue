<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { useCoursesStore } from './stores/courses.js'
import { useEnrollmentsStore } from './stores/enrollments.js'
import { useAssignmentsStore } from './stores/assignments.js'
import { useRemindersStore } from './stores/reminders.js'
import { useAnnouncementsStore } from './stores/announcements.js'
import SharedNavbar from './components/common/SharedNavbar.vue'
import AppToast from './components/common/AppToast.vue'

const auth = useAuthStore()
const coursesStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const assignStore = useAssignmentsStore()
const remindersStore = useRemindersStore()
const announcementsStore = useAnnouncementsStore()

onMounted(() => {
  const currentVersion = '2.0'
  const storedVersion = localStorage.getItem('uniassist_version')
  if (storedVersion !== currentVersion) {
    localStorage.removeItem('uniassist_courses')
    localStorage.removeItem('uniassist_enrollments')
    localStorage.removeItem('uniassist_assignments')
    localStorage.removeItem('uniassist_reminders')
    localStorage.removeItem('uniassist_announcements')
    localStorage.removeItem('uniassist_registered_users')
    localStorage.removeItem('uniassist_auth')
    localStorage.setItem('uniassist_version', currentVersion)
  }
  
  auth.initFromStorage()
  coursesStore.initFromStorage()
  enrollStore.initFromStorage()
  assignStore.initFromStorage()
  remindersStore.initFromStorage()
  announcementsStore.initFromStorage()
})
</script>

<template>
  <div id="app">
    <SharedNavbar />
    <RouterView />
    <AppToast />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
