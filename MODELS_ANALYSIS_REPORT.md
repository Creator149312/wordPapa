# Models Directory Analysis Report

**Report Date**: April 5, 2026  
**Status**: ✅ All Models In Use  
**Total Models**: 8  
**Unused Models**: 0  

---

## 📊 Quick Summary

| Model | Status | Used By | Purpose |
|-------|--------|---------|---------|
| **list.js** | ✅ Active | 19 files | Word list management |
| **user.js** | ✅ Active | 11 files | User accounts & auth |
| **journey.js** | ✅ Active | 10 files | User learning journey |
| **nodeList.js** | ✅ Active | 8 files | Journey node structure |
| **gameprofile.js** | ✅ Active | 7 files | Game stats & XP |
| **word.js** | ✅ Active | 6 files | Word reference data |
| **journeyProgress.js** | ✅ Active | 6 files | Journey progress tracking |
| **listTemplate.js** | ✅ Active | 2 files | List templates for bulk creation |

**Total Usage Across Codebase**: 56+ files import these models

---

## 📋 Detailed Model Documentation

### 1. **list.js** ⭐ Most Used (19 files)

**Purpose**: Word list model for user-created and system lists.

**Key Features**:
- CRUD operations for word lists
- List metadata (title, description, words, difficulty)
- User ownership tracking
- Timestamps (created, modified)
- Public/private visibility

**Used By**:
- List management: `/app/api/list/*` (8 files)
- Journey system: `/app/api/journey/*` (9 files)  
- Admin: `/app/api/admin/node-lists/route.js`
- Frontend: `app/lists/sitemap.js`
- Practice stats: `/app/api/user/practice-stats/route.js`

**API Endpoints**:
- GET `/api/list` - Fetch lists
- POST `/api/list` - Create list
- PUT `/api/list/[id]` - Update list
- DELETE `/api/list/[id]` - Delete list
- GET `/api/list/user/[createdBy]` - User's lists
- POST `/api/list/bulk-create` - Batch create

---

### 2. **user.js** (11 files)

**Purpose**: User account model with authentication and profile management.

**Key Features**:
- Email & password (hashed)
- User profile info (name, preferences)
- Authentication credentials
- Email verification status
- Account creation/update dates

**Used By**:
- Auth endpoints: `/api/auth/*` (1 file)
- User registration: `/api/register/route.js`
- User checks: `/api/userExists/route.js`, `/api/userNameExists/route.js`
- User management: `/api/user/route.js`
- Games: `/app/api/games/hangman/sync/route.js`
- Journey: `/app/api/journey/*` (4 files)
- Components: `components/actions/actions.js`

**API Endpoints**:
- GET `/api/user` - Get user profile
- POST `/api/register` - Create user
- GET `/api/userExists` - Check email exists
- GET `/api/userNameExists` - Check username exists

---

### 3. **journey.js** (10 files)

**Purpose**: User's learning journey and mission structure.

**Key Features**:
- Journey stages/levels
- Mission nodes and progression
- Journey completion tracking
- User journey assignments
- Difficulty/tier management

**Used By**:
- Journey routes: `/app/api/journey/*` (9 files)
- List practice: `/app/api/lists/practice/route.js`

**API Endpoints**:
- GET `/api/journey` - Get user journey
- GET `/api/journey/nodes` - Get all nodes
- GET `/api/journey/node-progress` - Track progress
- POST `/api/journey/complete-mission` - Mark mission complete

---

### 4. **nodeList.js** (8 files)

**Purpose**: Association model between journey nodes and word lists.

**Key Features**:
- Node-to-list relationships
- Word assignments to nodes
- Node difficulty levels
- Progress tracking per node

**Used By**:
- Journey system: `/app/api/journey/*` (6 files)
- Admin: `/app/api/admin/node-lists/route.js`

**API Endpoints**:
- GET `/api/journey/node-lists` - Get node-list associations
- GET `/api/journey/node-words` - Get words in node

---

### 5. **gameprofile.js** (7 files)

**Purpose**: Track user game statistics and XP/points.

**Key Features**:
- XP points and levels
- Game wins/losses
- Streak tracking
- Achievement badges
- Leaderboard scores

**Used By**:
- Game sync: `/app/api/games/hangman/sync/route.js`
- Leaderboard: `/app/api/leaderboard/route.js`, `/app/api/games/hangman/leaderboard/route.js`
- Journey completion: `/app/api/journey/complete-mission/route.js`
- User stats: `/app/api/user/hud/route.js`
- Journey sync: `/app/api/journey/sync-guest/route.js`

**API Endpoints**:
- GET `/api/leaderboard` - Get rankings
- POST `/api/games/hangman/sync` - Sync game stats
- GET `/api/user/hud` - Get user dashboard data

---

### 6. **word.js** (6 files)

**Purpose**: Word dictionary and reference model.

**Key Features**:
- Word text and metadata
- Definitions and examples
- Word type/part of speech
- Difficulty level
- Pronunciation data

**Used By**:
- Word endpoints: `/app/api/words/*` (4 files)
- Word definitions: `app/define/[word]/page.js`
- List operations: `/app/api/list/bulk-create/route.js`

**API Endpoints**:
- GET `/api/words/[word]` - Get word details
- POST `/api/words` - Add word
- POST `/api/words/upload-words` - Bulk upload
- POST `/api/words/enrich` - Enrich word data

---

### 7. **journeyProgress.js** (6 files)

**Purpose**: Track individual user progress through journey missions.

**Key Features**:
- Progress per mission/node
- Completion status
- Attempt/retry counts
- Performance metrics
- Time tracking

**Used By**:
- Journey endpoints: `/app/api/journey/*` (5 files including update, sync, progress, list-completion, debug)

**API Endpoints**:
- GET `/api/journey` - Get journey progress
- PUT `/api/journey/update.js` - Update progress
- GET `/api/journey/progress.js` - Detailed progress
- GET `/api/journey/list-completion` - List completion status

---

### 8. **listTemplate.js** (2 files) - Least Used

**Purpose**: Template model for bulk list creation.

**Key Features**:
- Template name and description
- Template word patterns
- Difficulty presets
- Reusable configurations

**Used By**:
- Admin endpoints: `/app/api/admin/list-templates/route.js`
- Admin bulk create: `/app/api/admin/bulk-create-from-templates/route.js`

**API Endpoints**:
- GET `/api/admin/list-templates` - Get templates
- POST `/api/admin/list-templates` - Create template
- POST `/api/admin/bulk-create-from-templates` - Use template

---

## 🔄 Model Relationships

```
user
├── journey (one-to-one)
│   └── journeyProgress (one-to-many)
├── gameprofile (one-to-one)
├── list (one-to-many - user created lists)
│   └── word (many-to-many through list.words)
│
nodeList
├── journey node reference
│   └── list (many-to-many)
│
listTemplate
└── Used by: admin bulk create operations
```

---

## 📈 Usage Statistics

| Metric | Value |
|--------|-------|
| Most Used | list.js (19 files, 34%) |
| Average Usage | 7 files per model |
| Total References | 56+ files |
| Highest Tier | Core/Essential (list, user, journey) |
| Mid Tier | Important (nodeList, gameprofile) |
| Lower Tier | Specialized (listTemplate, word) |

---

## ✅ Verification Results

### All Models Status: ACTIVE ✅

- No orphaned models detected
- No duplicate models
- All models have documented usage
- Cross-references are valid

### Critical Models (Cannot Delete):
- ✅ **list.js** - Used in 19 places, core to platform
- ✅ **user.js** - Used in 11 places, authentication
- ✅ **journey.js** - Used in 10 places, learning path

### Important Models (High Priority):
- ✅ **nodeList.js** - Journey structure (8 files)
- ✅ **gameprofile.js** - Game stats (7 files)

### Specialized Models (Functional):
- ✅ **word.js** - Word reference (6 files)
- ✅ **journeyProgress.js** - Progress tracking (6 files)
- ✅ **listTemplate.js** - Admin templates (2 files)

---

## 🔍 Dependency Analysis

### No Circular Dependencies Detected ✅
- Model imports follow clear hierarchy
- No bidirectional references between models

### Import Patterns:
```javascript
// Standard pattern used throughout:
import List from '@/models/list';
import User from '@/models/user';
import Journey from '@/models/journey';
```

---

## 📝 Recommendations

### Current State:
✅ **All models are properly utilized** - No cleanup needed

### Best Practices to Maintain:
1. **Keep models focused** - Each handles one entity type
2. **Document schemas** - Update this doc when schema changes
3. **Monitor dependencies** - Check quarterly for unused code
4. **Maintain relationships** - Keep cross-references documented
5. **Version control** - Track model changes in git

### Future Considerations:
- Consider consolidating if journey-related models grow complex
- Document API response schemas alongside models
- Create migration scripts for schema updates
- Implement model validation layer

---

## 🔗 Related Documentation

- Main App Docs: [app/DOCUMENTATION.md](../app/DOCUMENTATION.md)
- API Guide: [app/api/README.md](../app/api/README.md)
- Journey System: [JOURNEY_README.md](../JOURNEY_README.md)
- Data Architecture: See individual module READMEs

---

## 📋 Checklist for Developers

Before modifying models:
- [ ] Check which files import this model
- [ ] Review model schema thoroughly
- [ ] Test backward compatibility
- [ ] Update this documentation
- [ ] Run full test suite
- [ ] Check leaderboard/journey operations
- [ ] Verify admin functions still work

---

**Conclusion**: The models directory is well-organized with no unused code. All 8 models serve specific purposes and are actively used throughout the application. The hierarchy is clean and dependencies are properly managed.

**Last Verified**: April 5, 2026  
**Status**: ✅ All Systems Green
