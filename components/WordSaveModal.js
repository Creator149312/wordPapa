"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useCallback, useEffect, useRef } from "react";
import apiConfig from "@utils/apiUrlConfig";
import Toast from "@components/Toast";
import {
  Loader2,
  FolderPlus,
  X,
  CheckCircle2,
  Plus,
  ChevronLeft,
  LogIn,
  BookmarkPlus,
} from "lucide-react";

/**
 * WordSaveModal
 *
 * A shared, single-instance modal for saving words to lists.
 * Rendered once at the page level (DataFilterDisplay); the list of user
 * collections is fetched once per session and cached in component state —
 * not re-fetched for every word click.
 *
 * Props:
 *   word      string | null  — The word to save. null = modal hidden.
 *   onClose   () => void     — Called when the modal should close.
 */
export default function WordSaveModal({ word, onClose }) {
  const { status, data: session } = useSession();

  // Lists are fetched once and kept alive between opens
  const [lists, setLists] = useState([]);
  const [listsFetched, setListsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  // Track which list ids have this word saved (local optimistic state)
  const [savedInLists, setSavedInLists] = useState(new Set());
  const hasInitialized = useRef(false);

  // Fetch lists once when modal first opens with an authenticated user
  const fetchLists = useCallback(async () => {
    if (!session?.user?.email || listsFetched) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${apiConfig.apiUrl}/list/user/${session.user.email}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch lists");
      const data = await res.json();
      setLists(data.lists || []);
      setListsFetched(true);
    } catch (err) {
      console.error("WordSaveModal fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, listsFetched]);

  // When a new word is targeted, reset per-word UI state and recompute savedInLists
  useEffect(() => {
    if (!word) return;
    setShowAddListForm(false);
    setNewListTitle("");
    setSavedInLists(
      new Set(
        lists
          .filter((l) => l.words?.some((w) => w.word === word))
          .map((l) => l._id)
      )
    );
    if (status === "authenticated" && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchLists();
    }
  }, [word, lists, status, fetchLists]);

  // Re-compute saved state when lists load
  useEffect(() => {
    if (!word) return;
    setSavedInLists(
      new Set(
        lists
          .filter((l) => l.words?.some((w) => w.word === word))
          .map((l) => l._id)
      )
    );
  }, [lists, word]);

  const addWordToList = async (list) => {
    if (savedInLists.has(list._id)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/${list._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          newTitle: list.title,
          newDescription: list.description || "",
          newWords: [...(list.words || []), { word, wordData: "" }],
        }),
      });
      if (res.ok) {
        setSavedInLists((prev) => new Set([...prev, list._id]));
        setLists((prev) =>
          prev.map((l) =>
            l._id === list._id
              ? { ...l, words: [...(l.words || []), { word, wordData: "" }] }
              : l
          )
        );
        setToastMessage(`Saved "${word}" to ${list.title}`);
        setTimeout(() => onClose(), 900);
      }
    } catch (err) {
      setToastMessage("Error saving word");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createNewListAndAddWord = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title: newListTitle,
          description: "My custom list",
          words: [{ word, wordData: "" }],
          createdBy: session?.user?.email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.list) {
        // Add the new list to local cache
        setLists((prev) => [...prev, data.list]);
        setSavedInLists((prev) => new Set([...prev, data.list._id]));
        setToastMessage(`List created & "${word}" saved!`);
        setNewListTitle("");
        setShowAddListForm(false);
        setTimeout(() => onClose(), 900);
      } else {
        setToastMessage(data.error || "Failed to create list");
      }
    } catch (err) {
      setToastMessage("Error creating list");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!word) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[200] p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              {showAddListForm && (
                <button
                  onClick={() => setShowAddListForm(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {status !== "authenticated"
                    ? "Sign In Required"
                    : showAddListForm
                    ? "Create List"
                    : "Save Word"}
                </h2>
                <p className="text-[10px] font-black text-[#75c32c] uppercase tracking-widest leading-none">
                  {word}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 py-6">
            {/* Unauthenticated */}
            {status !== "authenticated" ? (
              <div className="text-center space-y-6 py-4">
                <div className="bg-[#75c32c]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="text-[#75c32c] w-8 h-8" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Sign in to save words to your personal collections.
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="w-full bg-[#75c32c] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#66aa26] transition-all"
                >
                  Sign In to Save
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="animate-spin text-[#75c32c]" size={32} />
              </div>
            ) : !showAddListForm ? (
              /* List picker */
              <div className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {lists.length > 0 ? (
                    lists.map((list) => {
                      const isSaved = savedInLists.has(list._id);
                      return (
                        <button
                          key={list._id}
                          disabled={isSaved || isSubmitting}
                          onClick={() => addWordToList(list)}
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                            isSaved
                              ? "bg-[#75c32c]/5 border-[#75c32c]/30 text-[#75c32c]"
                              : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-[#75c32c] hover:bg-white dark:hover:bg-black shadow-sm"
                          }`}
                        >
                          <span className="font-bold truncate max-w-[200px]">
                            {list.title}
                          </span>
                          {isSaved ? (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 animate-in zoom-in duration-300"
                            />
                          ) : (
                            <Plus size={18} className="text-gray-400 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-gray-400 italic text-sm">
                      No collections yet.
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddListForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90"
                >
                  <FolderPlus size={16} /> New Collection
                </button>
              </div>
            ) : (
              /* Create-list form */
              <form
                onSubmit={createNewListAndAddWord}
                className="space-y-4 animate-in fade-in slide-in-from-right-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Collection Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="e.g. TOEFL Vocabulary"
                    className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-2xl px-5 py-4 font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newListTitle}
                  className="w-full bg-[#75c32c] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Create & Save Word"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </>
  );
}
