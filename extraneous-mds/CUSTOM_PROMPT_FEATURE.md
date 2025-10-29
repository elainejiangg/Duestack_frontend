# Custom Prompt Feature for AI Extraction

## ✨ New Feature

Added the ability for users to provide **custom instructions** to the AI when extracting deadlines from documents!

## 🎯 What's New

### Frontend Changes:

1. **Custom Instructions Field** - Textarea in the AI extraction form
2. **Optional Field** - Users can leave it blank for default behavior
3. **Helpful Placeholder** - Examples of what to write
4. **Styling** - Matches the app's design with burgundy focus color

### Backend Changes:

1. **API Parameter** - Added `customPrompt` parameter to `llmExtractFromPDFUrls`
2. **Prompt Combination** - Custom prompt is appended to the base prompt
3. **Optional Handling** - Only adds custom instructions if provided

## 🎨 UI/UX

### Form Layout:

```
Course Selector (if from All Deadlines)
↓
Google Drive URL Inputs
↓
+ Add Another Document Button
↓
Custom Instructions Textarea (NEW!)
↓
Info Box with Tips
↓
Action Buttons
```

### Custom Instructions Field:

- **Label**: "Custom Instructions (Optional)"
- **Placeholder**: Examples like "Focus on homework assignments only, ignore reading assignments"
- **Help Text**: "💭 Tip: Be specific about what deadlines to extract, any formatting preferences, or semester/year details."
- **Styling**: 3 rows, resizable, burgundy focus color

## 🔧 Technical Implementation

### Frontend Flow:

1. User enters custom prompt in textarea
2. `customPrompt` ref stores the value
3. Passed to `aiExtractionService.extractFromPDFs()` as 4th parameter
4. Service includes it in API call to backend

### Backend Flow:

1. Receives `customPrompt` parameter (optional)
2. Combines with base prompt: `basePrompt + "\n\nAdditional Instructions:\n" + customPrompt`
3. Sends combined prompt to Gemini API
4. Returns extracted deadlines based on enhanced prompt

## 📝 Example Usage

### Custom Prompts Users Can Write:

- **"Focus on homework assignments only, ignore reading assignments"**
- **"Extract deadlines for the Spring 2025 semester only"**
- **"Include project deadlines but exclude quiz dates"**
- **"Format assignment titles as 'HW #X' where X is the number"**
- **"Only extract deadlines that are due within the next 3 months"**

## 📁 Files Modified

### Frontend:

1. **`AIDeadlineExtractor.vue`**

   - Added custom prompt textarea
   - Added `customPrompt` ref
   - Updated `extractDeadlines()` to pass custom prompt
   - Added CSS styling for textarea

2. **`aiExtractionService.js`**
   - Added `customPrompt` parameter to `extractFromPDFs()`
   - Updated API call to include custom prompt

### Backend:

3. **`SuggestionManagementConcept.ts`**
   - Added `customPrompt` parameter to `llmExtractFromPDFUrls`
   - Combined base prompt with custom instructions
   - Passed enhanced prompt to Gemini API

## 🧪 Testing

1. **Refresh your browser**
2. Go to any course or All Deadlines
3. Click **"+ New Deadline"** → **"🤖 AI Parsed"**
4. Select a course (if from All Deadlines)
5. Add Google Drive URLs
6. **Write custom instructions** in the textarea
7. Click **"Extract Deadlines"**
8. AI will use your custom instructions! 🎉

## 🎯 Result

Users now have **fine-grained control** over AI extraction, allowing them to specify exactly what kind of deadlines they want extracted and how they should be formatted!
