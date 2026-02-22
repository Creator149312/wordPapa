"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiConfig from "@utils/apiUrlConfig";
import { Trash2, Loader2, Save, LayoutList, AlignLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EditTopicForm({ id, title, description, words }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newWords, setNewWords] = useState(words || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [simpleView, setSimpleView] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          newTitle,
          newDescription,
          newWords,
        }),
      });

      if (!res.ok) throw new Error("Failed to update list");

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWordsChange = (e) => {
    const lines = e.target.value.split(/\n|,/).filter(Boolean); // Split by newline or comma
    setNewWords(lines.map((w) => ({ word: w.trim(), wordData: "" })));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title & Description Inputs */}
      <div className="grid gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
            Collection Title
          </label>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-2xl px-5 py-4 font-bold focus:outline-none dark:text-white transition-all"
            type="text"
            placeholder="Enter title..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
            Description
          </label>
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-2xl px-5 py-4 font-bold focus:outline-none dark:text-white transition-all"
            type="text"
            placeholder="What is this collection for?"
          />
        </div>
      </div>

      {/* Words Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Words in Collection ({newWords.length})
          </label>
          {/* <button
            type="button"
            onClick={() => setSimpleView(!simpleView)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#75c32c] hover:opacity-70 transition-opacity"
          >
            {simpleView ? <LayoutList size={14} /> : <AlignLeft size={14} />}
            {simpleView ? "Switch to List" : "Bulk Edit"}
          </button> */}
        </div>

        {simpleView ? (
          <textarea
            onChange={handleWordsChange}
            rows="8"
            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-[2rem] px-6 py-5 font-medium focus:outline-none dark:text-white transition-all leading-relaxed"
            placeholder="Type words separated by commas or new lines..."
            defaultValue={newWords.map((w) => w.word).join("\n")}
          />
        ) : (
          <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {newWords.length > 0 ? (
              newWords.map((word, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-[#75c32c]/30 rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 w-4">
                      {index + 1}
                    </span>
                    <Link
                      href={`/define/${word.word}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-[#75c32c] transition-colors flex items-center gap-2"
                    >
                      {word.word}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-400 italic">
                      {word.wordData || "No definition saved"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...newWords];
                        updated.splice(index, 1);
                        setNewWords(updated);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem]">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No words in this list</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#75c32c] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-[#75c32c]/20 hover:bg-[#66aa26] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={18} />
              Update Collection
            </>
          )}
        </button>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center mt-4 animate-bounce">
            ⚠️ {error}
          </p>
        )}
      </div>
    </form>
  );
}