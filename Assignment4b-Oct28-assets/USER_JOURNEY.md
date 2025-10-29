# User Journey - Final Submission (Oct 28, 2025)

## User Journey: Tim Uses AI-Powered Deadline Extraction

**User:** Tim, an MIT junior taking 6.1040, 6.3700, and 6.4610

**Goal:** Efficiently organize and track deadlines across multiple courses using AI-powered extraction from various document sources

### Journey Steps:

1. **Account Creation**

   - Tim visits DueStack and clicks "Register"
   - He enters his name (Tim The Beaver), email (timthebeaver@mit.edu), username (tim), and password
   - The system creates his account and logs him in automatically

2. **Adding Courses**

   - Tim navigates to the "Courses" page
   - He clicks "+ New Course" and creates his three courses:
     - Course Code: 6.1040, Title: Software Design
     - Course Code: 6.3700, Title: Introduction to Probability
     - Course Code: 6.4610, Title: Database Systems
   - All three courses appear in a clean grid view with their unique mascot avatars

3. **AI Document Extraction for 6.3700 (Multiple Documents)**

   - Tim clicks "Manage Deadlines" on the 6.3700 course card
   - He clicks "+ New Deadline" and selects "AI Document Extraction"
   - He uploads two Google Drive links:
     - The course syllabus (PDF)
     - The course calendar document (PDF)
   - In the custom instructions field, he adds: "Focus on problem sets only due after 10/28"
   - He clicks "Extract Deadlines"
   - The AI processes both documents and extracts 8 problem set deadlines
   - Tim reviews the extracted deadlines and sees they appear in the format "PS1 Due", "PS2 Due", etc.

4. **Refining Extracted Deadlines**

   - Tim wants cleaner formatting for the problem set names
   - In the "AI Refinement" section, he types: "Reformat pset names to 'PSET 1', 'PSET 2', etc."
   - He clicks "Refine"
   - The AI re-processes the documents with the new instructions
   - The deadlines now appear as "PSET 1", "PSET 2", "PSET 3", etc. with proper formatting
   - Tim selects all the deadlines he wants to keep
   - He clicks "Confirm 6 Deadlines"
   - The deadlines are added to his 6.3700 course instantly

5. **AI Document Extraction for 6.4610 (Canvas Screenshot)**

   - Tim goes back to Courses and clicks "Manage Deadlines" on 6.4610
   - He clicks "+ New Deadline" and selects "AI Document Extraction"
   - He uploads a Google Drive link to a PNG screenshot of his Canvas assignments page
   - The AI successfully reads the image and extracts all visible assignments with their due dates
   - Tim reviews the extracted deadlines, selects the ones he wants
   - He clicks "Confirm" and they're added to his 6.4610 course

6. **AI Website Extraction for 6.1040**

   - Tim clicks "Manage Deadlines" on the 6.1040 course card
   - He clicks "+ New Deadline" and selects "AI Website Extraction"
   - He pastes the URL to the 6.1040 class schedule page: `https://61040-fa25.github.io/schedule`
   - In the custom instructions, he adds: "Extract all assignments, team proeject work and preps after 10/28"
   - He clicks "Extract Deadlines"
   - The AI scrapes the website and extracts all assignments, problem sets, and prep exercises
   - Tim sees 19 deadlines extracted, each labeled with "AI-PARSED" and a document icon linking back to the source website
   - He reviews them, noting that some show "100% confident" while others show lower confidence
   - He selects all high-confidence deadlines and a few medium-confidence ones
   - He clicks "Confirm 15 Deadlines"
   - The deadlines are immediately added to his 6.1040 course

7. **Viewing All Deadlines with AI Extraction Info**

   - Tim clicks "All Deadlines" in the navigation bar
   - He sees a unified view of all his deadlines from all three courses
   - AI-extracted deadlines display with "AI-PARSED" badges
   - Each AI-extracted deadline has a document icon
   - When he clicks the icon on a 6.1040 deadline, it opens the class schedule webpage in a new tab
   - When he clicks the icon on a 6.3700 deadline with multiple sources, a dialog shows both Google Drive links

8. **Managing Deadlines Across Courses**

   - Tim uses the filter bar to view only "6.1040" deadlines
   - He changes the filter to "Next 7 Days" to see what's coming up soon
   - He marks several assignments as "In Progress" using the status dropdowns
   - The color-coded borders update instantly (yellow for in progress, red for not started)

9. **Calendar View Integration**

   - Tim clicks the "Calendar" toggle button
   - He sees all his deadlines from all three courses displayed on an interactive monthly calendar
   - Color-coded dashes indicate deadline status
   - The calendar legend shows the color system
   - When Tim clicks on a specific date, a panel on the right shows all deadlines for that day
   - Each deadline shows its course badge (e.g., "(6.1040)"), title, and source tag
   - AI-extracted deadlines show "AI-PARSED" with the document icon
   - He can edit or update status directly from the calendar view

10. **Bulk Management**

    - In the All Deadlines list view, Tim clicks "Select Multiple"
    - Checkboxes appear next to each deadline
    - He selects all completed 6.1040 assignments from early October
    - He clicks "Change Status" → "Done"
    - All selected deadlines are marked as completed, turn gray with strikethrough, and move to the bottom of the list
    - Later, he selects some old test deadlines and clicks "Delete Selected"
    - They're removed from his dashboard immediately

11. **Editing Course Information**

    - Tim notices he wants to update the 6.3700 course title
    - He clicks "Edit" on the course card
    - In the modal, he updates the title to "Introduction to Probability and Statistics"
    - The course information updates immediately without page refresh

### Outcome

Tim now has a comprehensive, AI-powered deadline management system. He can:

- **Automatically extract deadlines** from multiple sources:
  - PDF documents (syllabi, calendars) via Google Drive
  - Image screenshots (Canvas, other platforms)
  - Course websites (class schedule pages)
- **Process multiple documents at once** for better extraction accuracy
- **Refine extractions** with custom prompts to reformat or filter deadlines
- **Track source documents** with clickable links to original materials
- Organize all his course deadlines in one place
- Track progress on each assignment with visual status indicators
- View deadlines in both list format (with advanced filtering/sorting) and calendar format
- Edit courses and deadlines as information changes
- Use bulk actions to manage multiple deadlines efficiently
- See his entire semester at a glance using the calendar view
- Manage his workload effectively across multiple MIT courses

---

## Features Implemented

### Core Functionality

- ✅ User authentication (register, login, logout)
- ✅ Course management (create, view, edit, delete)
- ✅ Deadline management (create, view, edit, delete, update status)
- ✅ Cross-course deadline aggregation

### AI-Powered Extraction Features

- **AI Document Extraction**: Upload multiple Google Drive documents (PDFs, images) for deadline extraction
- **AI Website Extraction**: Extract deadlines directly from course schedule webpages
- **Multi-Document Processing**: Process multiple PDFs in a single extraction for cross-referencing
- **Custom Prompts**: Add specific instructions for initial extraction (e.g., "focus on problem sets only")
- **AI Refinement**: Post-extraction editing with prompts (e.g., "reformat pset names to PSET 1")
- **Source Tracking**: Clickable document icons that link back to original source materials
- **Confidence Scoring**: AI provides confidence levels (high/medium/low) for each extracted deadline
- **Multi-source Support**: Google Drive PDFs, Google Drive images (PNG, JPG, etc.), Public course websites
- **Selective Confirmation**: Review and choose which extracted deadlines to add

### Enhanced Management Features

- **Edit Course**: Modal interface for updating course information
- **Edit Deadline**: Modal interface for updating deadline details
- **All Deadlines View**: Unified view of deadlines across all courses
- **Advanced Filtering**: Filter by course, status, and time range
- **Flexible Sorting**: Sort by date (earliest/latest first)
- **Smart Ordering**: Completed deadlines automatically move to the end
- **Bulk Actions**: Select multiple deadlines to delete or change status
- **Calendar View**: Interactive monthly calendar with color-coded deadline indicators
- **View Toggle**: Switch between list and calendar views
- **Visual Status Indicators**: Color-coded borders and badges for deadline status
- **Overdue Detection**: Automatic detection and marking of overdue deadlines
- **Course-specific Deadlines**: View and manage deadlines for individual courses
- **Reactive Updates**: All changes reflect immediately without page refresh

### Visual Design

- Cohesive styling with burgundy accent color (#760806)
- Cinzel serif font for headings, clean sans-serif for body text
- Brutalist-inspired design with black borders and drop shadows
- Purple gradient buttons for AI-powered features
- Responsive layout with breakpoints for desktop, tablet, and mobile
- Accessible color contrast and visual hierarchy
- Status-based color coding (red, yellow, blue, gray)

## Technical Implementation

### Frontend Stack

- **Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia stores for authentication
- **Routing**: Vue Router with dynamic routes
- **HTTP Client**: Axios for API calls
- **Calendar**: v-calendar library for interactive calendar view
- **Styling**: Scoped CSS with CSS variables for theming

### Backend Integration

- **AI Service**: Google Gemini 2.0 Flash for multimodal understanding
- **File Processing**: Gemini File API for document uploads
- **Web Scraping**: Cheerio + Undici for website content extraction
- **Structured Output**: JSON schema validation for reliable AI responses
- **MIME Detection**: Automatic detection of document types (PDF, images, etc.)

### Key Concepts

- **SuggestionManagement**: Handles AI extraction, refinement, and confirmation of deadline suggestions
- **DeadlineManagement**: Manages confirmed deadlines with CRUD operations
- **CourseManagement**: Handles course creation, editing, and organization
- **UserAuthentication**: Session-based auth with secure password hashing

## Current Scope

The current implementation focuses on AI-powered deadline extraction from multiple sources and comprehensive deadline management. The system now includes:

- Full AI document extraction pipeline
- Multi-document processing capabilities
- Website scraping and extraction
- Post-extraction refinement with custom prompts
- Source document tracking and linking
- Comprehensive deadline management with filtering, sorting, and bulk actions
- Calendar and list view toggles
- Complete course management system

Future enhancements could include:

- Canvas LMS API integration for automatic syncing
- Email/push notifications for upcoming deadlines
- Team collaboration features
- Mobile app
- Deadline recommendations based on workload
- Integration with other course management systems
