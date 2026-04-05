# Infant Level Word Lists - Seeding Guide

## Overview

This guide explains how to add the 10 word lists for the Infant level (Rank 1) to your WordPapa database.

## Lists Included

The Infant level includes 10 word lists across 5 nodes:

### Node 1: Basic Greetings
- **Hello & Goodbye** (15 words) - Basic greetings and farewells
- **Names & Introductions** (12 words) - Introducing yourself

### Node 2: Family & Relations
- **Family Members** (18 words) - Learn family vocabulary
- **Relationship Words** (10 words) - Describe relationships

### Node 3: Colors & Numbers
- **Colors** (12 words) - Basic color vocabulary
- **Numbers 1-20** (20 words) - Counting and numbers

### Node 4: Animals & Nature
- **Common Animals** (25 words) - Animal names
- **Nature Words** (15 words) - Natural elements

### Node 5: Daily Objects
- **Household Items** (20 words) - Home vocabulary
- **Common Objects** (18 words) - Everyday items

**Total: 155 words across 10 lists**

## Option 1: Using the Admin Seeding Page (Recommended)

### Steps:
1. Navigate to: `/admin/seed-infant-lists`
2. You will see a summary of all 10 lists to be created
3. Click the **"Start Seeding"** button
4. Wait for the process to complete
5. View the results showing which lists were created

### What Happens:
- Each list is automatically created via the `/list/bulk-create` API
- Words are enriched automatically from your database or AI
- If a list already exists, it will be skipped
- Results are displayed with success/skip/error status

## Option 2: Using the Bulk List Creator Manually

### Steps:
1. Navigate to: `/admin/bulk-list-creator`
2. For each list:
   - Title: Copy from the list above
   - Description: Copy the description
   - Words: Paste all words (comma or newline separated)
   - Click "Preview" then "Create List"

### Pros:
- Manual control over each list
- Can edit descriptions and words

### Cons:
- Time-consuming for 10 lists
- Requires repetition

## Option 3: Using the Seed Script (For Developers)

### Steps:
1. Ensure MongoDB is running
2. Set `MONGODB_URI` environment variable
3. Run:
```bash
node scripts/seedInfantLists.js
```

### Requirements:
- Node.js environment access
- MongoDB connection
- Admin credentials

## Integrating with Journey

Once the lists are created, they will automatically appear in the Journey system for users:

1. Lists will be available at `/api/list`
2. The Journey page will display these lists in the modal
3. Users can start practicing when they unlock nodes

## Verification

After seeding, verify the lists were created:

1. Go to `/lists` or the admin panel
2. Search for list titles like "Hello & Goodbye", "Family Members", etc.
3. Check that each list has the correct number of words

## Troubleshooting

### Lists not showing up
- Ensure the database connection is working
- Check that the `/list/bulk-create` API is working
- Verify user permissions

### Duplicate errors
- This is normal and expected - they indicate the list already exists
- The seeding process will skip duplicates

### Word enrichment failed
- Partial success is OK - words will still be added to the list
- Words without enrichment data will have basic entries

## Next Steps

1. ✅ Seed Infant level lists (this guide)
2. ⏭️ Update Journey progress tracking to calculate list completion percentages
3. ⏭️ Connect practice/quiz flows to list pages
4. ⏭️ Implement 75% unlock threshold logic
5. ⏭️ Add remaining level lists (Toddler, Child, etc.)

## Data Source

All word lists are defined in:
- `/data/infantLevelLists.js` - Centralized list definitions
- `/scripts/seedInfantLists.js` - Database seeding script

## Questions?

For more information:
- Check the API documentation at `/api/list`
- Review the BulkListCreator component
- Inspect the journey structure at `/app/journey/journeyStructure.js`
