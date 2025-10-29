# Source Selection: Row Layout

## ✨ Layout Change

Changed the source selection from a **2x2 grid** to a **single row** with 4 cards side-by-side.

## 🎨 New Layout

### Before (Grid):

```
[Manual Entry]  [AI Parsed]
[Website]       [Canvas]
```

### After (Row):

```
[Manual Entry]  [AI Parsed]  [Website]  [Canvas]
```

## 📱 Responsive Behavior

- **Desktop**: All 4 cards in a single row, each taking equal space
- **Mobile/Tablet**: Cards wrap to multiple rows as needed (`flex-wrap: wrap`)
- **Min Width**: Each card has a minimum width of 150px to stay readable

## 🔧 Technical Changes

### CSS Updates:

```css
.source-options {
  display: flex; /* Changed from grid */
  gap: 1rem;
  flex-wrap: wrap; /* Allow wrapping on small screens */
}

.source-option {
  flex: 1; /* Each card takes equal space */
  min-width: 150px; /* Minimum width before wrapping */
  /* ... other styles ... */
}
```

## 📁 Files Modified:

1. `DeadlinesView.vue` - Source options for course-specific deadlines
2. `AllDeadlinesView.vue` - Source options for all deadlines view

## 🧪 Testing:

1. Refresh your browser
2. Go to any course → Click "+ New Deadline"
3. You should see all 4 options in a row!
4. Try resizing the window - cards wrap gracefully
