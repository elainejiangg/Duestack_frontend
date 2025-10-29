# AI Extraction Feature - Fixes Applied

## 🐛 Issues Fixed

### 1. CORS Middleware Placement (Backend)

**Problem:** CORS middleware was being added inside the route registration loop, causing it to be added multiple times and potentially interfering with route registration.

**Fix:** Moved CORS middleware to the top of `concept_server.ts`, before any route registration:

```typescript
// Add CORS middleware ONCE at app level
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
```

**File:** `/Duestack_backend/src/concept_server.ts`

---

### 2. Invalid Config ID (Frontend)

**Problem:** Frontend was returning `"default-config-id"` as a placeholder when config creation failed, but this ID doesn't exist in the database.

**Fix:** Updated `getDefaultExtractionConfig()` to:

- Create a unique config each time using timestamp
- Use proper prompt template
- Throw meaningful error if creation fails
- No longer returns invalid placeholder IDs

**File:** `/Duestack_frontend/src/services/aiExtractionService.js`

---

### 3. Google Drive URL Support (Backend)

**Added:** Automatic conversion of Google Drive share links to direct download URLs

**Supported formats:**

- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`
- `https://drive.google.com/uc?export=download&id=FILE_ID`

**File:** `/Duestack_backend/src/utils/geminiService.ts`

---

### 4. Multi-File Type Support (Backend)

**Added:** Automatic MIME type detection for multiple file types

**Supported file types:**

- **PDFs** - `application/pdf`
- **Images:**
  - JPEG/JPG - `image/jpeg`
  - PNG - `image/png`
  - GIF - `image/gif`
  - WebP - `image/webp`
- **Documents:**
  - Word docs - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - Text files - `text/plain`

**File:** `/Duestack_backend/src/utils/geminiService.ts`

---

### 5. URL Validation (Frontend)

**Added:** Strict validation to ensure only Google Drive links are accepted

**Validation checks:**

- URL must start with `https://`
- URL must contain `drive.google.com`
- Provides helpful error messages about file sharing settings

**File:** `/Duestack_frontend/src/components/AIDeadlineExtractor.vue`

---

## ✅ Testing Checklist

### Backend Server

- [ ] Backend server is running: `http://localhost:8000`
- [ ] Endpoint registered: `POST /api/SuggestionManagement/llmExtractFromPDFUrls`
- [ ] GEMINI_API_KEY environment variable is set

### Frontend

- [ ] Frontend dev server is running: `http://localhost:5173`
- [ ] Hard refresh browser to clear 404 cache (`Cmd+Shift+R` / `Ctrl+Shift+R`)
- [ ] Navigate to a course's deadlines page
- [ ] Click "+ New Deadline"
- [ ] Select "🤖 AI Parsed"

### AI Extraction Flow

- [ ] Can enter Google Drive links
- [ ] Validation errors show for non-Google Drive links
- [ ] "Extract Deadlines" button works
- [ ] Loading state displays during extraction
- [ ] Suggestions appear with confidence badges
- [ ] Can edit suggestion fields
- [ ] Can confirm selected suggestions
- [ ] Deadlines appear in the list after confirmation

---

## 🔑 Required Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API key"
3. Create a new API key
4. Copy the key

### 2. Set Environment Variable (Backend)

```bash
# In terminal (temporary)
export GEMINI_API_KEY="your-api-key-here"

# Or in .env file (permanent)
echo "GEMINI_API_KEY=your-api-key-here" >> .env
```

### 3. Start Backend Server

```bash
cd /path/to/Duestack_backend
deno run --allow-net --allow-read --allow-env --allow-sys src/concept_server.ts
```

### 4. Start Frontend Server

```bash
cd /path/to/Duestack_frontend
npm run dev
```

---

## 📝 Example Test Document

### Test Google Drive Link

Use this public example (or create your own):

```
https://drive.google.com/file/d/1FDlFEL512miC89eMIs0alwmytgDNT1yxv/view
```

### Creating Your Own Test Document

1. Upload a PDF or image to Google Drive
2. Right-click → Share
3. Change to "Anyone with the link can view"
4. Copy link
5. Paste into DueStack AI extraction

---

## 🎯 Expected Behavior

### Successful Extraction

1. User enters Google Drive link(s)
2. Clicks "Extract Deadlines"
3. Loading indicator shows "Extracting..."
4. Suggestions appear with:
   - Title (editable)
   - Due date (editable)
   - Confidence badge (High/Medium/Low)
   - Provenance information
   - Warnings (if any)
5. User can select/deselect suggestions
6. User clicks "Confirm Selected Deadlines"
7. Deadlines are created and appear in the list

### Error Handling

- **No Google Drive link:** "Please enter at least one Google Drive link"
- **Invalid URL:** "Please use Google Drive links only..."
- **API key missing:** "GEMINI_API_KEY is not configured"
- **Extraction failed:** "Failed to extract deadlines: [error message]"
- **Config creation failed:** "Could not initialize AI extraction. Please try again."

---

## 🔧 Debugging

### Backend Not Running

```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process if needed
lsof -ti:8000 | xargs kill -9

# Check server logs
tail -f /tmp/deno_server.log
```

### API Key Issues

```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Test key with curl
curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
```

### CORS Issues

- Make sure frontend is running on port 5173 (default Vite port)
- Check browser console for CORS errors
- Verify CORS middleware is at the top of `concept_server.ts`

### 404 Errors

- Hard refresh browser (`Cmd+Shift+R` / `Ctrl+Shift+R`)
- Clear browser cache
- Restart backend server
- Check that endpoint is registered in server logs

---

## 📚 Related Files

**Backend:**

- `/Duestack_backend/src/concept_server.ts` - Server setup & CORS
- `/Duestack_backend/src/utils/geminiService.ts` - Gemini API integration
- `/Duestack_backend/src/concepts/SuggestionManagement/SuggestionManagementConcept.ts` - Extraction logic

**Frontend:**

- `/Duestack_frontend/src/views/DeadlinesView.vue` - Source selection UI
- `/Duestack_frontend/src/components/AIDeadlineExtractor.vue` - Extraction interface
- `/Duestack_frontend/src/services/aiExtractionService.js` - API calls

**Documentation:**

- `/Duestack_frontend/GOOGLE_DRIVE_SETUP.md` - User guide for Google Drive
- `/Duestack_frontend/AI_UI_FLOW_UPDATE.md` - UI flow documentation

---

## ✨ Next Steps

1. **Test with real documents** - Upload course syllabi to Google Drive and extract
2. **Refine prompts** - Adjust `basePromptTemplate` for better extraction accuracy
3. **Add more file types** - Support additional document formats if needed
4. **Implement caching** - Cache extraction configs to avoid recreating each time
5. **Add batch operations** - Allow confirming all high-confidence suggestions at once

---

**Status:** ✅ All fixes applied, ready for testing!
