<script setup>
import { computed } from 'vue'
import { Users, Clock } from 'lucide-vue-next'
import AppBadge from '../common/AppBadge.vue'
import AppButton from '../common/AppButton.vue'
import { getDeptColor, getEndTime } from '../../utils/helpers.js'

const props = defineProps({
  course: { type: Object, required: true },
  enrolledCount: { type: Number, default: 0 },
  pendingCount: { type: Number, default: 0 }
})

const emit = defineEmits(['manage'])

const deptColor = computed(() => getDeptColor(props.course.department))
const scheduleText = computed(() => {
  const s = props.course.schedule
  const endTime = getEndTime(s.startTime, props.course.credits)
  return `${s.days.join(' / ')} · ${s.startTime} – ${endTime} · ${s.room}`
})
</script>

<template>
  <div class="teacher-course-card" :style="{ borderLeftColor: deptColor }">
    <div class="card-header">
      <AppBadge :color="deptColor" :label="course.code" />
      <AppBadge variant="neutral" :label="course.departmentName" />
    </div>
    
    <h3 class="course-name">{{ course.name }}</h3>
    
    <div class="schedule-info">
      <Clock :size="14" :color="deptColor" />
      <span>{{ scheduleText }}</span>
    </div>
    
    <div class="stats-row">
      <div class="stat-item stat-success">
        <Users :size="14" />
        <span>{{ enrolledCount }} enrolled</span>
      </div>
      <div v-if="pendingCount > 0" class="stat-item stat-warning">
        <Clock :size="14" />
        <span>{{ pendingCount }} pending</span>
      </div>
    </div>
    
    <AppButton variant="primary" size="sm" @click="emit('manage', course)">
      Manage Course →
    </AppButton>
  </div>
</template>

<style scoped>
.teacher-course-card {
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
.teacher-course-card:hover {
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
.schedule-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}
.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.stat-success {
  color: var(--success);
}
.stat-warning {
  color: var(--warning);
}
</style>
