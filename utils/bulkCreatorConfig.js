/**
 * Bulk List Creator Configuration
 * Customize this file to adjust behavior, models, and validation
 * 
 * Usage in wordEnricher.js:
 * import { ENRICHER_CONFIG } from "@utils/bulkCreatorConfig";
 */

export const ENRICHER_CONFIG = {
  // AI Model Configuration
  ai: {
    // Model choice: 'gpt-4o' | 'gpt-4-turbo' | 'gpt-4o-mini' | 'gpt-3.5-turbo'
    // Recommendation: gpt-4o-mini for cost efficiency, gpt-4o for quality
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",

    // Max tokens per request
    maxTokens: 2048,

    // Temperature: 0 = deterministic, 1 = creative
    temperature: 0.3,

    // API timeout in milliseconds
    timeout: 30000,
  },

  // Word Processing Configuration
  words: {
    // Maximum words to process per batch
    batchSize: 15,

    // Minimum word length (excluding shorter words)
    minLength: 2,

    // Maximum word length
    maxLength: 50,

    // Allowed characters in words (regex pattern)
    allowedPattern: /^[a-z\s'-]+$/i,

    // Auto-remove duplicates
    removeDuplicates: true,

    // Auto-lowercase all words
    toLowercase: true,
  },

  // Database Configuration
  database: {
    // Look up words in database first
    checkDbFirst: true,

    // If DB lookup fails, skip AI and use placeholder
    useDbPlaceholderOnFailure: false,
  },

  // Prompt Engineering
  prompt: {
    // System role for AI
    systemRole:
      "Act as a professional lexicographer. Provide accurate, concise definitions with part of speech and examples.",

    // Include examples in response
    includeExamples: true,

    // Include difficulty level
    includeDifficulty: false,

    // Include synonyms
    includeSynonyms: false,
  },

  // API Response Configuration
  response: {
    // Include enrichment statistics
    includeStats: true,

    // Include source information (database vs AI)
    includeSource: true,

    // Return word status after enrichment
    includeStatus: false,
  },

  // Validation & Constraints
  validation: {
    // Minimum words required
    minWords: 1,

    // Maximum words allowed per list
    maxWords: 1000,

    // Required list title
    requireTitle: true,

    // List title min length
    titleMinLength: 3,

    // List title max length
    titleMaxLength: 100,
  },

  // Error Handling
  errors: {
    // Continue processing if AI call fails for one batch
    continueOnBatchFailure: true,

    // Use placeholder if AI fails
    usePlaceholderOnAIFailure: true,

    // Log errors to console
    logErrors: true,

    // Log enrichment stats
    logStats: true,
  },

  // Feature Flags
  features: {
    // Enable AI enrichment
    enableAI: true,

    // Enable database lookup
    enableDB: true,

    // Enable duplicate removal
    enableDedupe: true,

    // Enable input sanitization
    enableSanitization: true,

    // Enable preview mode in UI
    enablePreview: true,

    // Show enrichment progress to user
    showProgress: true,
  },

  // Caching Configuration (future enhancement)
  cache: {
    // Enable caching of definitions
    enabled: false,

    // Cache duration in milliseconds (1 hour)
    ttl: 60 * 60 * 1000,

    // Cache only database definitions
    onlyDB: true,
  },
};

/**
 * Prompt templates for different AI providers
 */
export const PROMPT_TEMPLATES = {
  openai: {
    definition: `Act as a professional lexicographer. For each word in the following list, provide a concise definition with part of speech and one example sentence.

IMPORTANT: Return your response as valid JSON only, with no markdown formatting or extra text. The JSON must be an array of objects with this exact structure:
[
  {
    "word": "example",
    "definition": "(noun) A thing characteristic of its kind or illustrating a general rule; a specimen.",
    "example": "Our company is an example of a successful startup."
  },
  ...
]

Words to define: {words}

Return ONLY the JSON array, no additional text or markdown formatting.`,

    advanced: `Act as a professional lexicographer and linguist. For each word in the following list, provide comprehensive linguistic data.

IMPORTANT: Return your response as valid JSON array. Structure:
[
  {
    "word": "example",
    "definitions": [
      {
        "pos": "noun",
        "definition": "A thing characteristic of its kind...",
        "example": "Our company is an example..."
      }
    ],
    "synonyms": ["instance", "sample"],
    "difficulty": "intermediate"
  },
  ...
]

Words: {words}`,
  },

  gemini: {
    definition: `As a lexicographer, define these words with part of speech and examples.

Return JSON array:
[
  {
    "word": "term",
    "definition": "(pos) meaning",
    "example": "sentence with word"
  }
]

Words: {words}`,
  },
};

/**
 * Validation rules for different fields
 */
export const VALIDATION_RULES = {
  listTitle: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&,\.]+$/, // Alphanumeric, spaces, hyphens, ampersand, comma, period
    message: "Title must be 3-100 characters and contain valid characters",
  },

  listDescription: {
    required: false,
    maxLength: 500,
    message: "Description must not exceed 500 characters",
  },

  word: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-z\s'-]+$/i,
    message: "Words must contain only letters, hyphens, and apostrophes",
  },
};

/**
 * Cost estimation helper
 * Useful for calculating API costs before bulk operations
 */
export const calculateAIEnrichmentCost = (wordCount) => {
  // Rough estimation for gpt-4o-mini
  // ~100 tokens per word on average
  const estimatedTokens = wordCount * 100;
  const costPerMillionTokens = 0.15; // Input cost for gpt-4o-mini

  return (estimatedTokens / 1000000) * costPerMillionTokens;
};

/**
 * Timeout handler for batch processing
 */
export const BATCH_TIMEOUTS = {
  // Timeout for single API call
  apiCall: 30000, // 30 seconds

  // Timeout for entire batch
  batch: 120000, // 2 minutes

  // Timeout for database query
  dbQuery: 10000, // 10 seconds
};

/**
 * Format word response for list storage
 */
export const formatWordDataForStorage = (word, aiResponse) => {
  const { definition, example, synonyms } = aiResponse;

  let formattedData = definition;

  if (example) {
    formattedData += ` Example: ${example}`;
  }

  if (synonyms && synonyms.length > 0) {
    formattedData += ` | Synonyms: ${synonyms.join(", ")}`;
  }

  return {
    word,
    wordData: formattedData,
    enrichedAt: new Date(),
  };
};

/**
 * Email notification template (for future enhancement)
 */
export const EMAIL_TEMPLATES = {
  bulkCreationSuccess: {
    subject: "Bulk List Created Successfully",
    template: `
      <h2>Your bulk list "{listTitle}" has been created!</h2>
      <p>Words processed: {wordCount}</p>
      <p>From database: {dbCount}</p>
      <p>From AI: {aiCount}</p>
      <p>View your list: {listLink}</p>
    `,
  },

  bulkCreationFailed: {
    subject: "Bulk List Creation Failed",
    template: `
      <h2>Error creating bulk list "{listTitle}"</h2>
      <p>Reason: {errorMessage}</p>
      <p>Please try again or contact support.</p>
    `,
  },
};

export default ENRICHER_CONFIG;
