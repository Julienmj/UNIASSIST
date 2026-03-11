<script setup>
import { computed } from 'vue'
import { User, Clock } from 'lucide-vue-next'
import AppBadge from '../common/AppBadge.vue'
import AppButton from '../common/AppButton.vue'
import { getDeptColor, getEndTime, safeInt } from '../../utils/helpers.js'

const props = defineProps({
  course: { type: Object, required: true },
  enrollmentStatus: { type: String, default: null },
  committedCredits: { type: Number, default: 0 },
  userId: { type: String, required: true }
})

const emit = defineEmits(['enroll', 'cancelRequest', 'viewCourse'])

const deptColor = computed(() => getDeptColor(props.course.department))
const canEnroll = computed(() => {
  if (props.enrollmentStatus === 'approved' || props.enrollmentStatus === 'pending') return false
  const courseCredits = safeInt(props.course.credits)
  return props.committedCredits + courseCredits <= 19
})

const creditLimitMessage = computed(() => {
  const courseCredits = safeInt(props.course.credits)
  const remaining = 19 - props.committedCredits
  if (props.committedCredits + courseCredits > 19) {
    return `Credit limit reached. You have ${props.committedCredits}/19 credits in ${props.course.semester}. Only ${remaining} credits remaining.`
  }
  return ''
})

const scheduleText = computed(() => {
  const s = props.course.schedule
  const endTime = getEndTime(s.startTime, props.course.credits)
  return `${s.days.join(' / ')} · ${s.startTime} – ${endTime} · ${s.room}`
})
</script>

<template>
  <div class="course-card" :style="{ borderLeftColor: deptColor }">
    <div class="card-header">
      <AppBadge :color="deptColor" :label="course.code" />
      <AppBadge variant="neutral" :label="course.departmentName" />
    </div>
    
    <h3 class="course-name">{{ course.name }}</h3>
    
    <div class="course-meta">
      <div class="meta-item">
        <User :size="14" :color="deptColor" />
        <span>{{ course.teacher }}</span>
      </div>
      <div class="meta-item">
        <Clock :size="14" :color="deptColor" />
        <span>{{ scheduleText }}</span>
      </div>
    </div>
    
    <p class="course-description">{{ course.description }}</p>
    
    <div class="course-footer">
      <span class="credits-chip">{{ course.credits }} Credits</span>
      <span class="semester-chip">{{ course.semester }}</span>
    </div>
    
    <div class="card-actions">
      <template v-if="!enrollmentStatus">
        <AppButton 
          v-if="canEnroll"
          variant="primary" 
          size="sm"
          @click="emit('enroll', course)"
        >
          Enroll Now
        </AppButton>
        <div v-else>
          <AppButton variant="secondary" size="sm" disabled>
            Credit Limit Reached
          </AppButton>
          <p class="limit-text">{{ creditLimitMessage }}</p>
        </div>
      </template>
      
      <template v-else-if="enrollmentStatus === 'pending'">
        <div class="status-row">
          <AppBadge variant="warning" label="⏳ Pending" />
          <button class="cancel-link" @click="emit('cancelRequest', course)">Cancel Request</button>
        </div>
      </template>
      
      <template v-else-if="enrollmentStatus === 'approved'">
        <div class="status-row">
          <AppBadge variant="success" label="✓ Enrolled" />
          <AppButton variant="primary" size="sm" @click="emit('viewCourse', course)">
            View Course
          </AppButton>
        </div>
      </template>
      
      <template v-else-if="enrollmentStatus === 'rejected'">
        <div class="status-row">
          <AppBadge variant="danger" label="✗ Rejected" />
          <AppButton v-if="canEnroll" variant="primary" size="sm" @click="emit('enroll', course)">
            Request Again
          </AppButton>
          <AppButton v-else variant="secondary" size="sm" disabled>
            Credit Limit Reached
          </AppButton>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.course-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease;
}
.course-card:hover {
  box-shadow: var(--shadow-hover);
}
.card-header {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.course-name {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}
.course-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}
.course-description {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
.course-footer {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.credits-chip, .semester-chip {
  padding: 4px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-body);
}
.card-actions {
  margin-top: 4px;
}
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cancel-link {
  background: none;
  border: none;
  color: var(--danger);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
.cancel-link:hover {
  color: #DC2626;
}
.limit-text {
  font-size: 12px;
  color: var(--danger);
  margin: 6px 0 0 0;
}
</style>
