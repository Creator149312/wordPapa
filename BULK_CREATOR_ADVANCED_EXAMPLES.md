/**
 * Advanced Integration Examples
 * Copy relevant sections into your codebase for advanced features
 */

// ============================================================================
// EXAMPLE 1: Integration with NavBar
// Place in: app/admin/layout.js or components/AdminNav.js
// ============================================================================

export function AdminNavIntegration() {
  return (
    <nav className="bg-slate-900 text-white p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex gap-6">
          <a href="/admin/dashboard" className="hover:text-blue-400">
            Dashboard
          </a>
          <a href="/admin/users" className="hover:text-blue-400">
            Users
          </a>
          <a href="/admin/bulk-list-creator" className="hover:text-blue-400">
            📤 Bulk List Creator
          </a>
          <a href="/admin/word-database" className="hover:text-blue-400">
            📚 Word Database
          </a>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// EXAMPLE 2: Custom Enrichment Hook
// Place in: hooks/useBulkListCreator.js
// ============================================================================

export async function useBulkListCreatorHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const createBulkList = async (title, words, description) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/list/bulk-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          words,
          description,
          // Can pass additional params here
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStats({
          totalWords: data.enrichedCount,
          fromDB: data.fromDatabase,
          fromAI: data.fromAI,
          timestamp: new Date(),
        });

        return { success: true, listId: data.list._id, ...data };
      } else {
        return { success: false, error: data.error };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createBulkList, isLoading, stats };
}

// ============================================================================
// EXAMPLE 3: Batch Processing with Progress
// Place in: utils/bulkProcessorWithProgress.js
// ============================================================================

export async function processBulkListWithProgress(
  words,
  onProgress,
  onError
) {
  const BATCH_SIZE = 15;
  const totalBatches = Math.ceil(words.length / BATCH_SIZE);
  const results = [];

  for (let i = 0; i < totalBatches; i++) {
    try {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, words.length);
      const batch = words.slice(start, end);

      const progress = ((i + 1) / totalBatches) * 100;
      onProgress({
        current: i + 1,
        total: totalBatches,
        percentage: progress,
        currentBatchSize: batch.length,
      });

      // Process batch...
      const batchResults = await enrichWordsWithAI(batch);
      results.push(...batchResults);

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      onError({
        batch: i + 1,
        error: error.message,
        progress: ((i + 1) / totalBatches) * 100,
      });
    }
  }

  return results;
}

// ============================================================================
// EXAMPLE 4: List Management Component
// Place in: components/BulkListManager.js
// ============================================================================

export function BulkListManagerComponent() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const loadBulkLists = async () => {
    const response = await fetch("/api/list/user/current", {
      headers: { "x-list-source": "bulk-import" },
    });
    const data = await response.json();
    setLists(data.lists);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Bulk Lists</h2>

      {lists.map((list) => (
        <div
          key={list._id}
          className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => setSelectedList(list)}
        >
          <h3 className="font-bold text-slate-900 dark:text-white">
            {list.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {list.words.length} words • Created{" "}
            {new Date(list.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex gap-2">
            <button className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
              View
            </button>
            <button className="text-xs px-2 py-1 bg-red-600 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: File Upload Support
// Place in: components/BulkListUploader.js
// ============================================================================

export function BulkListUploaderComponent() {
  const handleFileUpload = async (file) => {
    // Support CSV, TXT, XLSX
    const extension = file.name.split(".").pop().toLowerCase();

    let words = [];

    if (extension === "csv" || extension === "txt") {
      const text = await file.text();
      words = text.split(/[,\n\r]+/).map((w) => w.trim());
    } else if (extension === "xlsx") {
      // Requires: npm install xlsx
      const XLSX = require("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      words = XLSX.utils.sheet_to_json(worksheet).map((row) => {
        return row.word || row.Word || Object.values(row)[0];
      });
    }

    return words.filter((w) => w && w.trim());
  };

  return (
    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept=".csv,.txt,.xlsx"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      <p className="mt-2 text-sm text-slate-600">
        Supported: CSV, TXT, XLSX
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Statistics Dashboard
// Place in: components/BulkOperationStats.js
// ============================================================================

export function BulkOperationStatsComponent({ stats }) {
  const dbPercentage = (
    (stats.fromDatabase / stats.enrichedCount) *
    100
  ).toFixed(0);
  const aiPercentage = ((stats.fromAI / stats.enrichedCount) * 100).toFixed(0);
  const estimatedCost = (stats.fromAI * 0.00015).toFixed(4); // Estimate OpenAI cost

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
        <h4 className="font-bold text-green-900 dark:text-green-100">
          Total Words
        </h4>
        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
          {stats.enrichedCount}
        </p>
      </div>

      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h4 className="font-bold text-blue-900 dark:text-blue-100">
          From Database
        </h4>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
          {stats.fromDatabase}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {dbPercentage}% (No AI cost)
        </p>
      </div>

      <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <h4 className="font-bold text-purple-900 dark:text-purple-100">
          AI Enriched
        </h4>
        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
          {stats.fromAI}
        </p>
        <p className="text-xs text-purple-600 dark:text-purple-400">
          Est. ${estimatedCost}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Advanced Validation
// Place in: utils/advancedValidation.js
// ============================================================================

export function validateBulkInput(words, config) {
  const errors = [];

  if (words.length < config.validation.minWords) {
    errors.push(
      `Minimum ${config.validation.minWords} words required`
    );
  }

  if (words.length > config.validation.maxWords) {
    errors.push(
      `Maximum ${config.validation.maxWords} words allowed`
    );
  }

  words.forEach((word, index) => {
    if (word.length < config.words.minLength) {
      errors.push(
        `Word ${index + 1} "${word}" is too short (min: ${config.words.minLength} chars)`
      );
    }

    if (word.length > config.words.maxLength) {
      errors.push(
        `Word ${index + 1} "${word}" is too long (max: ${config.words.maxLength} chars)`
      );
    }

    if (!config.words.allowedPattern.test(word)) {
      errors.push(
        `Word ${index + 1} "${word}" contains invalid characters`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
}

// ============================================================================
// EXAMPLE 8: Webhook Notification
// Place in: utils/webhookNotifier.js
// ============================================================================

export async function notifyWebhookOnBulkCompletion(data) {
  // Useful for integrations with external systems
  if (!process.env.WEBHOOK_URL) return;

  const payload = {
    event: "bulk_list_created",
    timestamp: new Date(),
    data: {
      listId: data.list._id,
      title: data.list.title,
      wordCount: data.enrichedCount,
      fromDatabase: data.fromDatabase,
      fromAI: data.fromAI,
      createdBy: data.list.createdBy,
    },
  };

  try {
    await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Webhook notification failed:", error);
  }
}

// ============================================================================
// EXAMPLE 9: Background Job Processing (via job queue)
// Place in: utils/bulkJobQueue.js
// Requires: npm install bull (or use similar job queue)
// ============================================================================

export async function enqueueBulkListCreation(
  title,
  words,
  createdBy,
  onProgress
) {
  // For very large bulk operations (1000+ words)
  // Use a job queue to avoid timeout

  // const Queue = require('bull');
  // const bulkQueue = new Queue('bulk-list-creation', process.env.REDIS_URL);

  // const job = await bulkQueue.add({
  //   title,
  //   words,
  //   createdBy,
  // });

  // job.progress((current, total) => {
  //   onProgress({ current, total, percentage: (current / total) * 100 });
  // });

  // return job.waitUntilFinished();
}

// ============================================================================
// EXAMPLE 10: Audit Logging
// Place in: utils/auditLogger.js
// ============================================================================

export async function logBulkListCreation(data) {
  const logEntry = {
    timestamp: new Date(),
    action: "bulk_list_created",
    createdBy: data.createdBy,
    listId: data.listId,
    wordCount: data.wordCount,
    fromDatabase: data.fromDatabase,
    fromAI: data.fromAI,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  };

  // Save to database, file, or logging service
  console.log("AUDIT LOG:", JSON.stringify(logEntry, null, 2));

  // In production, use:
  // await AuditLog.create(logEntry);
  // or
  // logger.info("Bulk list created", logEntry);
}

// ============================================================================
// EXAMPLE 11: Rate Limiting Middleware
// Place in: middleware/bulkRateLimit.js
// ============================================================================

const requestCounts = new Map();

export function bulkListRateLimiter(req, res, next) {
  const userId = req.session?.user?.email;
  const now = Date.now();

  if (!requestCounts.has(userId)) {
    requestCounts.set(userId, []);
  }

  const userRequests = requestCounts.get(userId);

  // Remove old requests (older than 1 hour)
  const recentRequests = userRequests.filter((time) => now - time < 3600000);

  // Limit to 5 requests per hour
  if (recentRequests.length >= 5) {
    return res.status(429).json({
      error: "Rate limit exceeded. Max 5 bulk lists per hour.",
      retryAfter: 3600,
    });
  }

  recentRequests.push(now);
  requestCounts.set(userId, recentRequests);

  next();
}

// ============================================================================
// EXAMPLE 12: Export/Import Format Converter
// Place in: utils/bulkFormatConverter.js
// ============================================================================

export function convertToQuizletFormat(list) {
  // Export list in Quizlet CSV format
  const csv = list.words
    .map((w) => `"${w.word}";"${w.wordData}"`)
    .join("\n");

  return csv;
}

export function convertToAnkiFormat(list) {
  // Export list in Anki format
  const anki = list.words.map((w) => `${w.word}\t${w.wordData}`).join("\n");

  return anki;
}

export function convertToJSONFormat(list) {
  return JSON.stringify(
    {
      title: list.title,
      description: list.description,
      words: list.words,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

export default {
  AdminNavIntegration,
  useBulkListCreatorHook,
  processBulkListWithProgress,
  BulkListManagerComponent,
  BulkListUploaderComponent,
  BulkOperationStatsComponent,
  validateBulkInput,
  notifyWebhookOnBulkCompletion,
  enqueueBulkListCreation,
  logBulkListCreation,
  bulkListRateLimiter,
  convertToQuizletFormat,
  convertToAnkiFormat,
  convertToJSONFormat,
};
