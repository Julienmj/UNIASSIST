# 🎓 UNIASSIST — University Management Platform

> ⚠️ **This README is a work in progress and will be updated soon.**

UNIASSIST is a web-based university management platform 
that connects students and teachers on one system.

---

## 🚀 Tech Stack

- **Vue 3** — Frontend framework (Composition API, script setup)
- **Vite** — Build tool and dev server
- **Pinia** — Global state management
- **Vue Router** — Client-side navigation
- **Tailwind CSS** — Utility-first styling
- **Lucide Vue** — Icon library
- **LocalStorage** — Data persistence (no backend)

---

## 📁 Project Structure

src/
├── assets/          → Global CSS, fonts, CSS variables
├── components/      → Reusable UI components
│   ├── common/      → Shared: Sidebar, Navbar, Modal, 
│   │                  Button, Badge, Input, Select, Toast
│   ├── student/     → Student-specific components:
│   │                  CourseCard, EnrolledCourseCard,
│   │                  EnrollmentRequestRow
│   └── teacher/     → Teacher-specific components:
│                      TeacherCourseCard, EnrollmentQueueRow
├── views/           → Full pages
│   ├── auth/        → LoginView (landing + auth modal)
│   ├── student/     → StudentDashboard, CourseCatalog,
│   │                  CourseDetail, MyEnrollments, TimetableView
│   └── teacher/     → TeacherDashboard, EnrollmentRequests,
│                      TeacherCourses, CourseManagement,
│                      AnnouncementsView
├── router/          → index.js — all routes + navigation guards
├── stores/          → Pinia stores (state management)
│   ├── auth.js      → Login, register, session, logout
│   ├── courses.js   → Course list, add/remove courses
│   ├── enrollments.js → Enrollment requests, approve/reject
│   ├── assignments.js → File uploads per course
│   └── reminders.js → Teacher announcements and reminders
├── composables/     → useToast.js — toast notification system
└── utils/           → mockData.js (universities, departments)
                       helpers.js (formatDate, calculateEndTime,
                       formatFileSize, safeInt)

---

## 🗂️ How The Stores Work

### auth.js
Manages who is logged in.
- login() — finds user in localStorage, sets session
- register() — creates new user, saves to localStorage
- logout() — clears session
- initFromStorage() — restores session on page refresh
- localStorage key: uniassist_auth, uniassist_registered_users

### courses.js
Manages all courses in the system.
- Courses start empty. Teachers add them.
- addCourse() — teacher adds a course to their list
- removeCourse() — removes course + all its enrollments
- localStorage key: uniassist_courses

### enrollments.js
Manages all enrollment requests between students and teachers.
- submitRequest() — student requests a course
  → checks for duplicates
  → checks 19-credit limit per semester
  → assigns queue number
- approveRequest() — teacher approves
- rejectRequest() — teacher rejects
- cancelRequest() — student cancels
- localStorage key: uniassist_enrollments

### assignments.js
Manages file uploads per course.
- addAssignment() — teacher uploads (stored as base64)
- deleteAssignment() — teacher removes
- Students download via base64 data URL
- localStorage key: uniassist_assignments

### reminders.js
Manages teacher announcements and reminders.
- createReminder() — teacher posts announcement/reminder
- deleteReminder() — teacher removes
- getForStudent() — returns relevant items for a student
- localStorage key: uniassist_reminders

---

## 👥 User Roles

### 🎓 Student
- Register and log in
- Browse courses added by teachers
- Request enrollment (max 19 credits per semester)
- Track pending, approved, rejected enrollments
- Download assignments from enrolled courses
- View weekly timetable
- Read teacher announcements

### 👨🏫 Teacher
- Register and log in
- Add courses from their department
- View enrollment requests in queue order
- Approve or reject requests
- Upload assignments to courses
- Post announcements and reminders

---

## 🔗 How The Two Portals Connect

All data lives in Pinia stores which read/write localStorage.
Both portals share the same store instances in memory.
This means:

Teacher adds course → Student catalog updates instantly
Student requests enrollment → Teacher queue updates instantly  
Teacher approves → Student dashboard updates instantly
Teacher uploads assignment → Student sees it immediately
Teacher posts announcement → Student sees it on dashboard

No backend. No API calls. Pure reactive state.

---

## 🏗️ Departments & Courses

Three departments:
- SE — Software Engineering (blue)
- NC — Networks & Cybersecurity (orange)  
- IM — Information Management (green)

Teachers can only add courses from their own department.
Credits per course: 3 or 4.
Class duration = number of credits in hours.
Max credits per student per semester: 19.

---

## 📦 LocalStorage Keys

| Key | Contents |
|-----|----------|
| uniassist_auth | Current session |
| uniassist_registered_users | All registered users |
| uniassist_courses | All courses added by teachers |
| uniassist_enrollments | All enrollment requests |
| uniassist_assignments | All uploaded assignments |
| uniassist_reminders | All announcements and reminders |
| uniassist_version | Data version for migrations |

---

## ▶️ Running The Project

npm install
npm run dev

Open: http://localhost:5173

---

> 📝 Full documentation coming soon.
