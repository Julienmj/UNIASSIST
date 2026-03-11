<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useAnnouncementsStore } from '../../stores/announcements.js'
import { useRemindersStore } from '../../stores/reminders.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppNavbar from '../../components/common/AppNavbar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppSelect from '../../components/common/AppSelect.vue'
import AppButton from '../../components/common/AppButton.vue'
import { Megaphone, Bell, Pin, Trash2 } from 'lucide-vue-next'

const auth = useAuthStore()
const courseStore = useCoursesStore()
const announcementsStore = useAnnouncementsStore()
const remindersStore = useRemindersStore()
const toast = useToast()

const activeTab = ref('announcements')
const teacherId = computed(() => auth.currentUser?.id ?? '')
const myCourses = computed(() => courseStore.getCoursesByTeacher(teacherId.value))
const myAnnouncements = computed(() => announcementsStore.getByTeacher(teacherId.value))
const myReminders = computed(() => remindersStore.getByTeacher(teacherId.value))

const announcementForm = ref({ title: '', message: '', target: 'all', courseId: '', pinned: false })
const reminderForm = ref({ title: '', message: '', type: 'info', courseId: '', targetAudience: 'all', expiresAt: '' })

function submitAnnouncement() {
  if (!announcementForm.value.title || !announcementForm.value.message) return
  const course = myCourses.value.find(c => c.id === announcementForm.value.courseId)
  announcementsStore.createAnnouncement({
    ...announcementForm.value,
    teacherId: teacherId.value,
    teacherName: auth.currentUser?.name ?? '',
    courseCode: course?.code ?? '',
    courseName: course?.name ?? ''
  })
  toast.success('Announcement posted!')
  announcementForm.value = { title: '', message: '', target: 'all', courseId: '', pinned: false }
}

function deleteAnnouncement(id) {
  announcementsStore.deleteAnnouncement(id)
  toast.info('Announcement deleted')
}

function submitReminder() {
  if (!reminderForm.value.title || !reminderForm.value.message) return
  const course = myCourses.value.find(c => c.id === reminderForm.value.courseId)
  remindersStore.createReminder({
    ...reminderForm.value,
    teacherId: teacherId.value,
    teacherName: auth.currentUser?.name ?? '',
    courseCode: course?.code ?? '',
    courseName: course?.name ?? ''
  })
  toast.success('Reminder posted!')
  reminderForm.value = { title: '', message: '', type: 'info', courseId: '', targetAudience: 'all', expiresAt: '' }
}

function deleteReminder(id) {
  remindersStore.deleteReminder(id)
  toast.info('Reminder deleted')
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="teacher" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <AppNavbar role="teacher" />
      <main class="page-content">
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 24px 0;">Announcements & Reminders</h1>
        
        <div style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border);">
          <button
            @click="activeTab = 'announcements'"
            :style="{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'announcements' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'announcements' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'announcements' ? '600' : '500',
              fontSize: '15px',
              cursor: 'pointer'
            }"
          >
            <Megaphone :size="18" style="display: inline; vertical-align: middle; margin-right: 6px;" />
            Announcements
          </button>
          <button
            @click="activeTab = 'reminders'"
            :style="{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'reminders' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'reminders' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'reminders' ? '600' : '500',
              fontSize: '15px',
              cursor: 'pointer'
            }"
          >
            <Bell :size="18" style="display: inline; vertical-align: middle; margin-right: 6px;" />
            Reminders
          </button>
        </div>
        
        <div v-if="activeTab === 'announcements'">
          <AppCard style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Post New Announcement</h3>
            <div style="display: grid; gap: 16px;">
              <AppInput v-model="announcementForm.title" label="Title" placeholder="Enter announcement title" required />
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Message *</label>
                <textarea
                  v-model="announcementForm.message"
                  rows="4"
                  placeholder="Enter announcement message"
                  style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit; background: var(--surface); color: var(--text);"
                ></textarea>
              </div>
              <AppSelect
                v-model="announcementForm.target"
                label="Target Audience"
                :options="[
                  { value: 'all', label: 'All Students' },
                  { value: 'course', label: 'Specific Course' }
                ]"
              />
              <AppSelect
                v-if="announcementForm.target === 'course'"
                v-model="announcementForm.courseId"
                label="Select Course"
                :options="myCourses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))"
                required
              />
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" v-model="announcementForm.pinned" id="pin-announcement" />
                <label for="pin-announcement" style="font-size: 14px; cursor: pointer;">Pin this announcement (appears at top)</label>
              </div>
              <AppButton @click="submitAnnouncement">Post Announcement</AppButton>
            </div>
          </AppCard>
          
          <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">My Announcements</h3>
          <div v-if="myAnnouncements.length > 0" style="display: grid; gap: 16px;">
            <AppCard v-for="a in myAnnouncements" :key="a.id" :style="{ borderLeft: a.pinned ? '4px solid var(--primary)' : 'none' }">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h4 style="font-size: 16px; font-weight: 600; margin: 0;">{{ a.title }}</h4>
                    <Pin v-if="a.pinned" :size="16" style="color: var(--primary);" />
                  </div>
                  <p style="font-size: 14px; color: var(--text-muted); margin: 0 0 8px 0;">{{ a.message }}</p>
                  <div style="font-size: 13px; color: var(--text-muted);">
                    {{ a.target === 'all' ? 'All Students' : `${a.courseCode} - ${a.courseName}` }} • {{ new Date(a.createdAt).toLocaleDateString() }}
                  </div>
                </div>
                <AppButton variant="ghost" size="sm" @click="deleteAnnouncement(a.id)">
                  <Trash2 :size="16" />
                </AppButton>
              </div>
            </AppCard>
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0;">No announcements posted yet</p>
          </AppCard>
        </div>
        
        <div v-if="activeTab === 'reminders'">
          <AppCard style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Create New Reminder</h3>
            <div style="display: grid; gap: 16px;">
              <AppInput v-model="reminderForm.title" label="Title" placeholder="Enter reminder title" required />
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Message *</label>
                <textarea
                  v-model="reminderForm.message"
                  rows="4"
                  placeholder="Enter reminder message"
                  style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit; background: var(--surface); color: var(--text);"
                ></textarea>
              </div>
              <AppSelect
                v-model="reminderForm.type"
                label="Type"
                :options="[
                  { value: 'info', label: 'Info' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'urgent', label: 'Urgent' }
                ]"
              />
              <AppSelect
                v-model="reminderForm.courseId"
                label="Course"
                :options="[{ value: '', label: 'All Courses' }, ...myCourses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))]"
              />
              <AppSelect
                v-model="reminderForm.targetAudience"
                label="Target Audience"
                :options="[
                  { value: 'all', label: 'All Students' },
                  { value: 'enrolled', label: 'Enrolled Students Only' }
                ]"
              />
              <AppInput v-model="reminderForm.expiresAt" type="date" label="Expires At (Optional)" />
              <AppButton @click="submitReminder">Post Reminder</AppButton>
            </div>
          </AppCard>
          
          <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">My Reminders</h3>
          <div v-if="myReminders.length > 0" style="display: grid; gap: 16px;">
            <AppCard v-for="r in myReminders" :key="r.id" :style="{ borderLeft: `4px solid ${r.type === 'urgent' ? 'var(--danger)' : r.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}` }">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h4 style="font-size: 16px; font-weight: 600; margin: 0;">{{ r.title }}</h4>
                    <span :style="{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      background: r.type === 'urgent' ? 'var(--danger-light)' : r.type === 'warning' ? 'var(--warning-light)' : 'var(--primary-light)',
                      color: r.type === 'urgent' ? 'var(--danger)' : r.type === 'warning' ? 'var(--warning)' : 'var(--primary)'
                    }">{{ r.type.toUpperCase() }}</span>
                  </div>
                  <p style="font-size: 14px; color: var(--text-muted); margin: 0 0 8px 0;">{{ r.message }}</p>
                  <div style="font-size: 13px; color: var(--text-muted);">
                    {{ r.courseCode || 'All Courses' }} • {{ r.targetAudience === 'all' ? 'All Students' : 'Enrolled Only' }}
                    <span v-if="r.expiresAt"> • Expires: {{ new Date(r.expiresAt).toLocaleDateString() }}</span>
                  </div>
                </div>
                <AppButton variant="ghost" size="sm" @click="deleteReminder(r.id)">
                  <Trash2 :size="16" />
                </AppButton>
              </div>
            </AppCard>
          </div>
          <AppCard v-else>
            <p style="text-align: center; color: var(--text-muted); margin: 0;">No reminders posted yet</p>
          </AppCard>
        </div>
      </main>
    </div>
  </div>
</template>
