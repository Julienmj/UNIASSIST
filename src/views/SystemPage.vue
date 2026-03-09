<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import LoginView from './auth/LoginView.vue'

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isAuthenticated)
</script>

<template>
  <div class="system-page">
    <LoginView v-if="!isLoggedIn" />
    <RouterView v-else />
  </div>
</template>

<style scoped>
.system-page {
  min-height: calc(100vh - 64px);
  margin-top: 64px;
}
</style>
