# 🎓 UNIASSIST — Complete University Management Platform

A comprehensive web-based university management system that connects students and teachers in one unified platform. 

It is built with modern Vue.js for a seamless educational experience

## � Live Demo

**live demo link**: [https://uniassistapp.netlify.app/](https://uniassistapp.netlify.app/)

## �📋 Table of Contents

- [🚀 Tech Stack](#-tech-stack)
- [🎯 Project Overview](#-project-overview)
- [📁 Complete File Structure](#-complete-file-structure)
- [🔧 Core Components Explained](#-core-components-explained)
- [🗂️ State Management (Pinia Stores)](#️-state-management-pinia-stores)
- [👥 User Roles & Features](#-user-roles--features)
- [🔄 Data Flow & System Logic](#-data-flow--system-logic)
- [🎨 UI/UX Features](#-uiux-features)
- [🚀 Getting Started](#-getting-started)
- [📦 Deployment](#-deployment)
- [🛠️ Development Guide](#️-development-guide)
- [🔍 Troubleshooting](#-troubleshooting)

This also has diagrams as required in the system

---

## 🚀 Tech Stack

### Frontend Framework
- **Vue 3** - Modern JavaScript framework with Composition API
- **Vite** - Fast build tool and development server
- **Vue Router 5** - Client-side routing with navigation guards

### State Management & Storage
- **Pinia** - Intuitive state management (Vuex successor)
- **LocalStorage** - Client-side data persistence (no backend required)

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide Vue** - Beautiful icon library
- **CSS Variables** - Theme switching (light/dark mode)

### Development Tools
- **ESLint** - Code quality and consistency
- **Hot Module Replacement** - Instant development feedback

---

## 🎯 Project Overview

UNIASSIST is a **full-featured university management system** that simulates real-world educational workflows:

### 🎓 For Students
- **Registration & Authentication** - Create accounts with university details
- **Course Discovery** - Browse available courses across departments
- **Enrollment Management** - Request courses, track approval status
- **Academic Dashboard** - View enrolled courses, credits, progress
- **Assignment Downloads** - Access course materials and files
- **Timetable Management** - Weekly schedule visualization
- **Announcements** - Receive updates from enrolled course teachers

### 👨‍🏫 For Teachers
- **Course Management** - Create and manage department courses
- **Enrollment Control** - Review and approve student requests
- **Content Delivery** - Upload assignments and course materials
- **Communication** - Post announcements and reminders
- **Student Analytics** - Track enrollment numbers and course capacity

### 🏗️ System Features
- **Multi-department Support** - Software Engineering, Networks & Cybersecurity, Information Management
- **Credit System** - 19-credit limit per semester with course credit tracking
- **Queue Management** - First-come-first-served enrollment processing
- **Real-time Updates** - Instant UI updates across all user sessions
- **Theme Support** - Light and dark mode with smooth transitions
- **Responsive Design** - Works on desktop, tablet, and mobile devices

---

## 📁 Complete File Structure

```
uniassist/
├── public/                    # Static assets (favicon, etc.)
├── src/
│   ├── assets/               # Global styles and resources
│   │   └── main.css        # CSS variables, themes, utility classes
│   ├── components/           # Reusable Vue components
│   │   ├── common/          # Shared across all pages
│   │   │   ├── AppButton.vue      # Styled button component
│   │   │   ├── AppCard.vue        # Card container component
│   │   │   ├── AppInput.vue       # Form input with validation
│   │   │   ├── AppModal.vue       # Modal dialog component
│   │   │   ├── AppSelect.vue      # Dropdown select component
│   │   │   ├── AppSidebar.vue     # Navigation sidebar
│   │   │   ├── AppToast.vue       # Notification system
│   │   │   └── SharedNavbar.vue  # Top navigation bar
│   │   ├── student/         # Student-specific components
│   │   │   ├── CourseCard.vue           # Course catalog card
│   │   │   ├── EnrolledCourseCard.vue   # Dashboard course card
│   │   │   └── EnrollmentRequestRow.vue  # Enrollment request display
│   │   └── teacher/         # Teacher-specific components
│   │       ├── TeacherCourseCard.vue    # Teacher's course card
│   │       └── EnrollmentQueueRow.vue   # Enrollment request management
│   ├── composables/         # Reusable composition functions
│   │   └── useToast.js     # Toast notification system
│   ├── router/              # Vue Router configuration
│   │   └── index.js        # All routes and navigation guards
│   ├── stores/              # Pinia state management
│   │   ├── announcements.js  # Teacher announcements
│   │   ├── assignments.js     # Course file uploads
│   │   ├── auth.js          # User authentication
│   │   ├── courses.js       # Course catalog management
│   │   ├── enrollments.js   # Student enrollment requests
│   │   ├── reminders.js     # Teacher reminders
│   │   └── theme.js         # Theme management
│   ├── utils/               # Utility functions
│   │   ├── helpers.js       # Date/time, file size helpers
│   │   └── mockData.js      # Universities, departments data
│   ├── views/               # Page-level Vue components
│   │   ├── auth/           # Authentication pages
│   │   │   └── LoginView.vue     # Login/registration modal
│   │   ├── student/        # Student pages
│   │   │   ├── CourseCatalog.vue     # Browse available courses
│   │   │   ├── CourseDetail.vue       # Course information page
│   │   │   ├── MyEnrollments.vue     # Track enrollment status
│   │   │   ├── StudentDashboard.vue  # Main student dashboard
│   │   │   └── TimetableView.vue     # Weekly schedule
│   │   ├── teacher/        # Teacher pages
│   │   │   ├── AnnouncementsView.vue   # Create announcements
│   │   │   ├── CourseManagement.vue    # Course creation/editing
│   │   │   ├── EnrollmentRequests.vue # Manage student requests
│   │   │   ├── TeacherCourses.vue     # Teacher's course list
│   │   │   └── TeacherDashboard.vue  # Main teacher dashboard
│   │   ├── HomePage.vue      # Landing page
│   │   └── SystemPage.vue   # System information
│   ├── App.vue             # Root Vue component
│   └── main.js             # Application entry point
├── index.html              # HTML template
├── netlify.toml           # Deployment configuration
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite build configuration
```

---

## 🔧 Core Components Explained

### 🎨 UI Components

#### `AppButton.vue`
**Purpose**: Reusable button with multiple variants
**Props**: 
- `variant`: 'primary', 'secondary', 'ghost', 'success', 'danger'
- `size`: 'sm', 'md', 'lg'
- `loading`: Show loading state
**Features**: Hover effects, disabled states, loading spinner

#### `AppCard.vue`
**Purpose**: Container component for content sections
**Features**: Consistent spacing, shadows, borders, responsive design

#### `AppModal.vue`
**Purpose**: Modal dialog for confirmations and forms
**Props**: `show`, `title`, `variant`, `confirm-text`
**Features**: Backdrop click to close, escape key support, custom variants

#### `AppToast.vue`
**Purpose**: Notification system for user feedback
**Types**: success, error, info, warning
**Features**: Auto-dismiss, manual close, theme-aware colors

#### `AppSidebar.vue`
**Purpose**: Main navigation for authenticated users
**Features**: Role-based menu items, active state indicators, responsive collapse

### 📱 Page Components

#### `StudentDashboard.vue`
**Purpose**: Main hub for students
**Features**:
- Course enrollment statistics
- Credit progress tracking
- Recent announcements and reminders
- Quick course access
- Academic metrics display

#### `TeacherDashboard.vue`
**Purpose**: Main hub for teachers
**Features**:
- Course management overview
- Enrollment request queue
- Student statistics
- Quick actions for common tasks

#### `CourseCatalog.vue`
**Purpose**: Student course discovery
**Features**:
- Filter by department
- Search functionality
- Course details display
- One-click enrollment requests

---

## 🗂️ State Management (Pinia Stores)

### `auth.js` - Authentication Store
**Purpose**: User login, registration, and session management

**State**:
```javascript
{
  currentUser: null,        // Logged-in user object
  role: null,             // 'student' or 'teacher'
  isAuthenticated: false   // Login status
}
```

**Key Functions**:
- `login(email, password, role, university)` - Authenticates user
- `register(formData, role)` - Creates new user account
- `logout()` - Clears session and redirects
- `initFromStorage()` - Restores session on page load

**Data Storage**: 
- `uniassist_auth` - Current session
- `uniassist_registered_users` - All user accounts

### `courses.js` - Course Management Store
**Purpose**: Course catalog and teacher course management

**State**:
```javascript
{
  courses: []  // Array of course objects
}
```

**Course Object Structure**:
```javascript
{
  id: 'course_123',
  code: 'SE101',
  name: 'Introduction to Programming',
  department: 'SE',
  credits: 3,
  description: '...',
  schedule: { days: ['Mon', 'Wed'], time: '09:00-12:00', room: 'Lab 1' },
  teacherId: 'teacher_456',
  capacity: 30,
  semester: 'Year 1 Semester 1'
}
```

**Key Functions**:
- `addCourse(courseData)` - Teacher adds new course
- `removeCourse(courseId)` - Remove course and related data
- `getCoursesByTeacher(teacherId)` - Get teacher's courses
- `getCoursesByIds(courseIds)` - Get multiple courses by ID

### `enrollments.js` - Enrollment Management Store
**Purpose**: Student enrollment requests and approval workflow

**Enrollment Object**:
```javascript
{
  id: 'enroll_789',
  studentId: 'student_123',
  studentName: 'John Doe',
  courseId: 'course_456',
  courseCode: 'SE101',
  courseName: 'Intro to Programming',
  teacherId: 'teacher_789',
  status: 'pending',  // 'pending', 'approved', 'rejected'
  requestedAt: '2024-01-15T10:30:00Z',
  queueNumber: 3,
  semester: 'Year 1 Semester 1',
  courseCredits: 3,
  notes: ''
}
```

**Key Functions**:
- `submitRequest(enrollmentData)` - Student requests enrollment
- `approveRequest(requestId, notes)` - Teacher approves request
- `rejectRequest(requestId, notes)` - Teacher rejects request
- `cancelRequest(requestId)` - Student cancels pending request

**Business Logic**:
- 19-credit limit per semester enforcement
- Queue number assignment for fair processing
- Duplicate request prevention
- Automatic course capacity checking

### `announcements.js` - Teacher Announcements Store
**Purpose**: Teacher-to-student communication system

**Announcement Object**:
```javascript
{
  id: 'ann_123',
  title: 'Midterm Exam Schedule',
  message: 'Exam will be held next week...',
  teacherId: 'teacher_456',
  teacherName: 'Dr. Smith',
  courseId: 'course_789',  // null for 'all students'
  target: 'course',        // 'all' or 'course'
  pinned: false,
  createdAt: '2024-01-15T10:30:00Z'
}
```

**Key Functions**:
- `createAnnouncement(data)` - Teacher creates announcement
- `deleteAnnouncement(id)` - Remove announcement
- `getForStudent(enrolledCourseIds)` - Get relevant announcements for student

### `assignments.js` - File Management Store
**Purpose**: Course material and assignment uploads

**Assignment Object**:
```javascript
{
  id: 'assign_123',
  courseId: 'course_456',
  fileName: 'lecture_notes.pdf',
  fileSize: 2048576,
  fileType: 'application/pdf',
  uploadedAt: '2024-01-15T10:30:00Z',
  uploadedBy: 'teacher_789',
  base64Data: 'data:application/pdf;base64,...'
}
```

**Key Functions**:
- `addAssignment(courseId, file)` - Upload file (converted to base64)
- `deleteAssignment(id)` - Remove assignment
- `getByCourse(courseId)` - Get all course materials

---

## 👥 User Roles & Features

### 🎓 Student Role

#### Registration & Authentication
- **Account Creation**: Full name, email, password, university, department
- **Login System**: Email/password authentication with role selection
- **Session Management**: Persistent login across browser sessions

#### Academic Management
- **Course Browsing**: Filter by department, search by name/code
- **Enrollment Requests**: One-click requests with credit tracking
- **Status Tracking**: Real-time updates on pending/approved/rejected requests
- **Credit Management**: Visual progress bars for semester credit limits

#### Learning Tools
- **Dashboard**: Overview of enrolled courses, credits, announcements
- **Course Materials**: Download assignments and resources
- **Timetable**: Weekly schedule view with time blocks
- **Announcements**: Receive updates from enrolled course teachers

### 👨‍🏫 Teacher Role

#### Course Management
- **Course Creation**: Add courses within department restrictions
- **Template System**: Pre-defined course structures for efficiency
- **Course Editing**: Update details, schedule, capacity
- **Course Removal**: Safe deletion with enrollment cleanup

#### Student Management
- **Enrollment Queue**: First-come-first-served request processing
- **Approval Workflow**: Review requests with notes and decisions
- **Capacity Management**: Monitor course enrollment limits
- **Student Analytics**: Track enrollment numbers and demographics

#### Communication Tools
- **Announcements**: Targeted messages (all students or specific courses)
- **Pinned Messages**: Important announcements stay at top
- **Reminders**: Time-sensitive notifications with expiration dates
- **File Sharing**: Upload assignments and course materials

---

## 🔄 Data Flow & System Logic

### Real-time Data Synchronization
All data is stored in **LocalStorage** but managed through **Pinia stores**, creating a reactive system:

1. **Teacher adds course** → `courses.js` updates → All UI components using course data refresh instantly
2. **Student requests enrollment** → `enrollments.js` updates → Teacher dashboard shows new request
3. **Teacher approves request** → Status changes → Student dashboard updates immediately
4. **File upload** → Base64 conversion → Available to all enrolled students
5. **Teacher posts announcement** → Student dashboard shows it immediately

### Business Rules Implementation

#### Credit System
```javascript
// Maximum 19 credits per semester
const semesterCredits = approvedCourses.reduce((sum, course) => sum + course.credits, 0)
if (semesterCredits + newCourseCredits > 19) {
  // Prevent enrollment
}
```

#### Queue Management
```javascript
// First-come-first-served processing
const queueNumber = existingRequests.length + 1
enrollments.sort((a, b) => a.queueNumber - b.queueNumber)
```

#### Department Restrictions
```javascript
// Teachers can only add courses from their department
if (course.department !== teacher.department) {
  // Prevent course creation
}
```

### Data Persistence Strategy
- **Immediate Save**: Every state change triggers LocalStorage update
- **Version Control**: Data versioning for migration support
- **Error Recovery**: Graceful handling of corrupted data
- **Cross-tab Sync**: Multiple tabs see same data in real-time

---

## 🎨 UI/UX Features

### Theme System
- **Light/Dark Mode**: Smooth theme switching with CSS variables
- **Persistent Preference**: Theme choice saved in LocalStorage
- **System Detection**: Respects OS theme preference by default

### Responsive Design
- **Mobile-First**: Optimized for small screens
- **Adaptive Layout**: Sidebar collapses on mobile
- **Touch-Friendly**: Large tap targets and gestures

### Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color schemes

### Micro-interactions
- **Loading States**: Visual feedback during operations
- **Hover Effects**: Interactive element feedback
- **Transitions**: Smooth animations and state changes
- **Toast Notifications**: Non-intrusive user feedback

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Modern browser** - Chrome, Firefox, Safari, Edge

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/Julienmj/UNIASSIST.git
cd UNIASSIST
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Application**
```
http://localhost:5173
```

### Available Scripts

```json
{
  "dev": "vite",           // Development server with HMR
  "build": "vite build",    // Production build
  "preview": "vite preview"  // Preview production build
}
```

### Development Workflow
1. **Make Changes**: Edit components, styles, or logic
2. **See Results**: Browser updates automatically (Hot Module Replacement)
3. **Test Features**: Create test accounts and workflows
4. **Debug Issues**: Use browser dev tools and Vue DevTools

---

## 📦 Deployment

### Netlify Deployment (Recommended)

1. **Prepare for Production**
```bash
npm run build
```

2. **Deploy to Netlify**
- Push code to GitHub repository
- Connect Netlify to GitHub
- Auto-deploy on every push to main branch

3. **Configuration Files**
- `netlify.toml` - Build settings and Node.js version
- `vite.config.js` - Build configuration

### Manual Deployment

1. **Build Project**
```bash
npm run build
```

2. **Deploy `dist` Folder**
- Upload contents of `dist/` folder to web server
- Ensure server supports single-page application routing

### Environment Variables
- `NODE_VERSION=20` - Required for Vite compatibility
- No other environment variables needed (localStorage-based)

---

## 🛠️ Development Guide

### Adding New Features

#### 1. Create New Component
```vue
<!-- src/components/NewComponent.vue -->
<script setup>
// Component logic here
</script>

<template>
  <!-- Component template here -->
</template>

<style scoped>
/* Component styles here */
</style>
```

#### 2. Add New Store
```javascript
// src/stores/newStore.js
import { defineStore } from 'pinia'

export const useNewStore = defineStore('newStore', {
  state: () => ({
    data: []
  }),
  actions: {
    addData(item) {
      this.data.push(item)
      // Save to localStorage if needed
    }
  }
})
```

#### 3. Add New Route
```javascript
// src/router/index.js
{
  path: '/new-page',
  component: () => import('../views/NewPage.vue'),
  meta: { role: 'student' } // or 'teacher' or { public: true }
}
```

### Code Style Guidelines

#### Vue Components
- Use **Composition API** with `<script setup>`
- Follow **single-file component** structure
- Use **scoped styles** to prevent conflicts
- Implement **props validation** for better debugging

#### State Management
- Keep stores **focused and single-purpose**
- Use **computed properties** for derived state
- Implement **error handling** for localStorage operations
- Follow **consistent naming conventions**

#### Styling
- Use **Tailwind utility classes** for rapid development
- Define **CSS variables** for theme consistency
- Implement **responsive design** from mobile-first approach
- Use **semantic HTML** for accessibility

### Testing Workflows

#### Manual Testing Checklist
1. **Authentication**: Test login, registration, logout
2. **Role-based Access**: Verify student/teacher permissions
3. **Data Persistence**: Check localStorage functionality
4. **Responsive Design**: Test on different screen sizes
5. **Theme Switching**: Verify light/dark mode functionality
6. **Cross-browser**: Test on Chrome, Firefox, Safari

#### Common Test Scenarios
- Student enrollment workflow
- Teacher course management
- File upload/download
- Announcement creation and display
- Credit limit enforcement

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Build Errors
**Problem**: `crypto.hash is not a function`
**Solution**: Use Node.js 20+ (configured in netlify.toml)

**Problem**: Build fails on Netlify
**Solution**: Check Node.js version and build command in netlify.toml

#### Runtime Issues
**Problem**: Data not persisting
**Solution**: Check localStorage permissions and browser settings

**Problem**: Components not updating
**Solution**: Verify Pinia store imports and reactive data usage

#### Development Issues
**Problem**: Hot reload not working
**Solution**: Restart dev server and check for syntax errors

**Problem**: Styles not applying
**Solution**: Check Tailwind CSS imports and CSS variable definitions

### Debugging Tools

#### Vue DevTools
- Install Vue DevTools browser extension
- Inspect component state and Pinia stores
- Track component reactivity and performance

#### Browser Console
- Check for JavaScript errors
- Monitor network requests (should be minimal)
- Verify localStorage operations

#### LocalStorage Inspector
- Use browser dev tools → Application → Local Storage
- Verify data structure and content
- Clear corrupted data if needed

### Performance Optimization

#### Build Optimization
- **Code Splitting**: Automatic with Vue Router lazy loading
- **Tree Shaking**: Vite removes unused code
- **Asset Optimization**: Images and fonts optimized

#### Runtime Performance
- **Reactive Data**: Minimize unnecessary reactivity
- **Computed Properties**: Cache expensive calculations
- **Event Listeners**: Clean up properly on unmount

---

## 📚 Learning Resources

### Vue.js Documentation
- [Vue 3 Official Guide](https://vuejs.org/guide/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia State Management](https://pinia.vuejs.org/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

### Vite Build Tool
- [Vite Guide](https://vitejs.dev/guide/)
- [Configuration](https://vitejs.dev/config/)

---

## 🤝 Contributing Guidelines

### Before Contributing
1. **Fork** the repository
2. **Create** feature branch from main
3. **Test** thoroughly before submitting
4. **Follow** code style guidelines

### Pull Request Process
1. **Update** README if adding features
2. **Test** on multiple browsers
3. **Document** any breaking changes
4. **Submit** PR with clear description

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons
- Netlify for seamless deployment

## 👥 Contributors

- **Julien Mugisha** - Project Lead & Developer
- **Mutabazi Hans** -  Developer

---

## 📞 Support & Contact

For questions, issues, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/Julienmj/UNIASSIST/issues)
- **Email**: julienmugisha1@gmail.com

---

**Built with ❤️ for the education community**
