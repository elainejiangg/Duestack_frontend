# Using Google Drive Links for AI Deadline Extraction

## 📂 Why Google Drive?

The AI extraction feature now **requires Google Drive links** to ensure:

- ✅ **Reliable access** to files
- ✅ **Multiple file types** supported (PDFs, images, documents)
- ✅ **Large files** can be processed
- ✅ **Secure sharing** with controlled permissions

## 🎯 Supported File Types

The AI can extract deadlines from:

- 📄 **PDFs** - Syllabi, course schedules, assignment sheets
- 🖼️ **Images** - Screenshots, photos of schedules
  - JPG/JPEG
  - PNG
  - GIF
  - WebP
- 📝 **Documents** - Word docs, text files (if uploaded as PDF)

## 📋 How to Get a Google Drive Link

### Step 1: Upload to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Click "+ New" → "File upload"
3. Select your document (PDF, image, etc.)
4. Wait for upload to complete

### Step 2: Get Shareable Link

1. **Right-click** the file in Google Drive
2. Click **"Share"**
3. Click **"Change to anyone with the link"**
4. Make sure it says **"Anyone with the link"** and **"Viewer"**
5. Click **"Copy link"**

### Step 3: Use in DueStack

1. Paste the link into DueStack's AI extraction interface
2. Click "Extract Deadlines"
3. Review and confirm suggestions!

## 🔗 Google Drive URL Formats

DueStack accepts these Google Drive URL formats:

✅ **Share link (most common):**

```
https://drive.google.com/file/d/1Abc123XyZ456/view?usp=sharing
```

✅ **Open link:**

```
https://drive.google.com/open?id=1Abc123XyZ456
```

✅ **Direct download link:**

```
https://drive.google.com/uc?export=download&id=1Abc123XyZ456
```

❌ **Not supported:**

- Direct file URLs (not from Google Drive)
- Private/restricted Google Drive links
- Other cloud storage (Dropbox, OneDrive, etc.)

## 🔒 Privacy & Permissions

### Required Permission

Files MUST be set to **"Anyone with the link can view"**

### Your Privacy

- ✅ Files remain in YOUR Google Drive
- ✅ You control who has access
- ✅ You can revoke sharing at any time
- ✅ DueStack only reads the file, never writes or modifies it

### Revoking Access

After extracting deadlines, you can:

1. Go back to Google Drive
2. Right-click the file
3. Click "Share" → "Restricted"
4. The file becomes private again!

## 💡 Pro Tips

### Multiple Documents

Upload multiple files for better results:

- **Course calendar (PDF)** with assignment due dates
- **Syllabus page (image)** with timing details
- AI cross-references information across all files!

### File Naming

Name files clearly before uploading:

```
✅ 61040-F25-Syllabus.pdf
✅ 63700-Assignment-Schedule.png
❌ IMG_1234.jpg
❌ document.pdf
```

### Screenshot Tips

When taking screenshots of schedules:

- Use high resolution
- Ensure text is clear and readable
- Capture the entire table/schedule
- Include headers and dates

## 🐛 Troubleshooting

### "Failed to fetch document"

**Problem:** DueStack can't access the file

**Solutions:**

1. Check file is set to "Anyone with the link can view"
2. Try copying the link again
3. Make sure the file is fully uploaded to Google Drive
4. Check your internet connection

### "Please use Google Drive links only"

**Problem:** URL is not from Google Drive

**Solutions:**

1. Upload the file to Google Drive first
2. Get the shareable link (see steps above)
3. Don't use links from email attachments or other sources

### "No deadlines found"

**Problem:** AI couldn't extract any deadlines

**Solutions:**

1. Make sure the document contains actual deadline information
2. Try a different document or higher quality image
3. Dates should be clearly written (not vague terms like "TBD")
4. Upload multiple documents for better results

### File Too Large

**Problem:** Upload fails for very large files

**Solutions:**

1. Google Drive File API supports files up to 50MB
2. For PDFs: Try reducing file size (compress in Acrobat)
3. For images: Resize to reasonable dimensions (1920px width max)
4. Split large documents into smaller files

## 📊 Example Workflow

### Scenario: MIT Course Deadlines

**You have:**

- Course syllabus PDF (with assignments listed)
- Course calendar image (with due dates)

**Steps:**

1. Upload BOTH to Google Drive
2. Make both "Anyone with the link can view"
3. Copy both links
4. In DueStack:
   - Click "+ New Deadline"
   - Select "🤖 AI Parsed"
   - Paste first link
   - Click "+ Add Another Document"
   - Paste second link
   - Click "Extract Deadlines"
5. AI analyzes BOTH files and combines information
6. Review suggestions (edit if needed)
7. Confirm deadlines!

## ✅ Success Checklist

Before extracting:

- [ ] File uploaded to Google Drive
- [ ] File shared with "Anyone with the link can view"
- [ ] Link copied to clipboard
- [ ] File contains deadline information
- [ ] Text in document is clear and readable
- [ ] Using correct Google Drive URL format

## 🎓 Best Practices

1. **Organize in Folders**: Create a "Course Materials" folder in Google Drive
2. **Batch Upload**: Upload all course docs at once, then extract
3. **Keep Links**: Save Google Drive links in a note for future reference
4. **Regular Updates**: When syllabus changes, upload new version and re-extract
5. **Multiple Sources**: Use both PDF syllabi AND website screenshots for completeness

---

**Ready to extract!** Upload your course documents to Google Drive and let AI handle the rest! 🚀
