# Testing Guide: Edit Course Feature

## ✅ What We Just Implemented

1. **EditCourseModal.vue** - A styled modal component for editing courses
2. **Updated CourseList.vue** - Added an "Edit" button to each course card
3. **Updated CoursesView.vue** - Wired up the modal and API calls

---

## 🧪 How to Test

### Prerequisites

Make sure both backend and frontend are running:

1. **Backend** (in terminal 1):

```bash
cd Duestack_backend
deno task concepts
```

You should see: `Listening on http://localhost:8000/`

2. **Frontend** (in terminal 2):

```bash
cd Duestack_frontend
npm run dev
```

You should see: `Local: http://localhost:5173/` (or similar port)

---

## 📝 Test Case 1: Edit an Existing Course

### Steps:

1. **Open your browser** to `http://localhost:5173` (or whatever port Vite shows)

2. **Login** with an existing account (or register a new one)

3. **Navigate to Courses** page

   - Click "Courses" in the navigation

4. **Check if you have courses**

   - If not, create a test course:
     - Click "+ New Course"
     - Course Code: `6.1040`
     - Title: `Software Design`
     - Click "Create Course"

5. **Click the "Edit" button** on one of your course cards

   - ✅ A modal should appear with the current course data pre-filled
   - ✅ Modal should have:
     - Title "Edit Course" in Cinzel font
     - Course Code field (pre-filled)
     - Course Title field (pre-filled)
     - "Save Changes" button (burgundy)
     - "Cancel" button (white)
     - Close button (X) in top right

6. **Test the form fields**:

   - Change the Course Code to: `6.1041`
   - Change the Title to: `Advanced Software Design`

7. **Click "Save Changes"**
   - ✅ Button should show "Saving..." while processing
   - ✅ Modal should close automatically
   - ✅ Course card should immediately show the updated information
   - ✅ No page refresh should occur

---

## 📝 Test Case 2: Cancel Editing

### Steps:

1. Click "Edit" on a course card
2. Make some changes to the fields
3. **Click "Cancel" button**
   - ✅ Modal should close
   - ✅ Changes should NOT be saved
   - ✅ Course card should still show original data

### Alternative:

1. Click "Edit" on a course card
2. Make some changes
3. **Click the X button** (top right of modal)
   - ✅ Same behavior as Cancel button

### Another Alternative:

1. Click "Edit" on a course card
2. Make some changes
3. **Click outside the modal** (on the dark overlay)
   - ✅ Modal should close
   - ✅ Changes should NOT be saved

---

## 📝 Test Case 3: Validation

### Steps:

1. Click "Edit" on a course
2. **Clear the Course Code field** (delete all text)
3. Try to submit

   - ✅ Browser should show "Please fill out this field" validation
   - ✅ Form should not submit

4. Type something in Course Code
5. **Clear the Course Title field**
6. Try to submit
   - ✅ Browser should show validation error
   - ✅ Form should not submit

---

## 📝 Test Case 4: Duplicate Course Code

### Steps:

1. Note the course code of one of your courses (e.g., "6.1040")
2. Click "Edit" on a DIFFERENT course
3. Try to change its course code to "6.1040" (the duplicate)
4. Click "Save Changes"
   - ✅ Should show an error message
   - ✅ Error should say something like "Course code already exists"
   - ✅ Modal should stay open
   - ✅ Original course data should not change

---

## 📝 Test Case 5: Backend Error Handling

### Steps:

1. **Stop your backend server** (Ctrl+C in terminal 1)
2. In the browser, click "Edit" on a course
3. Make changes
4. Click "Save Changes"
   - ✅ Should show an error alert
   - ✅ Error message should indicate failure
5. **Restart backend**: `deno task concepts`
6. Try editing again
   - ✅ Should work normally now

---

## 📝 Test Case 6: Multiple Courses

### Steps:

1. Create 3-4 courses with different codes and titles
2. Edit the FIRST course
   - ✅ Should work
3. Edit the SECOND course
   - ✅ Should work
4. Edit the LAST course
   - ✅ Should work
5. Verify each course shows its correct updated information

---

## 🎨 Visual Design Checklist

Check that the styling matches your visual design study:

- ✅ Modal has black 2px border
- ✅ Modal has black box shadow (8px offset)
- ✅ Modal background is white
- ✅ Modal title uses Cinzel font
- ✅ Edit button uses white background with black border
- ✅ Save button uses burgundy (#760806) background
- ✅ Cancel button uses white background
- ✅ Input fields have 2px borders
- ✅ Input focus state shows burgundy border
- ✅ Hover effects work smoothly
- ✅ Modal has fade-in animation
- ✅ Modal has slide-up animation

---

## 🐛 Common Issues & Solutions

### Issue 1: Modal doesn't appear

**Solution:** Check browser console (F12) for errors. Make sure EditCourseModal is imported correctly.

### Issue 2: Changes don't save

**Solution:**

- Check backend is running on http://localhost:8000
- Check Network tab in browser DevTools for API errors
- Verify your session is still valid (try logging out and back in)

### Issue 3: Buttons don't work

**Solution:** Check that all event handlers are wired up correctly in CoursesView.vue

### Issue 4: Edit button doesn't show

**Solution:**

- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check that CourseList.vue has the emit declaration updated

### Issue 5: Modal styling looks wrong

**Solution:**

- Check that main.css is loading (check Network tab)
- Verify CSS variables are defined (--burgundy, --white, etc.)
- Check for CSS conflicts in browser DevTools

---

## 📸 What to Look For (Visual Confirmation)

Your Courses page should now look like this:

### Before clicking Edit:

- Each course card has THREE buttons:
  1. "View Deadlines" (yellow background)
  2. "Edit" (white background) ← NEW!
  3. "×" delete button (top right)

### After clicking Edit:

- Dark overlay appears (60% opacity black)
- White modal appears in center of screen
- Modal has:
  - Black border and shadow
  - "Edit Course" title (Cinzel font)
  - Two input fields (pre-filled)
  - Two buttons at bottom
  - X button at top right

### After saving:

- Modal disappears
- Course card updates immediately
- No page reload

---

## ✨ Success Criteria

You can mark this feature as complete if:

1. ✅ Edit button appears on all course cards
2. ✅ Modal opens when clicking Edit
3. ✅ Modal shows current course data
4. ✅ Form fields are editable
5. ✅ Save button updates the course
6. ✅ Changes appear immediately after saving
7. ✅ Cancel button works (discards changes)
8. ✅ X button works (same as cancel)
9. ✅ Clicking outside modal works (same as cancel)
10. ✅ Form validation prevents empty submissions
11. ✅ Duplicate course codes are rejected
12. ✅ Error messages appear when things fail
13. ✅ Styling matches visual design study
14. ✅ No console errors

---

## 🎯 Next Steps After Testing

Once you've confirmed everything works:

1. **Commit your changes**:

```bash
git add .
git commit -m "feat: add edit course functionality with styled modal"
```

2. **Move on to next feature**: Edit Deadline (similar pattern!)

3. **Update your user journey** to include editing courses

---

## 📞 Need Help?

If something doesn't work:

1. Check the browser console (F12) for errors
2. Check the backend terminal for errors
3. Verify both servers are running
4. Try clearing browser cache and reloading
5. Check the Network tab to see if API calls are being made

Remember: Test after EVERY change! That's the "baby steps" approach the assignment recommends. 🎯
