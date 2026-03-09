<script setup>
import AppBadge from '../common/AppBadge.vue'
import AppButton from '../common/AppButton.vue'
import { formatDate } from '../../utils/helpers.js'

defineProps({
  request: { type: Object, required: true },
  queueNumber: { type: Number, required: true }
})

const emit = defineEmits(['cancel'])
</script>

<template>
  <div class="request-row">
    <div class="queue-badge">
      #{{ queueNumber }}
    </div>
    <div class="request-info">
      <div class="course-info">
        <span class="course-code">{{ request.courseCode }}</span>
        <span class="course-name">{{ request.courseName }}</span>
      </div>
      <div class="request-meta">
        <span class="credits">{{ request.courseCredits }} credits</span>
        <span class="separator">•</span>
        <span class="date">{{ formatDate(request.requestDate) }}</span>
      </div>
    </div>
    <AppBadge variant="warning" label="Pending" />
    <AppButton variant="ghost" size="sm" @click="emit('cancel', request)">
      Cancel
    </AppButton>
  </div>
</template>

<style scoped>
.request-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.queue-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.request-info {
  flex: 1;
  min-width: 0;
}
.course-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.course-code {
  font-weight: 600;
  color: var(--primary);
  font-size: 14px;
}
.course-name {
  font-weight: 500;
  color: var(--text);
  font-size: 14px;
}
.request-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}
.separator {
  color: var(--border);
}

@media (max-width: 768px) {
  .request-row {
    flex-wrap: wrap;
  }
}
</style>
