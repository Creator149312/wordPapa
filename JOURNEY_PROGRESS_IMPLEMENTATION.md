# Journey Node Progress Implementation

## Overview
This document describes the implementation of node progress visualization on the journey page. Users can now see the progress of each node without clicking on each node to view the lists.

## Data Structure

### Server-Side (Logged-In Users)
```javascript
journeyData.progress = [
  {
    rankId: 1,
    nodes: [
      {
        nodeId: 1,
        lists: [
          { listId: "abc123", percent: 75 },
          { listId: "def456", percent: 80 }
        ],
        nodePercent: 77  // Average of all lists
      }
    ]
  }
]
```

### Guest-Side (localStorage)
Uses the same structure as server-side for consistency. Initialized via `initializeGuestProgress()`.

## Key Components

### 1. `initializeGuestProgress()`
Creates the initial progress structure for guest users:
- Initializes all 8 ranks
- Each rank has 5 nodes
- Each node has empty lists array and 0% nodePercent

### 2. `calculateNodeProgressFromLists(nodeProgress)`
Calculates node progress as the average of all list progress percentages:
```javascript
nodePercent = sum(list.percent for all lists) / number of lists
```

### 3. `updateGuestNodeProgress(data, rankId, nodeId, listId, listPercent)`
Updates a specific list's progress and recalculates the node progress:
- Takes maximum progress (never decreases)
- Recalculates nodePercent automatically
- Returns updated data

### 4. `trackGuestListCompletion(data, rankId, nodeId, listId, correctAnswers, totalWords)`
Records list completion for guests:
- Calculates percentage: `(correctAnswers / totalWords) * 100`
- Calls `updateGuestNodeProgress()` to update node progress
- Persists to localStorage

### 5. `updateGuestProgress(updates)`
Enhanced to handle node/list progress updates:
- Accepts `nodeProgress` object with `rankId`, `nodeId`, `listId`, `percent`
- Updates XP and other journey data as before
- Saves to localStorage
- Dispatches `guestProgressUpdate` event

## How It Works

### For Logged-In Users
1. **Progress Tracking**: When a user completes a list, `/api/journey/list-completion` is called
2. **Calculation**: Server calculates:
   - List progress from practice performance
   - Node progress as average of all lists in node
3. **Display**: Journey page fetches full data via `/api/journey` which includes progress structure
4. **UI Update**: Node cards display `nodePercent` from the progress data

### For Guest Users
1. **Initialization**: When guest starts journey, progress structure is initialized in localStorage
2. **Progress Tracking**: When guest completes list practice:
   - Call `trackGuestListCompletion()` with list details
   - This updates the progress structure and saves to localStorage
3. **Display**: `getGuestJourneyData()` reads from localStorage and passes progress to UI
4. **UI Update**: Node cards display `nodePercent` from localStorage
5. **Sync**: When guest logs in, progress is synced via `/api/journey/sync-guest`

## UI Display

The journey page now displays:
- **Progress Bar**: Shows node progress percentage on each node card
- **Progress Percentage**: Displays `Math.round(nodeProgress.nodePercent)`%
- **Visual Indicator**: Color changes based on completion status

Example progress display on node card:
```
Node 1: Learning Basics
[███░░░░░░] 30%
```

## Integration Points

### QuizFlow Component
When practice is completed for a guest:
```javascript
// For logged-in users: Already tracked via /api/journey/list-completion

// For guests: Need to dispatch custom event with list completion data
window.dispatchEvent(new CustomEvent('guestListCompletion', {
  detail: {
    rankId: rank,
    nodeId: node,
    listId: listId,
    correctAnswers: correctAnswers,
    totalWords: totalWords
  }
}));
```

### Journey Page Listener
Journey page should listen for `guestListCompletion`:
```javascript
const handleGuestListCompletion = (event) => {
  if (isGuest) {
    const { rankId, nodeId, listId, correctAnswers, totalWords } = event.detail;
    const newData = trackGuestListCompletion(
      journeyData,
      rankId,
      nodeId,
      listId,
      correctAnswers,
      totalWords
    );
    localStorage.setItem('wordpapa_guest_journey', JSON.stringify(newData));
    setJourneyData(newData);
  }
};

// Add listener
window.addEventListener('guestListCompletion', handleGuestListCompletion);
```

## Progress Calculation Example

**Scenario**: Guest completes 3 lists in Node 1
- List 1: 8/10 words correct → 80%
- List 2: 9/10 words correct → 90%
- List 3: 6/10 words correct → 60%

**Node Progress**: (80 + 90 + 60) / 3 = 76.67% → **77%**

## Storage

### localStorage Key
- Key: `wordpapa_guest_journey`
- Contains: Full journey object including progress structure

### Server Storage  
- Collection: `JourneyProgress`
- Schema: `JourneyProgressSchema` in models/journeyProgress.js
- Indexed by: `userId`

## Testing Checklist

- [ ] Node cards display progress bars
- [ ] Progress percentage updates after list completion
- [ ] Guest progress persists after page reload
- [ ] Guest progress syncs correctly when logging in
- [ ] Node progress never decreases (max function)
- [ ] All 8 ranks and 5 nodes are initialized
- [ ] Average calculation is correct
- [ ] No console errors

## Future Enhancements

1. **List-Level Details**: Show individual list names and progress in tooltip
2. **Milestone Notifications**: Notify when node reaches 50%, 75%, 100%
3. **Progress History**: Track historical progress for trend analysis
4. **Visual Animations**: Animate progress bar filling up
5. **Rank-Level Progress**: Combine all node progress for rank percentage
