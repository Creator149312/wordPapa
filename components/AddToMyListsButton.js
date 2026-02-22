"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useCallback } from "react";
import apiConfig from "@utils/apiUrlConfig";
import Toast from "@components/Toast";
import {
  BookmarkPlus,
  Loader2,
  FolderPlus,
  X,
  CheckCircle2,
  Plus,
  ChevronLeft,
  LogIn,
} from "lucide-react";

export default function AddToMyListsButton({ word, definition }) {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { status, data: session } = useSession();

  const fetchLists = useCallback(async () => {
    if (!session?.user?.email) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/list/user/${session.user.email}`,
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setLists(data.lists || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  const handleOpenModal = () => {
    setShowModal(true);
    // Only fetch if they are actually logged in
    if (status === "authenticated") {
      fetchLists();
    }
  };

  const addWordToList = async (list) => {
    const currentWords = list?.words || [];
    if (currentWords.some((w) => w.word === word)) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/${list._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          newTitle: list.title,
          newDescription: list.description || "",
          newWords: [...currentWords, { word, wordData: definition || "" }],
        }),
      });

      if (res.ok) {
        setToastMessage(`Saved to ${list.title}`);
        setShowModal(false); // Close modal after successful save
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
          words: [{ word, wordData: definition || "" }],
          createdBy: session?.user?.email,
        }),
      });

      const data = await res.json();

      if (res.ok && data.list) {
        setToastMessage(`List created & "${word}" saved!`);
        setNewListTitle("");
        setShowAddListForm(false); 
        setShowModal(false); // Close modal after creation & save
      } else {
        setToastMessage(data.error || "Failed to create list");
      }
    } catch (err) {
      setToastMessage("Error creating list");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Button is now always visible */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-6 py-3 bg-[#75c32c] hover:bg-[#66aa26] text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 group"
      >
        <BookmarkPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Save Word</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[200] p-4">
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
                        {status !== "authenticated" ? "Sign In Required" : showAddListForm ? "Create List" : "Save Word"}
                    </h2>
                    <p className="text-[10px] font-black text-[#75c32c] uppercase tracking-widest leading-none">
                        {word}
                    </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Scenario 1: User is NOT logged in */}
              {status !== "authenticated" ? (
                <div className="text-center space-y-6 py-4">
                  <div className="bg-[#75c32c]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <LogIn className="text-[#75c32c] w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Join us to create custom word lists and track your learning progress.
                    </p>
                  </div>
                  <button
                    onClick={() => signIn("google")}
                    className="w-full bg-[#75c32c] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#66aa26] transition-all"
                  >
                    Sign In to Save
                  </button>
                </div>
              ) : isLoading ? (
                /* Scenario 2: Loading Lists */
                <div className="flex flex-col items-center py-10">
                  <Loader2 className="animate-spin text-[#75c32c]" size={32} />
                </div>
              ) : !showAddListForm ? (
                /* Scenario 3: List Selection */
                <div className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {lists.length > 0 ? (
                        lists.map((list) => {
                            const isAdded = list?.words?.some((w) => w.word === word) || false;
                            return (
                            <button
                                key={list._id}
                                disabled={isAdded || isSubmitting}
                                onClick={() => addWordToList(list)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                                isAdded
                                    ? "bg-[#75c32c]/5 border-[#75c32c]/30 text-[#75c32c]"
                                    : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-[#75c32c] hover:bg-white dark:hover:bg-black shadow-sm"
                                }`}
                            >
                                <span className="font-bold truncate max-w-[200px]">
                                    {list.title}
                                </span>
                                {isAdded ? (
                                    <CheckCircle2 size={18} className="shrink-0 animate-in zoom-in duration-300" />
                                ) : (
                                    <Plus size={18} className="text-gray-400 shrink-0" />
                                )}
                            </button>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 text-gray-400 italic text-sm">No collections found.</div>
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
                /* Scenario 4: Creation Form */
                <form onSubmit={createNewListAndAddWord} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Collection Name</label>
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
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Create & Save Word"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </>
  );
}