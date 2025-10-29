# ✅ Edit Deadline Feature - Testing Guide

## 🎉 What We Just Implemented

1. **EditDeadlineModal.vue** - Modal component for editing deadlines
2. **Updated DeadlineList.vue** - Added "Edit" button to each deadline card
3. **Updated DeadlinesView.vue** - Wired up the modal and API calls

---

## 🧪 Quick Test (2 minutes)

### Prerequisites:

Make sure both servers are running:

**Terminal 1 - Backend:**

```bash
cd Duestack_backend
deno task concepts
```

**Terminal 2 - Frontend:**

```bash
cd Duestack_frontend
npm run dev
```

---

## 📝 Test Steps

### 1. Navigate to Deadlines

1. Open `http://localhost:5173` in your browser
2. Login to your account
3. Go to "Courses" page
4. Click "View Deadlines" on any course
   - If you don't have deadlines, create one first:
     - Click "+ New Deadline"
     - Title: `Test Assignment`
     - Due: Pick a date/time
     - Source: `Manual Entry`
     - Click "Create Deadline"

### 2. Test Edit Button Appears

- ✅ Each deadline card should now have an **"Edit" button** (white background, black border)
- ✅ It should be positioned next to the status dropdown

### 3. Test Opening the Modal

1. Click "Edit" on any deadline
2. **Check that the modal appears with:**
   - ✅ Dark overlay background
   - ✅ White modal box with black border and shadow
   - ✅ Title "Edit Deadline" (Cinzel font)
   - ✅ **Three form fields:**
     - **Title** (pre-filled with current title)
     - **Due Date & Time** (pre-filled with current date/time)
     - **Source** (dropdown pre-selected with current source)
   - ✅ "Save Changes" button (burgundy)
   - ✅ "Cancel" button (white)
   - ✅ X button (top right)

### 4. Test Editing the Deadline

1. Change the **Title** to: `Updated Assignment Title`
2. Change the **Due Date** to a different date/time
3. Change the **Source** to: `Syllabus`
4. Click "Save Changes"

**Expected Results:**

- ✅ Button shows "Saving..." while processing
- ✅ Modal closes automatically
- ✅ Deadline card immediately shows updated information
- ✅ No page refresh occurs
- ✅ Deadline is still sorted correctly by due date

### 5. Test Cancel Functionality

1. Click "Edit" on a deadline
2. Make some changes to the fields
3. Click "Cancel"

**Expected Results:**

- ✅ Modal closes
- ✅ Changes are NOT saved
- ✅ Deadline still shows original data

**Also test:**

- Click the **X button** → Same as Cancel
- Click **outside the modal** (on dark overlay) → Same as Cancel

### 6. Test Validation

1. Click "Edit" on a deadline
2. **Clear the Title field** (delete all text)
3. Try to submit

**Expected:**

- ✅ Browser shows "Please fill out this field"
- ✅ Form does not submit

### 7. Test Date/Time Picker

1. Click "Edit" on a deadline
2. Click on the **Due Date & Time** field
3. **Expected:**
   - ✅ Native date/time picker appears
   - ✅ Current date/time is pre-selected
   - ✅ You can pick a new date and time

### 8. Test Source Dropdown

1. Click "Edit" on a deadline
2. Click on the **Source** dropdown
3. **Expected:**
   - ✅ Shows all 6 options:
     - Manual Entry
     - Syllabus
     - Website
     - Canvas
     - Image
     - AI Parsed
   - ✅ Current source is pre-selected
   - ✅ Can change to any option

### 9. Test with Different Statuses

Test editing deadlines with different statuses:

1. Create or find a deadline marked as "Not Started"
   - ✅ Edit button works
2. Change a deadline status to "In Progress"
   - ✅ Edit button still works
3. Change a deadline status to "Done"
   - ✅ Edit button still works on completed deadlines

### 10. Test Backend Error Handling

1. **Stop your backend** (Ctrl+C in terminal 1)
2. Try to edit a deadline
3. Make changes and click "Save Changes"

**Expected:**

- ✅ Shows error alert
- ✅ Modal stays open
- ✅ Can close modal and try again

4. **Restart backend:** `deno task concepts`
5. Try editing again
   - ✅ Should work normally

---

## 🎨 Visual Design Check

Verify styling matches your visual design study:

- ✅ Modal has 2px black border
- ✅ Modal has 8px black box shadow
- ✅ Modal title uses Cinzel font
- ✅ Edit button has white background with black border
- ✅ Save button is burgundy (#760806)
- ✅ Input fields have 2px borders
- ✅ Focus state shows burgundy border
- ✅ Modal has fade-in animation
- ✅ Edit button has hover effect (gray background, translateY)

---

## 🎯 Success Checklist

Mark as complete when:

1. ✅ Edit button appears on all deadline cards
2. ✅ Modal opens when clicking Edit
3. ✅ All three fields are pre-filled correctly
4. ✅ Title field is editable
5. ✅ Date/time picker works
6. ✅ Source dropdown works with all 6 options
7. ✅ Save button updates the deadline
8. ✅ Changes appear immediately after saving
9. ✅ Deadline re-sorts if date changed
10. ✅ Cancel/X/click-outside all close without saving
11. ✅ Form validation prevents empty title
12. ✅ Error messages appear when save fails
13. ✅ Styling matches design study
14. ✅ No console errors

---

## 🐛 Common Issues

### Issue: Date shows wrong timezone

**Solution:** This is expected - JavaScript Date objects use local timezone. The backend should handle timezone conversion.

### Issue: Edit button doesn't appear

**Solution:** Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Date/time not pre-filling

**Solution:** Check browser console for errors in date conversion. The modal converts ISO date to datetime-local format.

### Issue: Changes don't save

**Solution:**

- Check backend is running
- Check Network tab for API errors
- Verify the deadline ID is being passed correctly

---

## 💾 Commit Your Changes

Once everything works:

```bash
git add .
git commit -m "feat: add edit deadline functionality with styled modal

- Created EditDeadlineModal component with validation
- Added edit button to DeadlineList component
- Wired up API integration in DeadlinesView
- Includes date/time picker and source dropdown
- Styling consistent with visual design study"
```

---

## 📊 Progress Update

**Completed**: 2 of 14 tasks ✓

- ✅ Edit Course functionality
- ✅ Edit Deadline functionality

**Next High Priority:**

- 📋 All Deadlines view (unified view across courses)
- 👤 User Profile page
- ✅ Form validation improvements
- ⏳ Loading states
- 🎉 Success notifications

---

## 🎯 What You've Learned

This feature demonstrates:

- ✅ Reusing modal component pattern
- ✅ Handling complex form fields (date/time picker)
- ✅ Date format conversion (ISO → datetime-local)
- ✅ Dropdown/select components
- ✅ Maintaining sort order after updates

The pattern is now established - you can quickly create similar edit modals for any other features! 🚀
