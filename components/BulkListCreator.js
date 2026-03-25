"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";
import Toast from "@components/Toast";
import { Upload, Loader2, X, Plus, ChevronLeft } from "lucide-react";

export default function BulkListCreator() {
  const [listTitle, setListTitle] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [wordsInput, setWordsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [wordStatuses, setWordStatuses] = useState({}); // Track enrichment status
  const [showPreview, setShowPreview] = useState(false);
  const { status, data: session } = useSession();

  // Parse input text into array of words
  const parseWords = (text) => {
    if (!text.trim()) return [];

    // Split by comma, newline, or space and filter
    const words = text
      .split(/[,\n\s]+/)
      .map((w) => w.trim().toLowerCase())
      .filter(
        (w) =>
          w.length > 0 && // Remove empty strings
          /^[a-z\s'-]+$/.test(w) // Only allow letters, spaces, hyphens, and apostrophes
      )
      .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates

    return words;
  };

  const handleParsePreview = () => {
    const words = parseWords(wordsInput);
    setParsedWords(words);
    setWordStatuses({});
    setShowPreview(true);
  };

  const handleCreateList = async () => {
    if (!listTitle.trim()) {
      setToastMessage("List title is required");
      return;
    }

    if (parsedWords.length === 0) {
      setToastMessage("Please add at least one word");
      return;
    }

    if (status !== "authenticated") {
      setToastMessage("You must be logged in to create a list");
      return;
    }

    setIsLoading(true);
    setWordStatuses({}); // Reset status tracking

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/list/bulk-create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: listTitle,
            description: listDescription || "Bulk imported list",
            words: parsedWords,
            createdBy: session?.user?.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setToastMessage(
          data.error || "Error creating list. Please try again."
        );
        return;
      }

      setToastMessage(
        `Successfully created list "${listTitle}" with ${data.enrichedCount}/${parsedWords.length} words enriched!`
      );

      // Reset form
      setListTitle("");
      setListDescription("");
      setWordsInput("");
      setParsedWords([]);
      setShowPreview(false);
      setWordStatuses({});
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Error creating list. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Bulk List Creator
        </h2>
      </div>

      {!showPreview ? (
        <div className="space-y-4">
          {/* List Title Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              List Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Advanced Vocabulary, Technical Terms"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* List Description Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Optional description for the list"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Words Input Textarea */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Words (comma, newline, or space separated) *
            </label>
            <textarea
              placeholder="Paste your words here. Examples:&#10;- hello, world, test&#10;- One word per line&#10;- or even raw text separated by spaces"
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white font-mono text-sm"
            />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>ℹ️ How it works:</strong> Paste or type your words, click
              "Preview & Verify", and we'll automatically fetch definitions from
              our database or generate them using AI.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleParsePreview}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Preview & Verify
            </button>
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowPreview(false)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Edit
            </button>
          </div>

          {/* List Summary */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {listTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {listDescription || "No description provided"}
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              📊 {parsedWords.length} word(s) ready to import
            </p>
          </div>

          {/* Words Preview - Scrollable */}
          <div className="max-h-96 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
            <div className="flex flex-wrap gap-2">
              {parsedWords.map((word, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  {word}
                  {wordStatuses[word] === "enriched" && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✓ enriched
                    </span>
                  )}
                  {wordStatuses[word] === "db-found" && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      ✓ from DB
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>✓ Ready!</strong> Click "Create List" to enrich these words
              and save your list.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Edit Input
            </button>
            <button
              onClick={handleCreateList}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enriching & Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create List
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
