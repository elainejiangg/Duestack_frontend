# AI Deadline Extraction - Setup & Testing Guide

## 🎯 Overview

You now have AI-powered deadline extraction integrated into DueStack! This feature allows users to upload PDF documents (via URL) and automatically extract deadlines using Google's Gemini 2.0 Flash model.

---

## 🔧 Backend Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Copy your API key

### 2. Set Environment Variable

In your backend terminal, set the `GEMINI_API_KEY`:

```bash
# macOS/Linux
export GEMINI_API_KEY="your-api-key-here"

# Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# Or create a .env file in Duestack_backend/:
echo 'GEMINI_API_KEY="your-api-key-here"' > .env
```

### 3. Start Backend Server

```bash
cd Duestack_backend
deno task concepts
```

You should see:

```
Scanning for concepts in ./src/concepts...
- Registering concept: SuggestionManagement at /api/SuggestionManagement
  - Endpoint: POST /api/SuggestionManagement/llmExtractFromPDFUrls
  ...
Server is running on http://localhost:8000
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies (if needed)

```bash
cd Duestack_frontend
npm install
```

### 2. Start Frontend Dev Server

```bash
npm run dev
```

Frontend should be running on `http://localhost:5173`

---

## 🧪 Testing the AI Feature

### 1. Prepare Test PDFs

You need publicly accessible PDF URLs. Here are some test options:

**Option A: Use MIT Course Materials** (recommended)

- [6.3700 Calendar PDF](https://ocw.mit.edu/courses/6-3700-introduction-to-probability-fall-2023/resources/6-3700-f23-calendar/)
- Any publicly accessible course syllabus

**Option B: Upload PDFs to Cloud Storage**

- Google Drive (make sure link is public)
- Dropbox (use direct link)
- GitHub (raw file URL)

**Example Public PDF URLs:**

```
https://arxiv.org/pdf/2312.11805
https://www.nasa.gov/wp-content/uploads/static/history/alsj/a17/A17_FlightPlan.pdf
```

### 2. Test the Feature

1. **Login** to DueStack
2. **Create or Select a Course** (e.g., "6.1040 - Software Design")
3. **Click "🤖 AI Extract"** button on the deadlines page
4. **Enter PDF URL(s)**:
   - Paste one or more PDF URLs
   - Click "+ Add Another PDF" to add multiple documents
5. **Click "Extract Deadlines"**
6. **Review Suggestions**:
   - Each suggestion shows:
     - Title
     - Due date & time
     - Confidence score (High/Medium/Low)
     - Provenance (where it was found)
     - Warnings (if any)
7. **Edit if needed**:
   - Click "Edit" on any suggestion to manually adjust
8. **Confirm**:
   - Select suggestions to confirm (high-confidence ones are pre-selected)
   - Click "Confirm X Deadline(s)"
9. **View Created Deadlines**:
   - Confirmed deadlines appear in your course deadline list

---

## 📋 Test Scenarios

### Scenario 1: Single PDF with Clear Deadlines

**Test PDF**: A course syllabus with explicit due dates

**Expected Result**:

- Multiple suggestions extracted
- High confidence scores (0.8-1.0)
- Proper ISO 8601 date formatting
- Correct timezone (Eastern Time)

### Scenario 2: Multiple PDFs with Cross-Referencing

**Test PDFs**:

- PDF 1: Calendar with dates but no times
- PDF 2: General info with timing specifications

**Expected Result**:

- AI combines information from both documents
- Dates from PDF 1 + Times from PDF 2
- Provenance notes "cross-referenced from multiple sources"

### Scenario 3: Ambiguous or Vague Dates

**Test PDF**: Document with "TBD", "soon", "later", "end of semester"

**Expected Result**:

- Lower confidence scores (0.3-0.6)
- Warnings like "Vague date term used"
- May skip vague terms entirely (conservative approach)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `GEMINI_API_KEY is not configured`

- **Solution**: Set the environment variable before starting the server

**Problem**: `Failed to fetch PDF from URL`

- **Solution**:
  - Make sure the URL is publicly accessible
  - Try opening it in an incognito browser window
  - Use HTTPS URLs only

**Problem**: `429 Too Many Requests`

- **Solution**: Gemini API rate limit reached. Wait a few minutes or use a different API key.

### Frontend Issues

**Problem**: "Failed to extract deadlines" error

- **Solution**:
  - Check backend console for detailed error logs
  - Verify backend is running on `http://localhost:8000`
  - Check CORS settings in `concept_server.ts`

**Problem**: No suggestions extracted

- **Solution**:
  - PDF might not contain deadline information
  - Try a different PDF with clearer deadline mentions
  - Check backend logs for Gemini API response

**Problem**: Wrong timezone in extracted dates

- **Solution**:
  - Check the prompt in `geminiService.ts`
  - Verify DST rules (EDT vs EST)
  - Manually edit suggestions before confirming

---

## 🎨 User Experience Flow

```
1. User: Clicks "🤖 AI Extract"
   ↓
2. UI: Shows PDF URL input form
   ↓
3. User: Enters 1+ PDF URLs
   ↓
4. User: Clicks "Extract Deadlines"
   ↓
5. Backend: Uploads PDFs to Gemini File API
   ↓
6. Backend: Calls Gemini with structured output schema
   ↓
7. Backend: Validates and stores suggestions
   ↓
8. UI: Shows suggestion cards with confidence badges
   ↓
9. User: Reviews, edits, and selects suggestions
   ↓
10. User: Clicks "Confirm X Deadline(s)"
    ↓
11. Backend: Confirms suggestions → Creates real deadlines
    ↓
12. UI: Refreshes deadline list, shows success message
```

---

## 📊 Key Features Implemented

✅ **Multi-PDF Support**: Process multiple documents in a single request  
✅ **Cross-Referencing**: Gemini intelligently combines information across PDFs  
✅ **Confidence Scores**: Visual badges show extraction confidence  
✅ **Provenance Tracking**: Shows where each deadline was found  
✅ **Warning System**: Flags vague dates, missing times, potential issues  
✅ **Manual Editing**: Users can refine suggestions before confirmation  
✅ **Batch Confirmation**: Select and confirm multiple deadlines at once  
✅ **Structured Output**: JSON schema ensures consistent, parseable responses  
✅ **Timezone Handling**: Proper EDT/EST handling with DST awareness

---

## 🚀 Next Steps (Future Enhancements)

1. **Website Extraction**: Add URL input for course websites (already scaffolded in backend)
2. **Canvas Integration**: Direct integration with Canvas LMS API
3. **File Upload**: Allow direct PDF uploads (instead of just URLs)
4. **Refinement with Feedback**: Implement the `refineWithFeedback` action
5. **Suggestion History**: View all past extractions and suggestions
6. **Batch Operations**: Delete, edit multiple suggestions at once
7. **Confidence Tuning**: Let users set minimum confidence threshold

---

## 📝 API Endpoints Created

### Backend Endpoints (Auto-generated by Concept Server)

- `POST /api/SuggestionManagement/llmExtractFromPDFUrls` - Extract from PDF URLs
- `POST /api/SuggestionManagement/_getUnconfirmedSuggestionsByUser` - Get pending suggestions
- `POST /api/SuggestionManagement/_getAllSuggestions` - Get all suggestions
- `POST /api/SuggestionManagement/confirm` - Confirm a suggestion
- `POST /api/SuggestionManagement/editSuggestion` - Edit a suggestion
- `POST /api/SuggestionManagement/createExtractionConfig` - Create AI config

### Frontend Services

- `aiExtractionService.js` - Handles all AI extraction API calls
- `AIDeadlineExtractor.vue` - Main UI component for extraction workflow

---

## 💡 Tips for Best Results

1. **Use Clear, Structured PDFs**: Syllabi with tables or lists work best
2. **Multiple Documents**: Upload related docs (calendar + schedule) for cross-referencing
3. **Review Before Confirming**: Always check suggestions, especially low-confidence ones
4. **Edit Liberally**: Use the edit button to fix any mistakes before confirming
5. **Batch Process**: Confirm multiple high-confidence suggestions at once
6. **Check Timezones**: Verify dates/times match your expectations

---

## 🎉 Success Criteria

Your AI feature is working correctly if:

1. ✅ Backend starts without errors and shows Gemini endpoints
2. ✅ Frontend shows "🤖 AI Extract" button on deadlines page
3. ✅ Can enter PDF URL and click "Extract Deadlines"
4. ✅ Suggestions appear with titles, dates, and confidence scores
5. ✅ Can edit suggestions before confirming
6. ✅ Confirmed deadlines appear in the course deadline list
7. ✅ Multi-PDF extraction combines information intelligently

---

**Ready to Test!** 🚀

Start both servers, get your Gemini API key, and try extracting deadlines from a course syllabus PDF!
