# API Module

## 📋 Overview
Backend REST API endpoints that power all application functionality. All server-side operations are routed through this module using Next.js API routes.

## 🎯 Purpose
- Handle all authentication and user management
- Provide game-related endpoints
- Manage word lists and dictionary operations
- Handle user progress tracking and journey management
- Serve leaderboard data
- Generate dynamic questions and content

## 📁 File Structure
- **admin/** - Admin panel endpoints (bulk creation, templates, node lists)
- **auth/** - Authentication endpoints (NextAuth integration)
- **games/** - Game-specific endpoints (Hangman, etc.)
- **generateQuestions/** - Dynamic question generation
- **generateSentences/** - Sentence generation for learning
- **generateWords/** - Word generation for games
- **journey/** - User journey/progress endpoints
- **leaderboard/** - Rankings and scoring endpoints
- **list/** - Individual list operations
- **lists/** - Multiple lists management
- **register/** - User registration endpoints
- **user/** - User profile and settings endpoints
- **userExists/** - User existence check endpoint
- **userNameExists/** - Username availability check endpoint
- **words/** - Word dictionary and reference endpoints

## 🔗 API Routes Structure
```
/api/admin/*              - Admin operations
/api/auth/[...nextauth]   - NextAuth authentication
/api/games/hangman        - Hangman game logic
/api/generate*            - Content generation
/api/journey              - Progress tracking
/api/leaderboard          - Leaderboard data
/api/list/                - List CRUD operations
/api/lists/               - Bulk list operations
/api/register             - User registration
/api/user/                - User account operations
/api/words/               - Word reference data
```

## 📦 Dependencies
- NextAuth for authentication
- MongoDB for data persistence
- Database models in `/models/`
- External APIs for word data and definitions

## 🔄 Related Modules
- All frontend `/app/*` routes depend on these API endpoints
- `/components/` - UI components that call these endpoints
- `/models/` - Data models used by API handlers

## 🚀 Key Features
1. **RESTful Design** - Standard HTTP methods (GET, POST, PUT, DELETE)
2. **Authentication** - Secure user login/registration via NextAuth
3. **User Progress** - Track journey and game statistics
4. **Dynamic Content** - Generate questions, sentences, and word lists on-the-fly
5. **Leaderboard** - Real-time ranking calculations
6. **Word Management** - Comprehensive word dictionary operations

## 📝 Response Format Standard
All API endpoints should follow this response format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "error": "Optional error"
}
```

## 🔧 Maintenance Notes
- Implement rate limiting on public endpoints
- Add request validation for all POST/PUT requests
- Use middleware for authentication checks
- Log all API requests for debugging
- Monitor API response times
- Handle errors gracefully with meaningful error messages

## 📝 Future Improvements
- Add API documentation/swagger
- Implement caching for frequently accessed data
- Add pagination support for list endpoints
- Implement webhooks for real-time updates
- Add analytics tracking for API usage
- Implement GraphQL as alternative to REST
