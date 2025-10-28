# User Journey - Final Submission (Oct 28, 2025)

## User Journey: Tim Manages MIT Course Deadlines

**User:** Tim, an MIT junior taking 6.1040 and 6.3700

**Goal:** Organize and track deadlines across multiple courses with a comprehensive management system

### Journey Steps:

1. **Account Creation**

   - Tim visits DueStack and clicks "Register"
   - He enters his name (Tim The Beaver), email (timthebeaver@mit.edu), username (tim), and password
   - The system creates his account and logs him in automatically

2. **Adding Courses**

   - Tim navigates to the "Courses" page
   - He clicks "+ New Course" and creates his first course:
     - Course Code: 6.1040
     - Title: Software Design
   - He repeats this for his second course:
     - Course Code: 6.3700
     - Title: Introduction to Probability
   - Both courses appear in a clean grid view

3. **Editing Course Information**

   - Tim notices a typo in his course title
   - He clicks "Edit" on the 6.3700 course card
   - In the modal, he updates the title to "Introduction to Probability and Statistics"
   - The course information updates immediately without page refresh

4. **Managing Deadlines for 6.1040**

   - Tim clicks "View Deadlines" on the 6.1040 course card
   - He clicks "+ New Deadline" and adds:
     - Title: Assignment 4b: Frontend Complete
     - Due Date: October 28, 2025, 11:59 PM
     - Source: Manual Entry
   - He adds another deadline:
     - Title: Assignment 5: Beta Release
     - Due Date: November 4, 2025, 11:59 PM
     - Source: Manual Entry
   - The deadlines appear sorted by due date with the nearest deadline first

5. **Editing Deadline Information**

   - Tim realizes the due date for Assignment 5 changed
   - He clicks "Edit" on the deadline card
   - In the modal, he updates the due date to November 6, 2025
   - The deadline updates immediately and resorts in the list

6. **Managing Deadlines for 6.3700**

   - Tim goes back to Courses and clicks "View Deadlines" on 6.3700
   - He adds several problem set deadlines with their due dates
   - Each deadline is automatically organized chronologically

7. **Tracking Progress**

   - Tim returns to his 6.1040 deadlines
   - For "Assignment 4b: Frontend Complete", he changes the status from "Not Started" to "In Progress" using the dropdown
   - The deadline's left border turns yellow to indicate work in progress
   - After completing his work, he marks it as "Done"
   - The completed deadline shows with a strikethrough, grayed out appearance, and moves to the end of the list

8. **Viewing All Deadlines Across Courses**

   - Tim clicks "All Deadlines" in the navigation bar
   - He sees a unified view of all his deadlines from both courses

9. **Filtering and Sorting Deadlines**

   - In the All Deadlines view, Tim uses the filter bar to:
     - Filter by course (e.g., only 6.1040 deadlines)
     - Filter by status (e.g., only "In Progress" deadlines)
     - Filter by time (e.g., "Next 7 Days")
   - He sorts deadlines by "Date: Latest First" to see what's coming up furthest out
   - He clicks "Clear Filters" to see everything again
   - Completed ("Done") deadlines always appear at the end of the list

10. **Using Calendar View**

    - Tim clicks the "📅 Calendar" toggle button
    - He sees all his deadlines displayed on an interactive monthly calendar
    - Color-coded dots indicate deadline status:
      - 🔴 Red: Not Started
      - 🟡 Yellow: In Progress
      - 🔵 Royal Blue: Overdue
      - ⚫ Gray: Completed
    - The calendar legend explains the color system
    - When Tim clicks on a date, he sees all deadlines for that day in a panel on the right
    - Each deadline shows its course badge, title, due time, status dropdown, and edit button
    - Overdue deadlines are clearly marked with an "Overdue" badge
    - Tim can change deadline status or edit details directly from the calendar view
    - He uses the month navigation arrows to plan ahead

11. **Managing Workload**
    - Tim can see at a glance which deadlines are overdue (blue border and "Overdue" badge)
    - He can see which assignments are in progress (yellow left border)
    - He can see which are not started (red left border)
    - He can see which are completed (grayed out with strikethrough)
    - Both the list view and calendar view keep him informed of his schedule
    - He can delete deadlines if they're cancelled or duplicates

### Outcome

Tim now has a comprehensive deadline management system. He can:

- Organize all his course deadlines in one place
- Track progress on each assignment with visual status indicators
- View deadlines in both list format (with advanced filtering/sorting) and calendar format
- Edit courses and deadlines as information changes
- See his entire semester at a glance using the calendar view
- Filter and sort to focus on specific courses, statuses, or time periods
- Manage his workload effectively across multiple MIT courses

---

## Features Implemented

### Core Functionality

- ✅ User authentication (register, login, logout)
- ✅ Course management (create, view, edit, delete)
- ✅ Deadline management (create, view, edit, delete, update status)
- ✅ Cross-course deadline aggregation

### Enhanced Features

- ✅ **Edit Course**: Modal interface for updating course information
- ✅ **Edit Deadline**: Modal interface for updating deadline details
- ✅ **All Deadlines View**: Unified view of deadlines across all courses
- ✅ **Advanced Filtering**: Filter by course, status, and time range
- ✅ **Flexible Sorting**: Sort by date (earliest/latest first)
- ✅ **Smart Ordering**: Completed deadlines automatically move to the end
- ✅ **Calendar View**: Interactive monthly calendar with color-coded deadline dots
- ✅ **View Toggle**: Switch between list and calendar views
- ✅ **Visual Status Indicators**: Color-coded borders and badges for deadline status
- ✅ **Overdue Detection**: Automatic detection and marking of overdue deadlines
- ✅ **Reactive Updates**: All changes reflect immediately without page refresh

### Visual Design

- ✅ Cohesive styling with burgundy accent color (#760806)
- ✅ Cinzel serif font for headings, clean sans-serif for body text
- ✅ Brutalist-inspired design with black borders and drop shadows
- ✅ Responsive layout with breakpoints for desktop, tablet, and mobile
- ✅ Accessible color contrast and visual hierarchy

## Current Scope

The current implementation focuses on manual deadline entry and comprehensive deadline management features. Future enhancements could include:

- AI-powered deadline extraction from uploaded syllabi and documents
- Document management system
- Canvas integration for automatic deadline syncing
- Email/push notifications for upcoming deadlines
- Team collaboration features
