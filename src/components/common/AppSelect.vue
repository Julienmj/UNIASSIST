<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Select...' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="select-wrapper">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <select
      :value="modelValue"
      :class="['select', { 'select-error': error }]"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
.required {
  color: var(--danger);
}
.select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}
.select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
.select-error {
  border-color: var(--danger);
}
.select-error:focus {
  box-shadow: 0 0 0 3px var(--danger-light);
}
.error-text {
  font-size: 13px;
  color: var(--danger);
  margin: 0;
}
</style>
