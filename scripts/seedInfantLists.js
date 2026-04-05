#!/usr/bin/env node

// Script to seed Infant level word lists to database
// Run with: node scripts/seedInfantLists.js

const mongoose = require('mongoose');
const path = require('path');

// Import models (adjust path as needed)
const List = require('../models/list').default;
const Word = require('../models/word').default;

// Infant level lists data
const infantLists = [
  {
    title: "Hello & Goodbye",
    description: "Learn basic greetings and farewells",
    topic: "Basic Greetings",
    words: [
      "hello",
      "hi",
      "goodbye",
      "bye",
      "good morning",
      "good afternoon",
      "good evening",
      "good night",
      "welcome",
      "farewell",
      "cheerio",
      "adios",
      "see you",
      "take care",
      "have a nice day"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Names & Introductions",
    description: "Introduce yourself and learn names",
    topic: "Basic Greetings",
    words: [
      "name",
      "introduction",
      "my name is",
      "nice to meet you",
      "what is your name",
      "i am",
      "you are",
      "he is",
      "she is",
      "pleased",
      "introduction",
      "acquaintance"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Family Members",
    description: "Learn how to name your family",
    topic: "Family & Relations",
    words: [
      "mother",
      "father",
      "mom",
      "dad",
      "sister",
      "brother",
      "grandmother",
      "grandfather",
      "grandma",
      "grandpa",
      "aunt",
      "uncle",
      "cousin",
      "niece",
      "nephew",
      "wife",
      "husband",
      "daughter"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Relationship Words",
    description: "Describe family relationships",
    topic: "Family & Relations",
    words: [
      "family",
      "parent",
      "sibling",
      "relative",
      "child",
      "ancestor",
      "descendant",
      "relation",
      "kin",
      "loved one"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Colors",
    description: "Learn basic color vocabulary",
    topic: "Colors & Numbers",
    words: [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "black",
      "white",
      "brown",
      "grey",
      "gray"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Numbers 1-20",
    description: "Count and learn numbers",
    topic: "Colors & Numbers",
    words: [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Common Animals",
    description: "Learn names of common animals",
    topic: "Animals & Nature",
    words: [
      "dog",
      "cat",
      "bird",
      "fish",
      "rabbit",
      "horse",
      "cow",
      "pig",
      "chicken",
      "duck",
      "lion",
      "tiger",
      "bear",
      "monkey",
      "elephant",
      "giraffe",
      "zebra",
      "penguin",
      "eagle",
      "butterfly",
      "bee",
      "spider",
      "snake",
      "frog",
      "sheep"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Nature Words",
    description: "Vocabulary about natural elements",
    topic: "Animals & Nature",
    words: [
      "tree",
      "flower",
      "grass",
      "water",
      "rock",
      "sky",
      "sun",
      "moon",
      "star",
      "cloud",
      "rain",
      "snow",
      "wind",
      "forest",
      "mountain"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Household Items",
    description: "Common things at home",
    topic: "Daily Objects",
    words: [
      "table",
      "chair",
      "bed",
      "lamp",
      "door",
      "window",
      "wall",
      "floor",
      "ceiling",
      "sofa",
      "rug",
      "curtain",
      "mirror",
      "picture",
      "shelf",
      "refrigerator",
      "stove",
      "sink",
      "cup",
      "plate"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  },
  {
    title: "Common Objects",
    description: "Everyday things we use",
    topic: "Daily Objects",
    words: [
      "pen",
      "pencil",
      "paper",
      "book",
      "desk",
      "computer",
      "phone",
      "watch",
      "key",
      "bag",
      "shoe",
      "hat",
      "coat",
      "bottle",
      "glass",
      "spoon",
      "fork",
      "knife"
    ],
    difficulty: "beginner",
    createdBy: "admin@wordpapa.com"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wordpapa', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    let createdCount = 0;
    let successCount = 0;

    for (const listData of infantLists) {
      try {
        // Check if list already exists
        const existing = await List.findOne({ title: listData.title });
        if (existing) {
          console.log(`⏭️  Skipping "${listData.title}" - already exists`);
          continue;
        }

        // Create new list
        const newList = new List({
          title: listData.title,
          slug: listData.title.toLowerCase().replace(/\s+/g, '-'),
          description: listData.description,
          topic: listData.topic,
          difficulty: listData.difficulty,
          createdBy: listData.createdBy,
          wordCount: listData.words.length,
          words: [],
          isPublic: true,
          tags: [listData.topic, 'infant', 'beginner']
        });

        // Create words
        const wordIds = [];
        for (const wordText of listData.words) {
          const newWord = new Word({
            word: wordText,
            meaning: `Definition of ${wordText}`, // Placeholder
            example: `Example sentence with ${wordText}`, // Placeholder
            difficulty: 'beginner',
            partOfSpeech: 'noun',
            createdBy: listData.createdBy
          });

          const savedWord = await newWord.save();
          wordIds.push(savedWord._id);
        }

        newList.words = wordIds;
        await newList.save();

        console.log(`✅ Created list: "${listData.title}" with ${listData.words.length} words`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating list "${listData.title}":`, error.message);
      }
      createdCount++;
    }

    console.log(`\n📊 Seeding complete: ${successCount}/${createdCount} lists created successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  }
}

seedDatabase();
