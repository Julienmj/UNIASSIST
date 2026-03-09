<script setup>
import { computed } from 'vue'
import AppBadge from '../common/AppBadge.vue'
import AppButton from '../common/AppButton.vue'
import { formatDateTime } from '../../utils/helpers.js'

const props = defineProps({
  request: { type: Object, required: true },
  index: { type: Number, required: true }
})

const emit = defineEmits(['approve', 'reject'])

const initials = computed(() => {
  if (!props.request.studentName) return 'S'
  return props.request.studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
})
</script>

<template>
  <div class="queue-row">
    <div class="queue-number">
      {{ index + 1 }}
    </div>
    
    <div class="student-info">
      <div class="student-avatar">{{ initials }}</div>
      <div class="student-details">
        <div class="student-name">{{ request.studentName }}</div>
        <div class="student-email">{{ request.studentEmail }}</div>
      </div>
    </div>
    
    <div class="course-info">
      <AppBadge variant="info" :label="request.courseCode" />
      <span class="course-name">{{ request.courseName }}</span>
    </div>
    
    <div class="request-date">
      {{ formatDateTime(request.requestDate) }}
    </div>
    
    <div class="actions">
      <AppButton variant="success" size="sm" @click="emit('approve', request)">
        Approve
      </AppButton>
      <AppButton variant="danger" size="sm" @click="emit('reject', request)">
        Reject
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.queue-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border: 1px solid #F1F5F9;
  border-radius: 12px;
}
.queue-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3B82F6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}
.student-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3B82F6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
}
.student-details {
  flex: 1;
  min-width: 0;
}
.student-name {
  font-weight: 600;
  color: #0F172A;
  font-size: 14px;
}
.student-email {
  font-size: 13px;
  color: #6B7280;
}
.course-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.course-name {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.request-date {
  font-size: 13px;
  color: #6B7280;
  white-space: nowrap;
}
.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .queue-row {
    flex-wrap: wrap;
  }
  .student-info {
    min-width: auto;
    flex: 1;
  }
  .course-info {
    width: 100%;
  }
  .actions {
    width: 100%;
  }
}
</style>
