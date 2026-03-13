<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  hint: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const showPassword = ref(false)
const inputType = ref(props.type)

function togglePassword() {
  showPassword.value = !showPassword.value
  inputType.value = showPassword.value ? 'text' : 'password'
}
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-container">
      <input
        :type="type === 'password' ? inputType : type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="['input', { 'input-error': error }]"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur')"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="password-toggle"
        @click="togglePassword"
      >
        <Eye v-if="!showPassword" :size="18" />
        <EyeOff v-else :size="18" />
      </button>
    </div>
    <p v-if="error" class="error-text">{{ error }}</p>
    <p v-else-if="hint" class="hint-text">{{ hint }}</p>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label {
  font-size: calc(var(--text-font-size) * 0.875) !important;
  font-weight: 500;
  color: var(--text);
}
.required {
  color: var(--danger);
}
.input-container {
  position: relative;
}
.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--text-font-size) !important;
  transition: all 0.2s;
  background: var(--surface);
  color: var(--text);
}
.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
.input-error {
  border-color: var(--danger);
}
.input-error:focus {
  box-shadow: 0 0 0 3px var(--danger-light);
}
.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
.password-toggle:hover {
  color: var(--text);
}
.error-text {
  font-size: calc(var(--text-font-size) * 0.75) !important;
  color: var(--danger);
  margin: 0;
}
.hint-text {
  font-size: calc(var(--text-font-size) * 0.75) !important;
  color: var(--text-muted);
  margin: 0;
}
</style>
