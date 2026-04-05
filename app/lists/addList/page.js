"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";
import { validateListTitle } from "@utils/Validator";
import { slugify } from "@utils/slugify"; // Import our new utility
import toast from "react-hot-toast";
import { PlusCircle, Loader2, Sparkles } from "lucide-react";

export default function AddList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [topic, setTopic] = useState("");
  const [aiWords, setAiWords] = useState([]);
  const [suggestedLists, setSuggestedLists] = useState([]);
  const [previewWords, setPreviewWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Check session
    if (!session?.user?.email) {
      toast.error("Please sign in to create a list.");
      return;
    }

    setError("");
    setIsLoading(true);

    const vlt = validateListTitle(title);
    if (!title || vlt) {
      setError(vlt || "Title is required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          words,
          createdBy: session.user.email,
          tags: selectedTags,
        }),
      });

      const resObj = await res.json();

      if (res.ok && !resObj?.error) {
        toast.success("List forged successfully! ✨");

        // Use our new URL structure: /lists/slug-id
        const newSlug = slugify(title);
        const newListId = resObj.id || resObj.list?._id; // Ensure your backend returns the new ID

        // Refresh the dashboard and explore page data
        router.refresh();

        // Redirect directly to the new list
        router.push(`/lists/${newSlug}-${newListId}`);
      } else {
        const errMsg = resObj?.error || "Failed to create list";
        toast.error(errMsg);
        setError(errMsg);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedLists = async (term) => {
    if (!term) return;
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list?search=${encodeURIComponent(term)}`);
      const { lists } = await res.json();
      setSuggestedLists(lists || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const generateWordsFromTopic = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to generate an AI list.");
      return;
    }

    if (!topic?.trim()) {
      toast.error("Please provide a topic to generate words.");
      return;
    }

    setIsAiLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiConfig.apiUrl}/generateWords`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ queryType: "topic", prompt: topic.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.words) {
        setAiWords(data.words);
        setTitle(`AI ${topic.trim()}`);
        setDescription(`AI-generated list for topic: ${topic.trim()}`);
        await fetchSuggestedLists(topic.trim());
        toast.success("AI words generated. Preview and save when ready.");
      } else {
        setError(data.error || "Unable to generate words.");
        toast.error(data.error || "Unable to generate words.");
      }
    } catch (err) {
      console.error("AI generate error:", err);
      setError("AI generation failed. Try again.");
      toast.error("AI generation failed. Try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const previewAiList = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to create a preview.");
      return;
    }

    if (!aiWords || !aiWords.length) {
      toast.error("Generate AI words first.");
      return;
    }

    setIsPreviewLoading(true);

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/bulk-create`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          words: aiWords,
          createdBy: session.user.email,
          dryRun: true,
        }),
      });

      const data = await res.json();
      if (res.ok && (data.words || data.wordArray)) {
        setPreviewWords(data.wordArray || data.words);
        toast.success("Preview ready. Review and save when you're ready.");
      } else {
        setError(data.error || "Unable to generate preview.");
        toast.error(data.error || "Unable to generate preview.");
      }
    } catch (err) {
      console.error("Preview creation failed:", err);
      setError("Preview creation failed. Try again.");
      toast.error("Preview creation failed. Try again.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const savePreviewList = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to save list.");
      return;
    }

    if (!previewWords || !previewWords.length) {
      toast.error("No preview available. Please generate first.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/bulk-create`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          words: previewWords.map((item) => item.word),
          createdBy: session.user.email,
        }),
      });
      const data = await res.json();

      if (res.ok && data.list) {
        toast.success("AI list saved successfully using bulk-create.");
        const listId = data.list._id;
        const newSlug = slugify(data.list.title);
        router.refresh();
        router.push(`/lists/${newSlug}-${listId}`);
      } else {
        const msg = data.error || "Failed to save list.";
        toast.error(msg);
        setError(msg);
      }
    } catch (err) {
      console.error("Save preview list failed:", err);
      toast.error("Save preview list failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#75c32c]/10 rounded-2xl">
          <PlusCircle className="text-[#75c32c]" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Create <span className="text-[#75c32c]">List</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            New Vocabulary Collection
          </p>
        </div>
      </div>

      {/* AI Quick Build Flow */}
      <section className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-[#75c32c]/5 rounded-[2.5rem] p-6 mb-6">
        <h2 className="text-xl font-black text-gray-800 dark:text-white mb-4">Step 1: AI Topic List</h2>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-gray-50 dark:bg-white/5 border rounded-2xl px-4 py-3 mb-3 dark:text-white"
          placeholder="Enter topic, e.g., 'business idioms'"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={generateWordsFromTopic}
            disabled={isAiLoading}
            className="rounded-2xl bg-[#75c32c] text-white py-2 px-4 font-bold disabled:opacity-60"
          >
            {isAiLoading ? "Generating..." : "Generate Words"}
          </button>
          <button
            type="button"
            onClick={previewAiList}
            disabled={!aiWords.length || isPreviewLoading}
            className="rounded-2xl bg-[#1e40af] text-white py-2 px-4 font-bold disabled:opacity-60"
          >
            {isPreviewLoading ? "Preparing Preview..." : "Preview AI List"}
          </button>
          <button
            type="button"
            onClick={savePreviewList}
            disabled={!previewWords.length || isLoading}
            className="rounded-2xl bg-[#f59e0b] text-white py-2 px-4 font-bold disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save AI List"}
          </button>
        </div>

        {suggestedLists.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-gray-500 dark:text-gray-300 mb-2">Step 2: Existing suggestions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {suggestedLists.map((list) => (
                <li key={list._id}>
                  <a
                    href={`/lists/${slugify(list.title)}-${list._id}`}
                    className="text-sky-600 dark:text-sky-400 underline hover:text-sky-800"
                  >
                    {list.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-gray-400">If you want a fresh list, continue to preview and save.</p>
          </div>
        )}

        {aiWords.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">Generated words ({aiWords.length})</h3>
            <div className="flex flex-wrap gap-2">
              {aiWords.map((w, i) => (
                <span key={`${w}-${i}`} className="text-xs bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-200 px-3 py-1 rounded-full">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {previewWords.length > 0 && (
          <div className="p-4 bg-white border border-gray-200 dark:border-gray-700 rounded-2xl">
            <h3 className="font-bold mb-2">Step 4: Preview list words</h3>
            <ul className="max-h-44 overflow-auto text-sm space-y-1 text-gray-700 dark:text-gray-200">
              {previewWords.map((item, idx) => (
                <li key={`${item.word}-${idx}`}>{item.wordData ? `${item.word}: ${item.wordData}` : item.word}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-gray-500">Step 5: Save to track progress and make it discoverable.</p>
          </div>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-[#75c32c]/5 rounded-[2.5rem] p-8 space-y-6"
      >
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
            List Title <span className="text-[#75c32c]">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full bg-gray-50 dark:bg-white/5 border-2 rounded-2xl px-5 py-4 font-bold focus:outline-none transition-all ${
              error
                ? "border-red-500/50"
                : "border-transparent focus:border-[#75c32c] dark:text-white"
            }`}
            type="text"
            placeholder="e.g., GRE High Frequency"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-2xl px-5 py-4 font-medium focus:outline-none dark:text-white transition-all resize-none"
            placeholder="What is this list about?"
          />
        </div>

        {/* Topic Tags Picker */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
            Topic Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {["animals", "food", "business", "law", "technology", "sports", "travel", "medical", "academic"].map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      active ? prev.filter((t) => t !== tag) : [...prev, tag]
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    active
                      ? "bg-[#75c32c] text-white border-[#75c32c]"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#75c32c] hover:text-[#75c32c]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-wider rounded-xl animate-shake">
            <Sparkles size={14} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden bg-[#75c32c] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#75c32c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Creating...</span>
            </div>
          ) : (
            "Forge List"
          )}
        </button>
      </form>
      {/* 
      <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
        Wordpapa Engine v3.0 • Fast-Track Learning
      </p> */}
    </div>
  );
}
