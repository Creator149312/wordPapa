# Bulk List Creator - Testing & Debugging Guide

## 🧪 Unit Testing

### Test the Word Enricher

```javascript
// tests/wordEnricher.test.js
import { enrichWordsWithAI } from "@utils/wordEnricher";

describe("Word Enrichment", () => {
  test("enriches words with AI", async () => {
    const words = ["hello", "world"];
    const result = await enrichWordsWithAI(words);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("word");
    expect(result[0]).toHaveProperty("wordData");
  });

  test("handles empty input", async () => {
    const result = await enrichWordsWithAI([]);
    expect(result).toEqual([]);
  });

  test("parses AI response correctly", async () => {
    const result = await enrichWordsWithAI(["test"]);
    expect(result[0].source).toBe("ai-openai");
  });
});
```

### Test the API Endpoint

```javascript
// tests/api/bulk-create.test.js
import { POST } from "@app/api/list/bulk-create/route";

describe("Bulk Create API", () => {
  test("creates list with words", async () => {
    const request = new Request("http://localhost:3000/api/list/bulk-create", {
      method: "POST",
      body: JSON.stringify({
        title: "Test List",
        words: ["hello", "world"],
        createdBy: "test@example.com",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.list).toBeDefined();
    expect(data.enrichedCount).toBe(2);
  });

  test("validates required fields", async () => {
    const request = new Request("http://localhost:3000/api/list/bulk-create", {
      method: "POST",
      body: JSON.stringify({
        title: "", // Invalid
        words: [],
        createdBy: "test@example.com",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

---

## 🐛 Manual Testing

### Test 1: Basic Word Enrichment

**Steps:**
1. Navigate to `/admin/bulk-list-creator`
2. Enter title: "Test List"
3. Paste words: `hello, world, beautiful`
4. Click "Preview & Verify"
5. Click "Create List"

**Expected:**
- ✅ Toast: "Successfully created list..."
- ✅ Stats show 3 words enriched
- ✅ Some from DB, some from AI

---

### Test 2: Large Batch

**Steps:**
1. Paste 50+ words
2. Click "Preview & Verify"
3. Check word count
4. Create list

**Expected:**
- ✅ Batching happens automatically
- ✅ Handles large lists gracefully
- ✅ API returns stats

---

### Test 3: Duplicate Handling

**Steps:**
1. Paste: `hello, hello, hello, world, world`
2. Click "Preview & Verify"

**Expected:**
- ✅ Shows only 2 words (duplicates removed)
- ✅ Original text shows 5, preview shows 2

---

### Test 4: Special Characters

**Inputs to test:**
- `hello-world` (hyphenated) ✅ Should work
- `it's` (apostrophe) ✅ Should work
- `hello_world` (underscore) ❌ Should be rejected
- `hello123` (numbers) ❌ Should be rejected

---

## 🔍 Debugging

### Enable Console Logging

**In `wordEnricher.js`:**
```javascript
// Add at top
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log("[WordEnricher]", ...args);
}

// Add in enrichWordsWithAI:
log("Starting enrichment for:", words);
log("Batch size:", batchSize);
log("Processing batch:", batch);
log("AI Response:", responseText);
log("Final result:", enrichedWords);
```

### Monitor API Calls

**In browser DevTools (F12):**
1. Open **Network** tab
2. Go to `/admin/bulk-list-creator`
3. Create a list
4. Look for `POST /api/list/bulk-create`
5. Click it and check:
   - **Request payload** - Words sent
   - **Response** - Stats and results

### Check OpenAI API

**Test if OpenAI is working:**
```javascript
// In browser console
const response = await fetch("/api/test-openai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ word: "hello" })
});
console.log(await response.json());
```

**Create test API route:**
```javascript
// app/api/test-openai/route.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { word } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Define this word: ${word}. Return JSON.`,
        },
      ],
    });

    return Response.json({
      success: true,
      content: response.choices[0].message.content,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
```

---

## 📊 Database Debugging

### Check Database Connection

```javascript
// app/api/test-db/route.js
import { connectMongoDB } from "@lib/mongodb";
import Word from "@models/word";

export async function GET() {
  try {
    await connectMongoDB();
    const wordCount = await Word.countDocuments();

    return Response.json({
      connected: true,
      totalWords: wordCount,
    });
  } catch (error) {
    return Response.json({
      connected: false,
      error: error.message,
    });
  }
}
```

### Check if Word Exists in DB

```javascript
// app/api/test-word/route.js
import { connectMongoDB } from "@lib/mongodb";
import Word from "@models/word";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  try {
    await connectMongoDB();
    const wordDoc = await Word.findOne({ word: word.toLowerCase() });

    return Response.json({
      word,
      found: !!wordDoc,
      data: wordDoc,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
    });
  }
}
```

---

## 🚨 Common Issues & Fixes

### Issue: "OPENAI_API_KEY is not set"

**Debug:**
```javascript
console.log("API Key:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");
```

**Fix:**
1. Check `.env.local` file exists
2. Verify exact key name: `OPENAI_API_KEY`
3. Restart dev server after adding key
4. No spaces around `=` sign

### Issue: "Error parsing enrichment response"

**Debug:**
```javascript
// In wordEnricher.js, parseEnrichmentResponse function
console.log("Raw response:", responseText);
try {
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  console.log("JSON match:", jsonMatch?.[0]);
  const parsed = JSON.parse(jsonMatch[0]);
  console.log("Parsed:", parsed);
} catch (error) {
  console.error("Parse error:", error);
}
```

**Possible causes:**
- AI returned non-JSON
- Response format changed
- Network timeout

**Fix:**
- Update prompt in `buildEnrichmentPrompt()`
- Increase timeout in config
- Check OpenAI API status

### Issue: "Word not found in either DB or AI"

**Debug:**
```javascript
// Check DB
const inDB = await Word.findOne({ word: "test" });
console.log("In DB?", !!inDB);

// Check AI response
const aiResult = await enrichWordsWithAI(["test"]);
console.log("AI result:", aiResult);
```

**Likely causes:**
- Word is too obscure
- Database doesn't have it
- AI failed but didn't return error

### Issue: Slow API Response

**Debug:**
```javascript
// Add timing logs
console.time("enrichment");
const result = await enrichWordsWithAI(words);
console.timeEnd("enrichment"); // Shows elapsed time
```

**Optimization tips:**
```javascript
// Increase batch size (fewer API calls)
const batchSize = 20; // Instead of 15

// Use faster model
model: "gpt-3.5-turbo", // Instead of gpt-4o-mini

// Add caching (store definitions)
const cache = new Map();
```

### Issue: DB Connection Timeout

**Debug:**
```javascript
// Check MongoDB URI
console.log("MongoDB URI:", process.env.MONGODB_URI?.substring(0, 20) + "...");

// Check connection
const mongoose = require("mongoose");
console.log("Mongoose state:", mongoose.connection.readyState);
// 0 = disconnected, 1 = connected
```

---

## ✅ Test Checklist

Before deploying to production:

- [ ] Test with 5 words ✅
- [ ] Test with 50 words ✅
- [ ] Test with special formatting ✅
- [ ] Verify OpenAI API works ✅
- [ ] Verify MongoDB connection ✅
- [ ] Check list appears in user's lists ✅
- [ ] Test with authenticated user ✅
- [ ] Test error handling (empty input) ✅
- [ ] Check dark mode display ✅
- [ ] Test on mobile browser ✅
- [ ] Monitor API costs ✅
- [ ] Check server logs for errors ✅

---

## 📈 Performance Profiling

### Measure Component Render Time

```javascript
// In BulkListCreator.js
import { useEffect } from "react";

export default function BulkListCreator() {
  useEffect(() => {
    console.time("BulkListCreator");
    return () => console.timeEnd("BulkListCreator");
  }, []);

  // ... component code
}
```

### Measure API Response Time

```javascript
// In BulkListCreator.js handleCreateList function
const startTime = performance.now();

const response = await fetch(`${apiConfig.apiUrl}/list/bulk-create`, {
  // ... request
});

const endTime = performance.now();
console.log(`API took ${endTime - startTime}ms`);
```

---

## 🔐 Security Testing

### Test Input Validation

```javascript
// Should reject:
- "test123" (numbers)
- "hello_world" (underscore)
- "!!!test" (special chars)

// Should accept:
- "hello" (simple)
- "hello-world" (hyphen)
- "it's" (apostrophe)
```

### Test Authentication

```javascript
// Unauthenticated user should:
- See login prompt
- Not be able to create list

// Authenticated user should:
- See form
- Create list
```

---

## 📝 Logging Best Practices

**Add structured logging:**
```javascript
const logEntry = {
  timestamp: new Date(),
  action: "bulk_create_start",
  wordCount: words.length,
  userEmail: createdBy,
  source: "BulkListCreator",
};

console.log(JSON.stringify(logEntry));
```

**In production, use proper logging:**
```javascript
// npm install winston pino bunyan
import logger from "@utils/logger";

logger.info("Bulk list creation started", { words, user });
logger.error("Enrichment failed", { error });
```

---

## 🎯 Performance Targets

Aim for these metrics:

| Metric | Target | Current |
|--------|--------|---------|
| Component load | < 1s | ? |
| API response (50 words) | < 10s | ? |
| Parsing time | < 500ms | ? |
| DB lookup time | < 1s | ? |
| AI enrichment (50 words) | < 15s | ? |

---

## 💡 Tips for Debugging

1. **Use descriptive console logs**
   ```javascript
   console.log("[API] Received words:", words);
   ```

2. **Check multiple browsers**
   ```
   Chrome → Check Network tab
   Firefox → Check Console
   Safari → Check DevTools
   ```

3. **Test with simple cases first**
   ```
   Start with: hello, world
   Then: 10 words
   Then: 100 words
   ```

4. **Isolate the problem**
   ```
   DB working? → Check API
   API working? → Check component
   Component working? → Check styling
   ```

5. **Use error boundaries** (React)
   ```javascript
   <ErrorBoundary>
     <BulkListCreator />
   </ErrorBoundary>
   ```

---

**Happy debugging! 🐛**
