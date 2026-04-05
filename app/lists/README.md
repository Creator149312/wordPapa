# Lists Module

## 📋 Overview
User word list management module. Handles creation, editing, viewing, and deletion of custom word lists created by users.

## 🎯 Purpose
- Allow users to create custom word lists
- Display user's word lists with pagination
- Support list editing and updating
- Enable list deletion with confirmation
- Generate shareable links for lists
- Track list statistics (word count, difficulty)
- Provide sitemap for SEO

## 📁 File Structure
- **page.js** - Main lists dashboard showing all user lists
- **ListClientWrapper.js** - Client-side wrapper for list operations
- **sitemap.js** - Sitemap generator for SEO
- **addList/** - Create new list interface
- **editList/** - Edit existing list interface
- **[slugId]/** - Dynamic route for individual list viewing

## 🔗 Routes
- `/lists` - User's word lists dashboard
- `/lists/addList` - Create new list
- `/lists/editList` - Edit list
- `/lists/[slugId]` - View individual list

## 📦 Dependencies
- `/api/list/` - Backend CRUD operations
- `/models/list.js` - List data model
- `/components/` - UI components (AddToMyListsButton, RemoveListBtn, etc.)
- NextAuth for user authentication
- Database for list persistence

## 🔄 Related Modules
- `/builder` - Visual list building interface
- `/dashboard` - Quick links to lists
- `/api/list/` - Backend endpoints
- `/models/list.js` - Data schema

## 🚀 Key Features
1. **List Creation** - Create new custom lists
2. **List Viewing** - Display words and list details
3. **List Editing** - Modify existing lists
4. **List Deletion** - Remove lists with confirmation
5. **Pagination** - Browse through lists
6. **List Search** - Find lists by name
7. **Statistics** - Display word count and difficulty
8. **Sharing** - Generate links to share lists
9. **Dark/Light Theme** - Theme-aware display

## 📝 List Properties
- Title
- Description
- Word count
- Difficulty level
- Tags/categories
- Created date
- Last modified date
- Public/private status
- Creator info

## 🔐 Access Control
- Users can only see their own lists
- Option to share lists (make public)
- Prevent unauthorized edits
- Soft delete (archive old lists)

## 🔧 Maintenance Notes
- Monitor list creation rates for spam
- Ensure proper cleanup of deleted lists
- Keep list statistics current
- Validate word additions
- Monitor database storage
- Test pagination with large list counts

## 📝 Future Improvements
- Collaborative list editing (multiple users)
- List forking/copying from other users
- Advanced search and filtering
- Custom list templates
- Export lists (PDF, Excel, etc.)
- Import lists from external sources
- List recommendations based on learning
- Version history for lists
- List quality ratings/reviews
- Access control (public, private, friends-only)
