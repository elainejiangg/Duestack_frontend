# Frontend Changes Summary - Sync Integration

## Overview

Updated the frontend to work with the new sync-based authenticated backend. All API calls now automatically include `sessionID` for authentication, and the backend derives user identity from the session rather than receiving it as a parameter.

## Files Modified

### 1. Core API Infrastructure

#### `src/utils/api.js`

**Changes:**

- ✅ Added `apiRequest()` function for authenticated API calls
  - Automatically includes `sessionID` from localStorage
  - Handles session expiry and redirects to login
  - Used for all authenticated routes
- ✅ Added `publicRequest()` function for unauthenticated API calls
  - Used for login and registration
- ✅ Enhanced error interceptor to handle session expiry

**Impact:** All authenticated API calls now automatically include session credentials

---

### 2. Service Layer Updates

#### `src/services/authService.js`

**Changes:**

- ✅ `login()` - Now uses `publicRequest()` (no change to parameters)
- ✅ `register()` - Now uses `publicRequest()` (no change to parameters)
- ✅ `logout()` - Now uses `apiRequest()` and no longer requires `sessionID` parameter
- ✅ `changePassword()` - Now uses `apiRequest()`, removed `user` parameter (derived from session)

**Before:**

```javascript
await authService.logout(sessionID);
await authService.changePassword(userId, oldPassword, newPassword);
```

**After:**

```javascript
await authService.logout();
await authService.changePassword(oldPassword, newPassword);
```

---

#### `src/services/courseService.js`

**Changes:**

- ✅ All methods now use `apiRequest()`
- ✅ `createCourse()` - Removed `creator` parameter (derived from session)
- ✅ `getCoursesByCreator()` - No longer requires `creator` parameter (derived from session)
- ✅ Query responses now properly handle `{ results: [...] }` format

**Before:**

```javascript
await courseService.createCourse(userId, courseCode, title);
await courseService.getCoursesByCreator(userId);
```

**After:**

```javascript
await courseService.createCourse(courseCode, title);
await courseService.getCoursesByCreator();
```

---

#### `src/services/deadlineService.js`

**Changes:**

- ✅ All methods now use `apiRequest()`
- ✅ `createDeadline()` - Removed `addedBy` parameter (derived from session)
- ✅ `getAllDeadlinesByUser()` - No longer requires `userId` parameter (derived from session)
- ✅ Query responses now properly handle `{ results: [...] }` format

**Before:**

```javascript
await deadlineService.createDeadline(
  course,
  title,
  due,
  source,
  userId,
  websiteUrl
);
await deadlineService.getAllDeadlinesByUser(userId);
```

**After:**

```javascript
await deadlineService.createDeadline(course, title, due, source, websiteUrl);
await deadlineService.getAllDeadlinesByUser();
```

---

#### `src/services/aiExtractionService.js`

**Changes:**

- ✅ All methods now use `apiRequest()`
- ✅ `extractFromPDFs()` - Removed `userId` parameter (derived from session)
- ✅ `extractFromWebsite()` - Removed `userId` parameter (derived from session)
- ✅ `refineSuggestions()` - Removed `userId` parameter (derived from session)
- ✅ `getUnconfirmedSuggestions()` - Removed `userId` parameter (derived from session)
- ✅ `getAllSuggestions()` - Removed `userId` parameter (derived from session)
- ✅ `confirmSuggestion()` - Removed `userId` parameter (derived from session)
- ✅ Query responses now properly handle `{ results: [...] }` format

**Before:**

```javascript
await aiExtractionService.extractFromPDFs(
  userId,
  courseId,
  pdfUrls,
  customPrompt
);
await aiExtractionService.confirmSuggestion(suggestionId, courseId, userId);
await aiExtractionService.getAllSuggestions(userId);
```

**After:**

```javascript
await aiExtractionService.extractFromPDFs(courseId, pdfUrls, customPrompt);
await aiExtractionService.confirmSuggestion(suggestionId, courseId);
await aiExtractionService.getAllSuggestions();
```

---

### 3. State Management

#### `src/stores/auth.js`

**Changes:**

- ✅ Updated `logout()` to call `authService.logout()` without `sessionID` parameter
- ✅ Session management remains the same (already storing sessionID correctly)

---

### 4. Component Updates

#### `src/components/CreateCourseForm.vue`

**Changes:**

- ✅ Removed `authStore.userId` from `createCourse()` call

---

#### `src/views/CoursesView.vue`

**Changes:**

- ✅ Removed `authStore.userId` from `getCoursesByCreator()` call

---

#### `src/views/AllDeadlinesView.vue`

**Changes:**

- ✅ Removed `authStore.userId` from `getCoursesByCreator()` call
- ✅ Removed `authStore.userId` from `getAllDeadlinesByUser()` call
- ✅ Removed `authStore.userId` from `createDeadline()` call

---

#### `src/views/DeadlinesView.vue`

**Changes:**

- ✅ Removed `authStore.userId` from `getCoursesByCreator()` call
- ✅ Removed `authStore.userId` from `createDeadline()` call

---

#### `src/components/AIDeadlineExtractor.vue`

**Changes:**

- ✅ Removed `authStore.userId` from all `extractFromWebsite()` calls
- ✅ Removed `authStore.userId` from all `extractFromPDFs()` calls
- ✅ Removed `authStore.userId` from all `getAllSuggestions()` calls
- ✅ Removed `authStore.userId` from all `confirmSuggestion()` calls
- ✅ Removed `authStore.userId` from all `refineSuggestions()` calls
- ✅ Removed `addedBy` parameter from `createDeadline()` call

---

## Security Improvements

### Before

- ❌ Frontend sent user IDs with every request
- ❌ Possible for malicious users to impersonate others by changing user ID
- ❌ No automatic session validation on most routes

### After

- ✅ User identity derived from secure session token on backend
- ✅ Frontend cannot manipulate user identity
- ✅ All authenticated routes automatically validate session
- ✅ Automatic redirect to login on session expiry
- ✅ Single source of truth for authentication (session, not client-provided IDs)

---

## Backend Response Format

The backend now returns query results in a consistent format:

```javascript
{
  results: [...]  // Array of items
}
```

All service methods now handle this format correctly.

---

## Authentication Flow

### Login

1. User provides credentials
2. Backend validates and creates session
3. Frontend receives and stores `sessionID` in localStorage
4. All subsequent requests include `sessionID` automatically

### Authenticated Requests

1. `apiRequest()` retrieves `sessionID` from localStorage
2. Includes it in request body automatically
3. Backend validates session and derives user identity
4. Backend processes request in context of authenticated user

### Session Expiry

1. Backend returns error: "Invalid or expired session"
2. API interceptor catches this error
3. Clears localStorage
4. Redirects to login page
5. User notified to log in again

---

## Testing Checklist

After backend is running, test the following:

- [ ] **Registration** - Create new account
- [ ] **Login** - Log in and verify sessionID is stored
- [ ] **Courses**
  - [ ] Create course (should use session for creator)
  - [ ] View courses (should load user's courses)
  - [ ] Update course
  - [ ] Delete course
- [ ] **Deadlines**
  - [ ] Create manual deadline (should use session for addedBy)
  - [ ] View deadlines by course
  - [ ] View all deadlines (should show user's deadlines)
  - [ ] Update deadline
  - [ ] Delete deadline
  - [ ] Change deadline status
- [ ] **AI Extraction**
  - [ ] Extract from website (should use session for user)
  - [ ] Extract from PDFs (should use session for user)
  - [ ] View suggestions (should show user's suggestions)
  - [ ] Edit suggestions
  - [ ] Refine suggestions
  - [ ] Confirm suggestions (should create deadlines with session user)
- [ ] **Session Management**
  - [ ] Logout (should clear session and redirect)
  - [ ] Try to access protected page after logout (should redirect to login)
  - [ ] Session expiry handling (wait for timeout or test with invalid session)
- [ ] **Error Handling**
  - [ ] Invalid session errors redirect to login
  - [ ] Other errors display properly

---

## Migration Notes

### What Frontend Developers Need to Know

1. **Never send user IDs from frontend anymore**

   - The backend derives user identity from session
   - This is more secure and prevents impersonation

2. **Use `apiRequest()` for authenticated routes**

   - Automatically includes sessionID
   - Handles session expiry
   - Use for all routes requiring authentication

3. **Use `publicRequest()` for public routes**

   - Login and registration only
   - Does not include sessionID

4. **Session management is automatic**

   - Login stores sessionID
   - Logout clears sessionID
   - API calls include sessionID automatically
   - Expiry redirects to login automatically

5. **Response format has changed for queries**
   - Query endpoints now return `{ results: [...] }`
   - Service methods handle this automatically

---

## Summary

All frontend code has been updated to work with the new authenticated backend. The changes:

1. ✅ Remove all explicit user ID parameters from API calls
2. ✅ Use new `apiRequest()` and `publicRequest()` helpers
3. ✅ Handle new response formats from backend
4. ✅ Automatic session management
5. ✅ Improved security through server-side user identity management

The frontend is now ready to test with the backend!
