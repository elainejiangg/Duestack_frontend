# Width Consistency: Per-Course vs All Deadlines

## ✨ What Changed

Made the per-course deadline view (DeadlinesView) have the **same width** as the All Deadlines view for a consistent experience across the app!

## 🎯 Changes

### Before:

- **Per-Course View**: Fixed width of `1200px`
- **All Deadlines View**: Responsive `65vw` (viewport width)
- **Result**: Inconsistent widths between views

### After:

- **Both Views**: Responsive `65vw` on desktop
- **Both Views**: Same responsive breakpoints
- **Result**: Consistent width across all deadline views! ✅

## 📐 Responsive Breakpoints

Both views now use:

- **Desktop (1025px+)**: `max-width: 65vw`, `min-width: 700px`
- **Tablet (769-1024px)**: `max-width: 75vw`
- **Mobile (≤768px)**: `max-width: 95vw`

## 📁 Files Modified

1. **`DeadlinesView.vue`** (Per-course deadlines)

   - Changed from `max-width: 1200px` to `max-width: 65vw`
   - Added `display: flex`, `flex-direction: column`, `align-items: center`
   - Added `width: 100%` to `.header`
   - Added responsive media queries

2. **`DeadlineList.vue`** (Component used in per-course view)

   - Changed from `max-width: 900px` to `width: 100%`
   - Removed `margin: 0 auto` (parent handles centering)

3. **`CreateDeadlineForm.vue`** (Form component)
   - Added `width: 100%` for consistency

## 🎨 Visual Result

Both views now:

- Take up the same screen width
- Respond the same way to screen size changes
- Have perfectly aligned content
- Feel like a unified experience

## 🧪 Testing

1. **Refresh your browser** (Cmd+Shift+R)
2. Go to any **course** → Click "Manage Deadlines"
3. Note the width
4. Go to **All Deadlines**
5. Compare - they should be the same width! 🎉
6. Resize window - both should respond identically

## 🎯 Result

Consistent, professional-looking UI with matching widths throughout the deadline management system!
