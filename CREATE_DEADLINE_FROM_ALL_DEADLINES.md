# Create Deadline from All Deadlines View

## ✨ New Feature

You can now create deadlines directly from the **All Deadlines** view! A course selector dropdown lets you choose which course the deadline belongs to.

## 🎯 What's New

### In All Deadlines View:

1. **"+ New Deadline" button** in the header (burgundy button next to the view toggle)
2. When clicked, shows the deadline creation form
3. Button text changes to "Cancel" when form is open

### Course Selector:

- **Dropdown at the top of the form** shows all your courses
- Format: `Course Code - Course Title` (e.g., "6.1040 - Software Design I")
- Required field with validation
- Once selected, the rest of the form works like normal deadline creation

## 🧪 Testing

1. Go to **All Deadlines** view
2. Click **"+ New Deadline"**
3. Select a course from the dropdown
4. Fill in:
   - Title
   - Due date & time
   - Source (Manual, Website, or Canvas)
5. Click **"Create Deadline"**
6. New deadline appears in the list immediately!

## 🎨 UI Features

- Form appears below the header when button is clicked
- Burgundy gradient button matches the app theme
- Form automatically closes after successful creation
- Validation ensures all fields are filled correctly
- Cancel button closes the form without creating

## 📝 Notes

- The course dropdown only appears when creating from **All Deadlines**
- When creating from a specific course's page, the course is pre-selected (no dropdown)
- All validation rules still apply (title min 3 chars, etc.)
