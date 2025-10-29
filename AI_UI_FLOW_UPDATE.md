# AI Extraction UI Flow - Updated Design

## 🎨 New User Flow

### Before (Old Design)

- Separate "🤖 AI Extract" and "+ New Deadline" buttons
- AI extraction was a separate workflow

### After (New Design)

- Single "+ New Deadline" button
- Source selection happens first
- **Selecting "AI Parsed" opens the AI extraction interface**
- Removed "Syllabus" and "Image" options (now handled by AI Parsed)

---

## 🔄 Updated Workflow

### Step 1: Click "+ New Deadline"

User clicks the "+ New Deadline" button on the deadlines page

### Step 2: Select Source

Four options appear as large, clickable cards:

- **✏️ Manual Entry** - Traditional form
- **🤖 AI Parsed** - AI extraction interface (purple gradient)
- **🌐 Website** - Manual form with Website source
- **📚 Canvas** - Manual form with Canvas source

### Step 3A: If "AI Parsed" Selected

- Shows the full AI extraction interface
- User can enter multiple PDF URLs
- Extract, review suggestions, and confirm

### Step 3B: If Other Source Selected

- Shows traditional deadline creation form
- Source is pre-selected (hidden dropdown)
- User enters title and due date manually

---

## 💡 Key Changes

### Removed Options

- ❌ **Syllabus** - Now handled by AI Parsed
- ❌ **Image** - Now handled by AI Parsed
- ❌ Separate "AI Extract" button

### Added Features

- ✅ **Source selection screen** - Clean, card-based UI
- ✅ **Unified workflow** - One entry point for all deadline types
- ✅ **Visual distinction** - AI Parsed has purple gradient styling
- ✅ **Pre-selected source** - No dropdown in manual form when source is chosen

---

## 🎯 Benefits

1. **Clearer User Intent**: User declares upfront how they want to create the deadline
2. **Reduced Confusion**: No more separate AI button vs New Deadline button
3. **Better Organization**: Source selection is the first decision point
4. **Simplified Options**: Removed redundant "Syllabus" and "Image" (both are AI Parsed)
5. **Visual Hierarchy**: AI Parsed stands out with purple gradient

---

## 📸 UI Elements

### Source Selector Card

```
┌────────────────────────────────────────────┐
│  Select Deadline Source                    │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ ✏️       │ │ 🤖       │ │ 🌐       │  │
│  │ Manual   │ │ AI       │ │ Website  │  │
│  │ Entry    │ │ Parsed   │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘  │
│                                            │
│  ┌──────────┐                              │
│  │ 📚       │                              │
│  │ Canvas   │                              │
│  │          │                              │
│  └──────────┘                              │
└────────────────────────────────────────────┘
```

### AI Parsed Button (Purple Gradient)

- Background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- White text
- Stands out from other options

---

## 🔧 Technical Implementation

### Files Modified

**Frontend:**

1. `/Duestack_frontend/src/views/DeadlinesView.vue`

   - Removed separate AI Extract button
   - Added source selection screen
   - Conditionally renders AIDeadlineExtractor or CreateDeadlineForm

2. `/Duestack_frontend/src/components/CreateDeadlineForm.vue`
   - Added `source` prop
   - Hides source dropdown when source is pre-selected
   - Removed "Syllabus" and "Image" from dropdown options

### New State Variables

```javascript
const selectedSource = ref(null); // 'MANUAL', 'AI_PARSED', 'WEBSITE', 'CANVAS'
```

### New Functions

```javascript
function toggleCreateForm() {
  showCreateForm.value = !showCreateForm.value;
  if (!showCreateForm.value) {
    selectedSource.value = null;
  }
}

function resetCreateForm() {
  showCreateForm.value = false;
  selectedSource.value = null;
}
```

---

## 🎬 Testing the New Flow

1. **Navigate to a course's deadlines page**
2. **Click "+ New Deadline"**
3. **Verify source selection screen appears** with 4 options
4. **Click "🤖 AI Parsed"**
5. **Verify AI extraction interface appears**
6. **Enter PDF URL and extract**
7. **Confirm deadlines**
8. **Click "+ New Deadline" again**
9. **Click "✏️ Manual Entry"**
10. **Verify traditional form appears** (no source dropdown)

---

## ✨ Visual Design

### Source Option Cards

- Grid layout (responsive)
- 2px black border
- 2px black shadow on hover
- Hover effect: translate and shadow increase
- Large, centered emoji icons
- Clear labeling

### AI Parsed Card (Special)

- Purple gradient background
- White text
- Same hover effects
- Visually distinct from other options

---

This updated design makes the AI extraction feature feel like a natural part of the deadline creation flow, rather than a separate feature bolted on!
