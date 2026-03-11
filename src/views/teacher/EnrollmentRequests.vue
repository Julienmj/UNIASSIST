<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useCoursesStore } from '../../stores/courses.js'
import { useEnrollmentsStore } from '../../stores/enrollments.js'
import { useToast } from '../../composables/useToast.js'
import AppSidebar from '../../components/common/AppSidebar.vue'
import AppNavbar from '../../components/common/AppNavbar.vue'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import { formatDateTime } from '../../utils/helpers.js'

const auth = useAuthStore()
const courseStore = useCoursesStore()
const enrollStore = useEnrollmentsStore()
const toast = useToast()

const activeTab = ref('pending')
const myCourseIds = computed(() => courseStore.getCoursesByTeacher(auth.currentUser?.id ?? '').map(c => c.id))
const allRequests = computed(() => enrollStore.getTeacherRequests(myCourseIds.value))

const filtered = computed(() => {
  if (activeTab.value === 'all') return allRequests.value
  return allRequests.value.filter(r => r.status === activeTab.value)
})

const counts = computed(() => ({
  all: allRequests.value.length,
  pending: allRequests.value.filter(r=>r.status==='pending').length,
  approved: allRequests.value.filter(r=>r.status==='approved').length,
  rejected: allRequests.value.filter(r=>r.status==='rejected').length
}))

const showModal = ref(false)
const modalAction = ref('approve')
const selectedReq = ref(null)
const notes = ref('')
const loading = ref(false)

function openApprove(req) { selectedReq.value=req; modalAction.value='approve'; notes.value=''; showModal.value=true }
function openReject(req) { selectedReq.value=req; modalAction.value='reject'; notes.value=''; showModal.value=true }
async function confirm() {
  loading.value=true
  await new Promise(r=>setTimeout(r,400))
  if (modalAction.value==='approve') { enrollStore.approveRequest(selectedReq.value.id, notes.value); toast.success('Approved!') }
  else { enrollStore.rejectRequest(selectedReq.value.id, notes.value); toast.info('Rejected.') }
  loading.value=false; showModal.value=false
}

function getInitials(name) {
  if (!name) return 'S'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
}
</script>

<template>
  <div style="display:flex; min-height:calc(100vh - 64px); margin-top:64px;">
    <AppSidebar role="teacher" />
    <div style="flex:1; display:flex; flex-direction:column; margin-left:256px;">
      <AppNavbar role="teacher" />
      <main class="page-content">
        <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 24px 0;">Enrollment Requests</h1>
        
        <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--surface); padding: 6px; border-radius: var(--radius-md); border: 1px solid var(--border); width: fit-content;">
          <button :class="['tab-btn', { active: activeTab === 'all' }]" @click="activeTab = 'all'">
            All ({{ counts.all }})
          </button>
          <button :class="['tab-btn', { active: activeTab === 'pending' }]" @click="activeTab = 'pending'">
            Pending ({{ counts.pending }})
          </button>
          <button :class="['tab-btn', { active: activeTab === 'approved' }]" @click="activeTab = 'approved'">
            Approved ({{ counts.approved }})
          </button>
          <button :class="['tab-btn', { active: activeTab === 'rejected' }]" @click="activeTab = 'rejected'">
            Rejected ({{ counts.rejected }})
          </button>
        </div>
        
        <div v-if="filtered.length > 0" style="display: grid; gap: 12px;">
          <AppCard v-for="req in filtered" :key="req.id">
            <div style="display: flex; align-items: start; gap: 16px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
                #{{ req.queueNumber }}
              </div>
              
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 12px;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;">
                    {{ getInitials(req.studentName) }}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">{{ req.studentName }}</div>
                    <div style="font-size: 14px; color: var(--text-muted);">{{ req.studentEmail }}</div>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <AppBadge variant="info" :label="req.courseCode" />
                  <span style="font-weight: 500;">{{ req.courseName }}</span>
                  <span style="color: var(--text-muted);">• {{ req.courseCredits }} credits</span>
                </div>
                
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                  Requested: {{ formatDateTime(req.requestDate) }}
                  <span v-if="req.responseDate"> • Responded: {{ formatDateTime(req.responseDate) }}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px;">
                  <AppBadge
                    :variant="req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'danger'"
                    :label="req.status.charAt(0).toUpperCase() + req.status.slice(1)"
                  />
                  
                  <template v-if="req.status === 'pending'">
                    <AppButton variant="success" size="sm" @click="openApprove(req)">Approve</AppButton>
                    <AppButton variant="danger" size="sm" @click="openReject(req)">Reject</AppButton>
                  </template>
                </div>
                
                <div v-if="req.teacherNotes" style="margin-top: 12px; padding: 12px; background: var(--bg); border-radius: var(--radius-sm);">
                  <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Teacher's Note:</div>
                  <div style="font-size: 14px; color: var(--text-muted);">{{ req.teacherNotes }}</div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
        <AppCard v-else>
          <p style="text-align: center; color: var(--text-muted); margin: 0;">
            No {{ activeTab === 'all' ? '' : activeTab }} requests found
          </p>
        </AppCard>
      </main>
    </div>
  </div>
  
  <AppModal
    :show="showModal"
    :title="modalAction === 'approve' ? 'Approve Enrollment' : 'Reject Enrollment'"
    :confirm-text="modalAction === 'approve' ? 'Approve' : 'Reject'"
    :variant="modalAction === 'approve' ? 'success' : 'danger'"
    :loading="loading"
    @confirm="confirm"
    @cancel="showModal = false"
  >
    <div v-if="selectedReq">
      <p style="margin: 0 0 12px 0;">
        {{ modalAction === 'approve' ? 'Approve' : 'Reject' }} enrollment for:
      </p>
      <div style="padding: 12px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 16px;">
        <div style="font-weight: 600;">{{ selectedReq.studentName }}</div>
        <div style="font-size: 14px; color: var(--text-muted);">{{ selectedReq.studentEmail }}</div>
        <div style="font-size: 14px; color: var(--text-muted); margin-top: 4px;">
          {{ selectedReq.courseCode }} - {{ selectedReq.courseName }}
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Notes (Optional)</label>
        <textarea
          v-model="notes"
          rows="3"
          placeholder="Add a note for the student..."
          style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 15px; font-family: inherit; background: var(--surface); color: var(--text);"
        ></textarea>
      </div>
    </div>
  </AppModal>
</template>

<style scoped>
.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: var(--primary);
  color: white;
}
.tab-btn:hover:not(.active) {
  background: var(--bg);
}
</style>
