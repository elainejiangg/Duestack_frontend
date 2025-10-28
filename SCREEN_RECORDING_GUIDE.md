# Screen Recording Guide - Assignment 4b Final Submission

## Requirements

- **Maximum Duration**: 2 minutes
- **Content**: Demonstrate the user journey with narration
- **Tool**: QuickTime Player (Mac), Snipping Tool (Windows), or any screen recorder

## Recommended Recording Flow (2 minutes)

### Setup Before Recording (0:00)

- Have backend running (`deno task concepts` in backend directory)
- Have frontend running (`npm run dev` in frontend directory)
- Open browser to `http://localhost:5173` (or your frontend URL)
- Be logged out or ready to register

### Recording Script

#### Segment 1: Registration & Course Setup (0:00 - 0:30, ~30 seconds)

**Actions:**

1. Register a new account (Tim / timthebeaver@mit.edu / tim / password123456)
2. Navigate to "Courses" page
3. Create two courses:
   - 6.1040 - Software Design
   - 6.3700 - Introduction to Probability

**Narration:**

> "Hi, I'm Tim, an MIT student. Let me show you DueStack, my course deadline management app. First, I'll register an account and add my courses for this semester: 6.1040 Software Design and 6.3700 Introduction to Probability."

#### Segment 2: Adding & Managing Deadlines (0:30 - 1:00, ~30 seconds)

**Actions:**

1. Click "View Deadlines" on 6.1040
2. Create 2-3 deadlines with different due dates
3. Update status of one deadline to "In Progress" (notice yellow border)
4. Mark another as "Done" (notice it moves to end with strikethrough)
5. Click "Edit" on a deadline and change its due date

**Narration:**

> "Now I'll add some deadlines for 6.1040. I can track my progress by updating the status - see how the yellow border indicates work in progress, and completed items move to the end. I can also edit deadlines if due dates change."

#### Segment 3: All Deadlines View & Filtering (1:00 - 1:30, ~30 seconds)

**Actions:**

1. Click "All Deadlines" in navigation
2. Show all deadlines from both courses
3. Filter by course (e.g., only 6.1040)
4. Filter by status (e.g., only "In Progress")
5. Clear filters

**Narration:**

> "The All Deadlines view shows everything across all my courses. I can filter by specific courses or by status to focus on what matters. This helps me see my entire workload at a glance."

#### Segment 4: Calendar View (1:30 - 2:00, ~30 seconds)

**Actions:**

1. Click "Calendar" toggle
2. Show color-coded dots on calendar (point out the legend)
3. Click on a date with deadlines
4. Show deadline details panel on the right
5. Update a deadline status directly from calendar view

**Narration:**

> "I can switch to calendar view to see my deadlines visually. The color-coded dots show the status: red for not started, yellow for in progress, blue for overdue, and gray for completed. Clicking a date shows all deadlines for that day, and I can manage them right from here."

### Closing (if time permits, 1:55 - 2:00)

**Narration:**

> "DueStack helps me stay organized and on top of all my MIT coursework in one place."

## Tips for a Great Recording

### Before Recording

✅ **Clean up test data**: Delete any messy test deadlines
✅ **Use realistic data**: Use actual MIT course numbers and assignment names
✅ **Check visual consistency**: Make sure all styles are loaded
✅ **Practice once**: Do a dry run to time yourself (aim for 1:45-1:55)
✅ **Close unnecessary tabs/windows**: Clean desktop for recording

### During Recording

✅ **Speak clearly and confidently**: Narrate as you click
✅ **Move mouse deliberately**: Don't move too fast
✅ **Pause briefly**: Give visual changes time to be visible
✅ **Show, don't tell**: Let the UI demonstrate features
✅ **Stay focused**: Stick to the user journey, don't deviate

### Recording Settings

✅ **Resolution**: 1920x1080 or your screen's native resolution
✅ **Frame rate**: 30 FPS minimum
✅ **Audio**: Test your microphone before recording
✅ **Browser**: Use Chrome or Firefox (clean UI, good developer tools)
✅ **Zoom**: Use Cmd/Ctrl + Plus to zoom in if text is small

## Tools

### Mac: QuickTime Player

1. Open QuickTime Player
2. File → New Screen Recording
3. Click Options → Choose Microphone
4. Click red record button → Select screen area or full screen
5. Click "Start Recording"
6. Click stop button in menu bar when done
7. File → Save (save as .mov or .mp4)

### Windows: Snipping Tool

1. Open Snipping Tool
2. Click Camera icon for screen recording
3. Select area to record
4. Click record button
5. Click stop when done
6. Save the video

### Alternative: OBS Studio (Free, Cross-platform)

- More advanced but gives you full control
- Can add overlays, multiple scenes, etc.
- Download from https://obsproject.com

## File Naming

Save your recording as: `duestack-demo-[yourname].mov` or `.mp4`

Place it in: `/Assignment4b-assets/`

## Submission Checklist

- [ ] Recording is under 2 minutes
- [ ] Audio is clear and audible
- [ ] All key features are demonstrated
- [ ] User journey is followed
- [ ] Video file is saved in Assignment4b-assets folder
- [ ] Ready to submit commit hash

## Common Mistakes to Avoid

❌ Going over 2 minutes (aim for 1:50-1:55)
❌ Speaking too fast or too slow
❌ Showing bugs or errors on screen
❌ Clicking too fast without letting UI update
❌ Forgetting to enable microphone
❌ Recording with low volume
❌ Not practicing beforehand

Good luck! 🎥
