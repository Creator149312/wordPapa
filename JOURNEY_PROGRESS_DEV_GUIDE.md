# Journey Progress - Quick Guide for Developers

## What Changed

The journey page now has a robust node progress tracking system:
- **Node progress** is visible on every node card (no need to click)
- **Guest users** have progress tracked in `localStorage`
- **Logged-in users** have progress tracked server-side
- **Progress structure** is consistent between both (average of list progress)

## For Component Developers

### Dispatching List Completion Events

When a user completes a practice/list (in QuizFlow, practice components, etc.):

**For Server-Tracked Users** (Already implemented in QuizFlow):
```javascript
// Call the journey list-completion API
await fetch("/api/journey/list-completion", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: session.user.email,
    listId: listId,
    wordsLearned: correctAnswers,  // words completed correctly
  })
});

// Dispatch event to refresh journey page
window.dispatchEvent(new CustomEvent('journeyProgressUpdated', {
  detail: { listId, correctAnswers }
}));
```

**For Guest Users** (Needs to be added):
```javascript
// Dispatch guest list completion event
window.dispatchEvent(new CustomEvent('guestListCompletion', {
  detail: {
    rankId: rank,           // which rank (1-8)
    nodeId: node,           // which node (1-5)
    listId: listId,         // list MongoDB ID
    correctAnswers: score,  // words correct
    totalWords: total       // total words in list
  }
}));
```

## For Testing

### Check Node Progress in Browser Console

```javascript
// Check guest progress stored
const guestData = JSON.parse(localStorage.getItem('wordpapa_guest_journey'));
console.log('Guest progress:', guestData.progress);

// Check specific node
const rank1 = guestData.progress[0]; // Rank 1
const node1 = rank1.nodes[0];        // Node 1
console.log('Node 1 progress:', node1.nodePercent + '%');
console.log('Node 1 lists:', node1.lists);
```

### Simulate List Completion (Guest)

```javascript
// For testing - manually dispatch list completion
window.dispatchEvent(new CustomEvent('guestListCompletion', {
  detail: {
    rankId: 1,
    nodeId: 1,
    listId: "test_list_123",
    correctAnswers: 7,
    totalWords: 10   // Will be 70%
  }
}));

// Check updated progress
const updated = JSON.parse(localStorage.getItem('wordpapa_guest_journey'));
console.log('Updated:', updated.progress[0].nodes[0]);
```

## Data Flow

```
User Completes List/Practice
    ↓
[Server Path] OR [Guest Path]
    ↓                           ↓
API /journey/list-completion   Dispatch guestListCompletion event
    ↓                           ↓
Calculate nodePercent          Journey page listener catches event
    ↓                           ↓
Save to DB                      trackGuestListCompletion()
    ↓                           ↓
Dispatch journeyProgressUpdated Save to localStorage
    ↓                           ↓
Journey page reloads data       setJourneyData()
    ↓
Node cards display updated progress
```

## Files Modified

- **app/journey/page.js**
  - Added: `initializeGuestProgress()`
  - Added: `calculateNodeProgressFromLists()`
  - Added: `updateGuestNodeProgress()`
  - Added: `trackGuestListCompletion()`
  - Updated: `getGuestJourneyData()`
  - Updated: `updateGuestProgress()`
  - Updated: Journey initialization

## Environment Check

```javascript
// Verify progress structure in browser
const guestData = JSON.parse(localStorage.getItem('wordpapa_guest_journey'));

// Should have:
// ✓ progress array with 8 ranks
// ✓ each rank has nodes array with 5 nodes
// ✓ each node has lists array and nodePercent property
// ✓ each list entry has listId and percent properties

if (guestData?.progress?.length === 8 &&
    guestData.progress[0]?.nodes?.length === 5) {
  console.log('✓ Progress structure initialized correctly');
}
```

## Common Issues

**Issue**: Node progress not updating  
**Solution**: Verify `guestListCompletion` event is dispatched with correct rankId, nodeId, listId

**Issue**: Progress is 0% for all nodes  
**Solution**: Check that lists are being added with percentage values > 0

**Issue**: Progress decreases after practice  
**Solution**: This shouldn't happen - check that `Math.max()` is being used in `updateGuestNodeProgress()`

## Next Steps

1. Add `guestListCompletion` event dispatch to QuizFlow component
2. Add listener for `guestListCompletion` in journey/page.js
3. Test with guest user completing practices
4. Verify progress persists across page reloads
5. Test sync when guest logs in
