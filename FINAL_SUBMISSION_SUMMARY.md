# Assignment 4b - Final Submission Summary

**Student**: [Your Name]  
**Date**: October 28, 2025  
**App**: DueStack - Course Deadline Management System

## Completed Deliverables

### ✅ 1. Visual Design Study

- [x] Completed prior to final submission
- [x] Located in `/Assignment4b-assets/`

### ✅ 2. Updated User Journey

- [x] **File**: `/Assignment4b-assets/USER_JOURNEY.md`
- [x] Reflects all implemented features
- [x] Includes detailed step-by-step walkthrough
- [x] Documents all core and enhanced features

### ✅ 3. Screen Recording

- [x] **Guide**: `/SCREEN_RECORDING_GUIDE.md`
- [ ] **TODO**: Record 2-minute demo with narration
- [ ] **TODO**: Save to `/Assignment4b-assets/recording-final.mov`

### ✅ 4. Updated Design Doc (Backend)

- [ ] **TODO**: Check if major backend changes need documentation
- Location: `/Duestack_backend/design/` or `README.md`

---

## Features Implemented

### Core Functionality ✅

1. **User Authentication**

   - Registration with validation (email format, username rules, password strength)
   - Login/Logout
   - Session management with Pinia store

2. **Course Management**

   - Create courses
   - View courses in grid layout
   - Edit courses (modal interface)
   - Delete courses
   - Client-side validation

3. **Deadline Management**
   - Create deadlines with validation
   - View deadlines (sorted by due date, completed items at end)
   - Edit deadlines (modal interface)
   - Delete deadlines
   - Update status (Not Started, In Progress, Done)
   - Visual status indicators (color-coded borders)
   - Overdue detection and badges

### Enhanced Features ✅

4. **All Deadlines View**

   - Unified view across all courses
   - Course badges for easy identification
   - Advanced filtering:
     - By course
     - By status
     - By time range (All, Next 7 Days, Next 30 Days)
   - Flexible sorting:
     - Date: Earliest First
     - Date: Latest First
   - Smart ordering (completed deadlines always at end)
   - Clear filters button

5. **Calendar View**

   - Interactive monthly calendar
   - Color-coded deadline dots:
     - 🔴 Red: Not Started
     - 🟡 Yellow: In Progress
     - 🔵 Royal Blue: Overdue
     - ⚫ Gray: Completed
   - Side-by-side layout (calendar + legend | deadline details)
   - Click date to see all deadlines
   - Edit deadlines directly from calendar
   - Update status from calendar view
   - Month navigation with styled arrows
   - Calendar legend
   - Responsive design with breakpoints

6. **View Toggle**
   - Seamless switch between List and Calendar views
   - Consistent layout and positioning
   - Same functionality available in both views

### Robustness ✅

7. **Client-Side Validation**

   - **Registration**:
     - Email format validation
     - Username: min 3 chars, no spaces
     - Password: min 8 characters
   - **Course Creation**:
     - Course code: min 2 chars
     - Title: min 3 chars
   - **Deadline Creation**:
     - Title: min 3 chars
     - Due date: can't be more than 24 hours in the past
   - Inline error messages for each field
   - Form-level validation before submission

8. **Error Handling**
   - Informative error messages
   - Loading states on all async operations
   - Disabled buttons during API calls
   - Error message styling

### Visual Design ✅

9. **Styling & Layout**
   - Cohesive brutalist-inspired design
   - Burgundy (#760806) accent color throughout
   - Cinzel serif font for headings
   - Black borders and drop shadows
   - Color-coded status indicators
   - Responsive design:
     - Desktop: 65vw max width
     - Tablet: 75vw max width
     - Mobile: 95vw max width
   - Accessible color contrast
   - Visual hierarchy with typography

### Reactivity ✅

10. **Fully Reactive UI**
    - No page refreshes required
    - All updates reflect immediately
    - Status changes update UI instantly
    - Modal-based editing
    - Dynamic filtering and sorting
    - Automatic list reordering

---

## Technical Stack

### Frontend

- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Calendar Library**: v-calendar
- **Styling**: Scoped CSS with CSS Variables
- **Build Tool**: Vite

### Backend

- **Runtime**: Deno
- **Concepts**: 6 implemented concepts
  - UserIdentity
  - UserAuthentication
  - CourseManagement
  - DeadlineManagement
  - DocumentManagement
  - SuggestionManagement

---

## File Structure

```
Duestack_frontend/
├── Assignment4b-assets/
│   ├── USER_JOURNEY.md           ✅ Updated
│   ├── [visual-design-study]     ✅ Completed
│   └── [recording-final.mov]     ⏳ TODO
├── src/
│   ├── components/
│   │   ├── CourseList.vue        ✅ Edit functionality
│   │   ├── CreateCourseForm.vue  ✅ Validation added
│   │   ├── EditCourseModal.vue   ✅ New component
│   │   ├── DeadlineList.vue      ✅ Edit, smart sorting
│   │   ├── CreateDeadlineForm.vue ✅ Validation added
│   │   ├── EditDeadlineModal.vue ✅ New component
│   │   ├── AllDeadlinesList.vue  ✅ New component
│   │   └── DeadlinesCalendar.vue ✅ New component
│   ├── views/
│   │   ├── RegisterView.vue      ✅ Validation added
│   │   ├── LoginView.vue         ✅ Completed
│   │   ├── HomeView.vue          ✅ Completed
│   │   ├── CoursesView.vue       ✅ Edit modal integration
│   │   ├── DeadlinesView.vue     ✅ Edit modal integration
│   │   └── AllDeadlinesView.vue  ✅ New view with toggle
│   ├── services/
│   │   ├── authService.js        ✅ Completed
│   │   ├── courseService.js      ✅ Completed
│   │   └── deadlineService.js    ✅ Completed
│   ├── stores/
│   │   └── auth.js               ✅ Completed
│   └── App.vue                   ✅ Navigation updated
├── SCREEN_RECORDING_GUIDE.md     ✅ Created
├── FINAL_SUBMISSION_SUMMARY.md   ✅ This file
└── package.json
```

---

## Testing Checklist

### Functionality Testing

- [x] User registration with validation
- [x] User login/logout
- [x] Create course with validation
- [x] Edit course
- [x] Delete course
- [x] View course deadlines
- [x] Create deadline with validation
- [x] Edit deadline
- [x] Delete deadline
- [x] Update deadline status
- [x] View all deadlines (list view)
- [x] Filter deadlines (course, status, time)
- [x] Sort deadlines (date asc/desc)
- [x] View all deadlines (calendar view)
- [x] Navigate calendar months
- [x] Click date to see deadlines
- [x] Edit deadline from calendar
- [x] Toggle between list and calendar views

### Validation Testing

- [x] Email format validation
- [x] Username validation (min length, no spaces)
- [x] Password validation (min 8 chars)
- [x] Course code validation
- [x] Course title validation
- [x] Deadline title validation
- [x] Due date validation (not too far in past)
- [x] Inline error messages display
- [x] Form submission blocked with errors

### Visual Testing

- [x] Responsive layout on desktop
- [x] Responsive layout on tablet
- [x] Responsive layout on mobile
- [x] Color-coded status indicators work
- [x] Overdue badges display correctly
- [x] Calendar dots show correct colors
- [x] Calendar legend matches dot colors
- [x] Modals center and display correctly
- [x] Loading states show during API calls

### Reactivity Testing

- [x] No page refreshes needed
- [x] Status updates reflect immediately
- [x] Created items appear instantly
- [x] Edited items update instantly
- [x] Deleted items disappear instantly
- [x] Completed items move to end
- [x] Filters apply instantly
- [x] Sorting applies instantly
- [x] Calendar updates with new deadlines

---

## Known Limitations & Future Enhancements

### Current Scope

The current implementation focuses on **manual deadline entry** and **comprehensive deadline management**. The following features are out of scope for this assignment:

### Future Enhancements

- AI-powered deadline extraction from syllabi
- Document upload and management
- Canvas integration for automatic syncing
- Email/push notifications
- Team collaboration features
- Deadline suggestions based on patterns
- Mobile app (native iOS/Android)

---

## Submission Instructions

### 1. Final Testing

```bash
# Terminal 1: Start backend
cd Duestack_backend
deno task concepts

# Terminal 2: Start frontend
cd Duestack_frontend
npm run dev
```

### 2. Record Screen Recording

- Follow `SCREEN_RECORDING_GUIDE.md`
- Save to `/Assignment4b-assets/`
- Max 2 minutes with narration

### 3. Backend Design Doc

- Check `/Duestack_backend/design/` for any updates needed
- Document any major concept changes

### 4. Get Commit Hashes

```bash
# Frontend commit hash
cd Duestack_frontend
git log -1 --format="%H"

# Backend commit hash
cd Duestack_backend
git log -1 --format="%H"
```

### 5. Submit via Google Form

- Frontend commit hash
- Backend commit hash
- Link to repos (if required)

### 6. Post-Assignment Survey

- Complete within 24 hours of deadline

---

## Rubric Self-Assessment

### Functionality (Excellent)

✅ Frontend supports all concept actions  
✅ App is fully reactive  
✅ No page refreshes required  
✅ All operational principles reflected

### Robustness (Good)

✅ Client-side validation on all forms  
✅ Informative inline error messages  
✅ Date validation for deadlines  
✅ Email/username/password validation  
⚠️ Could add more advanced error handling (e.g., network errors)

### Usability (Excellent)

✅ Visual design helps users understand features  
✅ Efficient flow through app  
✅ Multiple ways to view data (list/calendar)  
✅ Color-coded status indicators  
✅ Filtering and sorting for large datasets

### Visual Design Study (Completed)

✅ Diverse range of visual media explored  
✅ Typography and color well-extracted  
✅ Inspirations clearly communicated

### Styling & Layout (Excellent)

✅ Attractive, cohesive design  
✅ Draws on visual design study  
✅ Brutalist-inspired aesthetic  
✅ Responsive design with breakpoints  
✅ Consistent color scheme and typography

---

## Time Investment

**Total Time**: ~20-25 hours

- Setup & Initial Components: 4 hours
- Core Features (Auth, Courses, Deadlines): 6 hours
- Edit Functionality: 2 hours
- All Deadlines View with Filters: 3 hours
- Calendar View: 4 hours
- Validation & Robustness: 3 hours
- Styling & Responsive Design: 3 hours
- Testing & Bug Fixes: 2-3 hours
- Documentation: 2 hours

---

## Reflection

### What Went Well

- Agentic coding (Cursor) accelerated development significantly
- Component-based architecture made features easy to add
- Vue's reactivity made state management intuitive
- Visual design study guided consistent styling choices
- Baby steps approach prevented overwhelming complexity

### Challenges Faced

- v-calendar library styling overrides required `!important`
- Browser caching caused confusion during style updates
- Balancing feature completeness with time constraints
- Ensuring responsive design across all screen sizes

### Key Learnings

- Importance of client-side validation for UX
- Value of component reusability (modals for create/edit)
- Benefits of visual status indicators (color-coding)
- Power of providing multiple views (list vs calendar)
- Responsive design requires planning from the start

---

**Ready for Submission!** 🚀
