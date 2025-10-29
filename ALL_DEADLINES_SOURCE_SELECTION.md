# All Deadlines: Source Selection Feature

## ✨ What's New

The "All Deadlines" view now has the **exact same deadline creation experience** as the course-specific view, including all 4 source options!

## 🎯 Features

### 1. Source Selection Screen

When you click **"+ New Deadline"** in All Deadlines, you'll see 4 options:

- ✏️ **Manual Entry** - Create a deadline manually
- 🤖 **AI Parsed** - Extract deadlines from Google Drive documents using AI
- 🌐 **Website** - Import from a website URL
- 📚 **Canvas** - Import from Canvas LMS

### 2. Course Selector

After selecting a source, you'll see a **course dropdown** at the top of the form. This lets you specify which course the deadline belongs to.

### 3. AI Extraction from All Deadlines

The AI extraction now works from the All Deadlines view too! You can:

- Select a course first
- Upload multiple Google Drive documents
- Review and confirm extracted deadlines
- All deadlines are created for the selected course

## 🎨 UI/UX

### Consistent Design

- Same source selection cards as course-specific view
- Purple gradient for "AI Parsed" button
- Responsive grid layout (2x2 on desktop, stacks on mobile)
- Brutalist design with bold borders and shadows

### Flow

1. Click **"+ New Deadline"** → Shows source selection
2. Select a source → Shows form with course dropdown
3. Fill in details → Create deadline
4. Deadline appears in list with correct course info

## 📁 Files Modified

### `AllDeadlinesView.vue`

- Added source selection UI (exact copy from DeadlinesView)
- Integrated AIDeadlineExtractor with course selector
- Added `selectedSource` state
- Added `resetCreateForm()` and `handleAIDeadlinesCreated()` functions
- Added source-selector CSS styles

### `AIDeadlineExtractor.vue`

- Added `courses` and `showCourseSelector` props
- Added course dropdown at top of form
- Added validation for course selection
- Uses selected course when extracting deadlines
- Emits `course-selected` event

### `CreateDeadlineForm.vue`

- Already had course selector support (no changes needed)

## 🧪 Testing

1. Go to **All Deadlines**
2. Click **"+ New Deadline"**
3. You should see 4 source options (just like in course view)
4. Click **"🤖 AI Parsed"**
5. Select a course from dropdown
6. Add Google Drive links
7. Extract and confirm
8. Deadlines appear with correct course!

## 🎉 Result

The All Deadlines view now provides a complete deadline creation experience without needing to navigate to a specific course first!
