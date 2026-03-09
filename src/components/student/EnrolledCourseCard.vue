<script setup>
import { computed } from 'vue'
import { User, Clock } from 'lucide-vue-next'
import AppBadge from '../common/AppBadge.vue'
import AppButton from '../common/AppButton.vue'
import { getDeptColor, getEndTime } from '../../utils/helpers.js'

const props = defineProps({
  course: { type: Object, required: true },
  enrollment: { type: Object, required: true }
})

const emit = defineEmits(['viewCourse'])

const deptColor = computed(() => getDeptColor(props.course.department))
const scheduleText = computed(() => {
  const s = props.course.schedule
  const endTime = getEndTime(s.startTime, props.course.credits)
  return `${s.days.join(' / ')} · ${s.startTime} – ${endTime} · ${s.room}`
})
</script>

<template>
  <div class="enrolled-card" :style="{ borderLeftColor: deptColor }">
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
    
    <div class="course-footer">
      <span class="credits-chip">{{ course.credits }} Credits</span>
      <AppButton variant="primary" size="sm" @click="emit('viewCourse', course)">
        View Course
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.enrolled-card {
  background: white;
  border: 1px solid #F1F5F9;
  border-left: 4px solid;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  transition: box-shadow 200ms ease;
}
.enrolled-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.10);
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
  color: #0F172A;
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
  color: #6B7280;
}
.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.credits-chip {
  padding: 4px 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}
</style>
