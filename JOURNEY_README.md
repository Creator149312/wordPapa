# WordPapa Journey System

## Overview

The WordPapa Journey System transforms the learning experience into an engaging, gamified adventure where users watch their "Papa" character evolve from infant to WordPapa master.

## Features

### 🎯 Character Evolution
- **Infant** → **Toddler** → **Child** → **Teen** → **Young Adult** → **Adult** → **Scholar** → **WordPapa**
- Visual character changes with each stage advancement
- Smooth animations and growth effects

### 🗺️ Winding Path Journey
- 10 milestone nodes on a Mario World-style path
- Each node represents a stage of language mastery
- Visual progress tracking with character movement

### 🎮 Mission-Based Learning
- Complete missions to advance to the next node
- Missions require using multiple tools (Lab + Arena)
- Example: "Dissect 3 words in the Lab, learn their synonyms, and defeat them in the Arena"

### 📊 Progress Tracking
- Real-time mission progress bars
- XP and achievement system
- Unlocked features as you progress

## Technical Implementation

### Database Schema
```javascript
// Journey Model
{
  userEmail: String,
  currentNode: Number, // 1-10
  characterStage: String, // infant, toddler, etc.
  missionsCompleted: Array,
  activeMission: Object,
  totalMissionsCompleted: Number,
  unlockedFeatures: Array
}
```

### API Endpoints
- `GET /api/journey` - Get user's journey data
- `POST /api/journey` - Update progress
- `POST /api/journey/complete-mission` - Complete missions

### Components
- `JourneyPage` - Main journey interface
- `JourneyPath` - SVG-based winding path
- `MissionNode` - Individual milestone nodes
- `CharacterEvolution` - Animated character sprites
- `MissionModal` - Mission details and progress

### Hooks
- `useJourneyProgress` - Track user actions across tools

## Integration Points

### Tool Integration
Each tool should call the progress tracking hooks:

```javascript
import { useJourneyProgress } from '@/hooks/useJourneyProgress';

const { trackLabAction, trackToolUsage } = useJourneyProgress();

// When user looks up a word
trackLabAction('dictionary');
trackToolUsage('dictionary');

// When user learns a synonym
trackSynonymLearned(word, synonym);
```

### Game Integration
Arena games should track wins:

```javascript
// After winning a game
trackArenaWin('hangman');
```

## Mission Requirements

| Node | Lab Actions | Synonyms | Arena Wins | Tools Required |
|------|-------------|----------|------------|----------------|
| 1 | 5 | 3 | 0 | dictionary, thesaurus |
| 2 | 8 | 5 | 1 | adjectives, rhyming |
| 3 | 10 | 7 | 2 | nouns, syllables |
| 4 | 12 | 8 | 3 | word-finder, sentences |
| 5 | 15 | 10 | 5 | dictionary, thesaurus, arena |

## Guest Mode Support

### 👤 No Login Required
- **Immediate access** - Start your journey without creating an account
- **Local progress** - Progress saved in browser storage
- **Full functionality** - All features work in guest mode

### 🔄 Sync Later
- **Seamless transition** - Login anytime to save progress permanently
- **Progress merging** - Guest progress combines with account data
- **No data loss** - All achievements and progress preserved

### 💾 Technical Details
- Guest data stored in `localStorage` as `wordpapa_guest_journey`
- Automatic sync when user logs in
- Real-time progress updates via custom events

## Future Enhancements

- [ ] Animated path transitions
- [ ] Sound effects for progression
- [ ] Achievement badges
- [ ] Social features (compare progress with friends)
- [ ] Custom character skins
- [ ] Advanced mission types

## Getting Started

1. The journey is available at `/journey`
2. **No login required** - Start immediately as a guest
3. Complete missions by using tools and playing games
4. **Login later** to sync your progress permanently
5. Watch your Papa character grow from infant to master!

The journey system creates a compelling narrative that motivates users to explore all WordPapa features while providing clear progression feedback. The guest mode ensures no barriers to entry, while the sync feature allows seamless progression for registered users.