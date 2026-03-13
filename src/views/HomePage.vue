<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { initTextSize, getCurrentTextSize } from '../utils/textSize.js'
import { BookOpen, ClipboardCheck, Calendar, Upload, Bell, Award, GraduationCap, Users, BookMarked, Target } from 'lucide-vue-next'

const router = useRouter()

// Initialize text size
initTextSize()

// Force HomePage to use larger text sizes
const homePageScale = ref(1.75)

function updateHomePageScale() {
  const currentSize = getCurrentTextSize()
  const scales = {
    small: 1.5,      // Small appears as Large
    normal: 1.75,    // Normal appears as Extra Large  
    large: 2.0,       // Large appears as Huge
    extraLarge: 2.25, // Extra Large appears even larger
    huge: 2.5         // Huge appears massive
  }
  homePageScale.value = scales[currentSize] || 1.75
  document.documentElement.style.setProperty('--homepage-text-scale', homePageScale.value)
}

// Watch for text size changes
let lastSize = getCurrentTextSize()
setInterval(() => {
  const currentSize = getCurrentTextSize()
  if (currentSize !== lastSize) {
    lastSize = currentSize
    updateHomePageScale()
  }
}, 100)

// Listen for custom text size events
window.addEventListener('textSizeChanged', updateHomePageScale)

onMounted(() => {
  updateHomePageScale()
})

function goToSystem() {
  router.push('/system')
}
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="pill-label">
          <span class="pill-icon">🎓</span>
          <span class="pill-text">University Management Platform</span>
        </div>
        
        <h1 class="hero-title">
          <div class="title-line-1">
            <span class="title-highlight">Manage</span> Your University
          </div>
          <div class="title-line-2">
            Experience <span class="title-highlight">Smarter</span>
          </div>
        </h1>
        
        <p class="hero-subtitle">
          UNIASSIST connects students and teachers on one platform.
          Enroll in courses, manage assignments, and stay informed.
        </p>
        
        <div class="cta-buttons">
          <button class="cta-btn primary" @click="goToSystem">
            <span class="btn-icon">🚀</span>
            Get Started
          </button>
          <button class="cta-btn ghost" @click="goToSystem">
            <span class="btn-icon">📚</span>
            Learn More
          </button>
        </div>
      </div>
    </section>
    
    <section class="stats-section">
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">👥</span>
          </div>
          <div class="stat-content">
            <div class="stat-number">2</div>
            <div class="stat-label">User Roles</div>
            <div class="stat-desc">Students & Teachers</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">📚</span>
          </div>
          <div class="stat-content">
            <div class="stat-number">6+</div>
            <div class="stat-label">Core Features</div>
            <div class="stat-desc">Complete Management</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">🎯</span>
          </div>
          <div class="stat-content">
            <div class="stat-number">100%</div>
            <div class="stat-label">Success Rate</div>
            <div class="stat-desc">User Satisfaction</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">🎓</span>
          </div>
          <div class="stat-content">
            <div class="stat-number">19</div>
            <div class="stat-label">Max Credits</div>
            <div class="stat-desc">Per Semester</div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features-section">
      <h2 class="section-title">Everything You Need</h2>
      <p class="section-subtitle">One platform for the complete university experience</p>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon blue">
            <BookOpen :size="24" color="white" />
          </div>
          <h3 class="feature-title">Course Enrollment</h3>
          <p class="feature-text">Browse available courses and request enrollment with one click.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon green">
            <ClipboardCheck :size="24" color="white" />
          </div>
          <h3 class="feature-title">Smart Approval</h3>
          <p class="feature-text">Teachers review requests in queue order. Fair and transparent.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon purple">
            <Calendar :size="24" color="white" />
          </div>
          <h3 class="feature-title">Visual Timetable</h3>
          <p class="feature-text">See your weekly schedule in a clear color-coded grid.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon orange">
            <Upload :size="24" color="white" />
          </div>
          <h3 class="feature-title">Assignments</h3>
          <p class="feature-text">Teachers upload files. Students download instantly.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon red">
            <Bell :size="24" color="white" />
          </div>
          <h3 class="feature-title">Announcements</h3>
          <p class="feature-text">Stay updated with reminders and announcements from teachers.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon yellow">
            <Award :size="24" color="white" />
          </div>
          <h3 class="feature-title">Credit Tracking</h3>
          <p class="feature-text">Automatic 19-credit limit tracking per semester.</p>
        </div>
      </div>
    </section>
    
    <section class="cta-section">
      <div class="cta-banner">
        <h2 class="cta-title">Ready to Get Started?</h2>
        <p class="cta-subtitle">Join UNIASSIST and manage your university experience.</p>
        <button class="cta-button" @click="goToSystem">
          Go to System →
        </button>
      </div>
    </section>
    
    <footer class="home-footer">
      <div class="footer-left">
        <div class="footer-logo">
          <div class="logo-square">
            <GraduationCap :size="16" color="white" />
          </div>
          <span class="brand-uni">UNI</span><span class="brand-assist">ASSIST</span>
        </div>
        <p class="footer-text">© 2025 UNIASSIST. All rights reserved.</p>
      </div>
      <div class="footer-right">
        <p class="footer-text">Built for African Universities</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  background: var(--bg);
  position: relative;
}

.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(var(--border) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.3;
  pointer-events: none;
}

.hero-section {
  padding: 80px 48px;
  padding-top: 96px;
  text-align: center;
  position: relative;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.pill-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  color: #3B82F6;
  border: 1px solid #BFDBFE;
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;
}

.pill-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.pill-label:hover::before {
  left: 100%;
}

.pill-icon {
  font-size: 14px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

.pill-text {
  color: #3B82F6;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-title {
  margin: 0;
  margin-bottom: 32px;
  line-height: 1.1;
  font-weight: 800;
  text-align: center;
}

.title-line-1 {
  font-size: calc(30px * var(--homepage-text-scale)) !important;
  color: var(--text);
  margin-bottom: 8px;
  font-weight: 800;
  line-height: 1.1;
}

.title-line-2 {
  font-size: calc(30px * var(--homepage-text-scale)) !important;
  color: var(--text);
  font-weight: 800;
  line-height: 1.1;
}

.hero-subtitle {
  margin-top: 20px;
  font-size: calc(11px * var(--homepage-text-scale)) !important;
  color: var(--text-muted);
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

.cta-buttons {
  margin-top: 36px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.cta-btn {
  border-radius: 12px;
  padding: 14px 32px;
  font-size: calc(14px * var(--homepage-text-scale)) !important;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms;
  border: none;
  min-height: 48px; /* Touch-friendly */
}

.cta-btn.primary {
  background: #3B82F6;
  color: white;
}

.cta-btn.primary:hover {
  background: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59,130,246,0.35);
}

.cta-btn.ghost {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text-body);
  font-weight: 500;
}

.cta-btn.ghost:hover {
  border-color: #3B82F6;
  color: #3B82F6;
}

.stats-section {
  padding: 0 48px 80px;
  position: relative;
}

.stats-card {
  max-width: 800px;
  margin: 0 auto;
  background: var(--surface);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 32px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}

.stat-number {
  font-size: calc(15px * var(--homepage-text-scale)) !important;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: calc(9px * var(--homepage-text-scale)) !important;
  color: var(--text-muted);
  margin-top: 4px;
}

.stat-desc {
  font-size: calc(8px * var(--homepage-text-scale)) !important;
  color: var(--text-muted);
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: var(--border);
}

.features-section {
  padding: 80px 48px;
  position: relative;
}

.section-title {
  text-align: center;
  font-size: calc(13px * var(--homepage-text-scale)) !important;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.section-subtitle {
  text-align: center;
  font-size: calc(9px * var(--homepage-text-scale)) !important;
  color: var(--text-muted);
  margin: 8px 0 0 0;
}

.features-grid {
  max-width: 1200px;
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 300ms ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3B82F6, #10B981, #8B5CF6, #F97316, #EF4444);
  opacity: 0;
  transition: opacity 300ms ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon.blue { background: #3B82F6; }
.feature-icon.green { background: #10B981; }
.feature-icon.purple { background: #8B5CF6; }
.feature-icon.orange { background: #F97316; }
.feature-icon.red { background: #EF4444; }
.feature-icon.yellow { background: #EAB308; }

.feature-title {
  font-size: calc(15px * var(--homepage-text-scale)) !important;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px 0;
}

.feature-text {
  font-size: calc(9px * var(--homepage-text-scale)) !important;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.cta-section {
  padding: 80px 48px;
  position: relative;
}

.cta-banner {
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  border-radius: 24px;
  padding: 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.title-highlight {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  position: relative;
}

.cta-title {
  font-size: calc(15px * var(--homepage-text-scale)) !important;
  font-weight: 700;
  color: white;
  margin: 0;
}

.cta-subtitle {
  font-size: calc(9px * var(--homepage-text-scale)) !important;
  color: rgba(255,255,255,0.8);
  margin: 8px 0 0 0;
}

.cta-button {
  background: white;
  color: #3B82F6;
  border: none;
  border-radius: 16px;
  padding: 16px 40px;
  font-size: calc(11px * var(--homepage-text-scale)) !important;
  font-weight: 700;
  cursor: pointer;
  transition: all 300ms ease;
  min-height: 52px; /* Touch-friendly */
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(59,130,246,0.3);
}

.home-footer {
  margin-top: 80px;
  padding: 32px 48px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Responsive layout adjustments only */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stats-card {
    flex-direction: column;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 20px;
  }
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-square {
  width: 28px;
  height: 28px;
  background: #3B82F6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-uni {
  color: #3B82F6;
  font-weight: 700;
  font-size: 16px;
}

.brand-assist {
  color: var(--text);
  font-weight: 700;
  font-size: 16px;
}

.footer-text {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }
  
  .stats-card {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-banner {
    padding: 32px 24px;
  }
  
  .home-footer {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .footer-left {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
