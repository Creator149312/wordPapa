"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { isAdminEmail } from "@utils/isAdminEmail";

export default function ListTemplatesPage() {
  const { status, data: session } = useSession();
  const fileInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "authenticated" && !isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  // Parse CSV or XLSX file
  const parseFile = async (file, csvText = null) => {
    const fileName = file.name.toLowerCase();
    let data = [];

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Parse XLSX
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        if (rows.length === 0) {
          throw new Error('No data found in Excel file');
        }

        // Validate headers
        const firstRow = rows[0];
        const headers = Object.keys(firstRow).map(h => h.trim().toLowerCase());
        const requiredHeaders = ['title', 'context', 'wordcount'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Map rows to config format
        data = rows.map(row => {
          const titleKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'title');
          const contextKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'context');
          const wordCountKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'wordcount');
          const tagsKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'tags');

          // Tags column is optional — pipe-separated values e.g. "animals|academic"
          const rawTags = tagsKey ? String(row[tagsKey] || '') : '';
          const tags = rawTags
            ? rawTags.split('|').map(t => t.trim().toLowerCase()).filter(Boolean)
            : [];

          return {
            title: row[titleKey] || '',
            context: row[contextKey] || '',
            wordCount: parseInt(row[wordCountKey], 10) || 10,
            tags,
          };
        }).filter(row => row.title && row.context); // Filter out empty rows

      } catch (err) {
        throw new Error(`Excel parsing error: ${err.message}`);
      }
    } else {
      // Parse CSV
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredHeaders = ['title', 'context', 'wordcount'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }
      
      const titleIdx = headers.indexOf('title');
      const contextIdx = headers.indexOf('context');
      const wordCountIdx = headers.indexOf('wordcount');
      const tagsIdx = headers.indexOf('tags'); // optional column
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.every(v => !v)) continue;

        // Tags are pipe-separated within their CSV cell e.g. "animals|academic"
        const rawTags = tagsIdx !== -1 ? (values[tagsIdx] || '') : '';
        const tags = rawTags
          ? rawTags.split('|').map(t => t.trim().toLowerCase()).filter(Boolean)
          : [];

        data.push({
          title: values[titleIdx] || '',
          context: values[contextIdx] || '',
          wordCount: parseInt(values[wordCountIdx], 10) || 10,
          tags,
        });
      }
    }

    return data;
  };

  // Infer tags from title + context when none provided
  const inferTags = (title, context, existingTags) => {
    if (existingTags?.length >= 2) return existingTags;
    const TEXT_LOWER = `${title} ${context}`.toLowerCase();
    const TAG_KEYWORDS = {
      animals: ["animal", "wildlife", "creature", "bird", "mammal", "insect", "reptile", "jungle", "safari", "zoo"],
      food: ["food", "drink", "meal", "cuisine", "recipe", "cooking", "ingredient", "beverage", "fruit", "vegetable"],
      business: ["business", "finance", "marketing", "management", "economy", "corporate", "startup", "investment", "commerce"],
      law: ["law", "legal", "court", "judge", "crime", "justice", "attorney", "contract", "rights", "legislation"],
      technology: ["tech", "digital", "software", "hardware", "internet", "computer", "programming", "ai", "data", "cyber"],
      sports: ["sport", "fitness", "game", "athlete", "competition", "exercise", "team", "training", "match", "olympic"],
      travel: ["travel", "tourism", "destination", "journey", "trip", "culture", "country", "geography", "language", "adventure"],
      medical: ["medical", "health", "disease", "doctor", "hospital", "medicine", "anatomy", "symptom", "treatment", "pharmacy"],
      academic: ["academic", "study", "education", "university", "science", "research", "history", "literature", "philosophy", "mathematics"],
    };
    const matched = Object.entries(TAG_KEYWORDS)
      .filter(([, keywords]) => keywords.some((kw) => TEXT_LOWER.includes(kw)))
      .map(([tag]) => tag);
    const combined = [...new Set([...(existingTags || []), ...matched])];
    // Ensure at least 2 — if only 1 matched, add "academic" as a safe fallback
    if (combined.length === 1) combined.push("academic");
    if (combined.length === 0) return ["academic", "vocabulary"];
    return combined.slice(0, 5);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setResults([]);
      
      const fileName = file.name.toLowerCase();
      let listConfigs;

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Parse XLSX directly
        listConfigs = await parseFile(file);
      } else {
        // Parse CSV
        const fileText = await file.text();
        listConfigs = await parseFile(file, fileText);
      }
      
      if (listConfigs.length === 0) {
        toast.error('No valid rows found in file');
        setIsLoading(false);
        return;
      }

      toast.loading(`Creating ${listConfigs.length} lists...`);
      const creationResults = [];

      for (const config of listConfigs) {
        try {
          // Step 1: Generate words from context using AI
          const generateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/generateWords`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              queryType: 'topic',
              prompt: config.context,
              wordCount: config.wordCount,
            }),
          });

          if (!generateRes.ok) {
            throw new Error(`Failed to generate words: ${generateRes.statusText}`);
          }

          const { words } = await generateRes.json();
          
          if (!words || words.length === 0) {
            throw new Error('No words generated');
          }

          // Limit to requested word count
          const limitedWords = words.slice(0, config.wordCount);

          // Step 2: Enrich words with definitions (from DB or AI)
          const enrichRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/words/enrich`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ words: limitedWords }),
            }
          );

          if (!enrichRes.ok) {
            throw new Error(`Failed to enrich words: ${enrichRes.statusText}`);
          }

          const { words: wordsWithData } = await enrichRes.json();

          // Step 3: Create the list
          const createListRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/list`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: config.title,
                description: config.context,
                words: wordsWithData,
                createdBy: session?.user?.email || 'admin',
                tags: inferTags(config.title, config.context, config.tags),
              }),
            }
          );

          if (!createListRes.ok) {
            const errorData = await createListRes.json();
            throw new Error(errorData.error || 'Failed to create list');
          }

          const { list } = await createListRes.json();

          creationResults.push({
            title: config.title,
            status: 'success',
            message: `Created with ${limitedWords.length} words`,
            listId: list._id,
          });
        } catch (error) {
          creationResults.push({
            title: config.title,
            status: 'error',
            message: error.message,
          });
        }
      }

      setResults(creationResults);
      setShowResults(true);

      const successCount = creationResults.filter(r => r.status === 'success').length;
      const failCount = creationResults.filter(r => r.status === 'error').length;

      toast.dismiss();
      if (failCount === 0) {
        toast.success(`✅ Successfully created all ${successCount} lists!`);
      } else {
        toast.error(`⚠️ Created ${successCount} lists, ${failCount} failed`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            🚀 Bulk List Creator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Import a CSV file with list titles and contexts. AI will generate words and create lists automatically.
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              📥 Import CSV or Excel File
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Required columns: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Title</code>, 
              <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded ml-2">Context</code>, 
              <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded ml-2">WordCount</code>
              <br />
              Optional: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Tags</code> (pipe-separated, e.g. <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">animals|academic</code>)
              <br />
              <span className="text-sm text-slate-500">Supports: .csv, .xlsx, .xls</span>
            </p>
            
            <div className="flex gap-4 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
              />
              <button
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
              >
                {isLoading ? '⏳ Processing...' : 'Upload'}
              </button>
            </div>
          </div>

          {/* CSV Format Example */}
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">📋 File Format Example (CSV or Excel):</h3>
            <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
{`Title,Context,WordCount,Tags
Basic Greetings,Common greetings and farewells,15,academic
Colors,Basic color words,10,academic
Animals of the Jungle,Wild jungle animals,20,animals|academic`}
            </pre>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              💡 Tip: Use columns A–D in Excel for Title, Context, WordCount, Tags. Tags column is optional — separate multiple tags with a pipe <code className="bg-slate-300 dark:bg-slate-700 px-1 rounded">|</code>
            </p>
          </div>
        </Card>

        {/* Results */}
        {showResults && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              📊 Creation Results
            </h2>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-bold ${result.status === 'success' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                        {result.status === 'success' ? '✅' : '❌'} {result.title}
                      </h3>
                      <p className={`text-sm mt-1 ${result.status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        {result.message}
                      </p>
                    </div>
                    {result.listId && (
                      <a
                        href={`/lists/${result.listId}`}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-8 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
            💡 How It Works
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li><strong>1.</strong> Create a CSV or Excel file with columns: Title, Context, WordCount</li>
            <li><strong>2.</strong> Click "Upload" to import the file (.csv, .xlsx, or .xls)</li>
            <li><strong>3.</strong> For each row, AI generates words based on the context</li>
            <li><strong>4.</strong> Words are enriched with definitions - either from the database or AI-generated</li>
            <li><strong>5.</strong> Lists are created with properly defined words</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
