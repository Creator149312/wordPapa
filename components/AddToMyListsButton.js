"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import apiConfig from "@utils/apiUrlConfig";
import Toast from "@components/Toast";
import { Plus, PlusCircle } from "lucide-react"; // icon

export default function AddToMyListsButton({ word, definition }) {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { status, data: session } = useSession();

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/list/user/${session?.user?.email}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("Failed to fetch lists");
      const data = await response.json();
      setLists(data.lists);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = async () => {
    setShowModal(true);
    if (status === "authenticated") {
      await fetchLists();
    }
  };

  const addWordToList = async (list) => {
    const newWordObject = { word, wordData: definition || "" };
    const newWords = [...list.words, newWordObject];
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/${list._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          newTitle: list.title,
          newDescription: list.description,
          newWords,
        }),
      });
      if (!res.ok) throw new Error("Failed to update list");
      setShowModal(false);
      setToastMessage(`"${word}" added to "${list.title}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const createNewList = async (e) => {
    e.preventDefault();
    const newWordObject = { word, wordData: definition || "" };
    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title: newListTitle,
          description: newListDescription,
          words: [newWordObject],
          createdBy: session?.user?.email,
        }),
      });
      if (!res.ok) throw new Error("Failed to create list");
      const data = await res.json();
      setLists((prev) => [...prev, data.list]);
      setShowModal(false);
      setShowAddListForm(false);
      setToastMessage(`New list "${newListTitle}" created and word added`);
    } catch (err) {
      console.error(err);
    }
  };

  if (status !== "authenticated" || !session) return null;

  return (
    <div className="mt-2">
      {/* Compact icon button for mobile */}
      {/* Mobile: small rounded icon button */}
      <button
        onClick={handleOpenModal}
        className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
        aria-label="+ Save"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Desktop: rectangle button with + */}
      <button
        onClick={handleOpenModal}
        className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
      >
        <span className="text-lg font-bold">
          <Plus className="w-6 h-6" />
        </span>
        <span>Save</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-bold mb-4">Save Word to a List</h2>

            {isLoading && <p className="text-gray-500">Loading lists...</p>}
            {error && (
              <p className="text-red-500">
                Error loading lists: {error.message}
              </p>
            )}

            {!isLoading && lists.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-base font-semibold">
                  Select Existing List
                </h3>
                {lists.map((list) => (
                  <button
                    key={list._id}
                    onClick={() => addWordToList(list)}
                    className="w-full text-left px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {list.title}{" "}
                    {list.words.some((w) => w.word === word) && (
                      <span className="text-sm text-gray-500">
                        (already added)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!showAddListForm ? (
              <button
                onClick={() => setShowAddListForm(true)}
                className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition-colors"
              >
                + Create New
              </button>
            ) : (
              <form onSubmit={createNewList} className="space-y-3 mt-4">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="List Title"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-100"
                />
                <input
                  type="text"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="List Description"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition-colors"
                >
                  Create List & Add Word
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                setShowAddListForm(false);
              }}
              className="mt-4 w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
}
