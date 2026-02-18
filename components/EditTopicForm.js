"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiConfig from "@utils/apiUrlConfig";
import { HiPencilAlt, HiOutlineTrash } from "react-icons/hi";
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
    const lines = e.target.value.split(/\s+/).filter(Boolean);
    setNewWords(lines.map((w) => ({ word: w, wordData: "" })));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow-md rounded-lg p-6"
    >
      <div>
        <label className="block text-gray-700 font-medium mb-2">List Title</label>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          type="text"
          placeholder="Enter list title"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          type="text"
          placeholder="Enter list description"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 font-medium">Words</label>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSimpleView(!simpleView);
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            {simpleView ? "List View" : "Simple View"}
          </button>
        </div>

        {simpleView ? (
          <textarea
            onChange={handleWordsChange}
            rows="5"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter words separated by spaces or new lines"
            defaultValue={newWords.map((w) => w.word).join("\n")}
          />
        ) : (
          <ul className="space-y-3">
            {newWords.map((word, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition-colors"
              >
                <Link
                  href={`/define/${word.word}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {word.word}
                </Link>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="text-sm">{word.wordData}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...newWords];
                      updated.splice(index, 1);
                      setNewWords(updated);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 transition-colors"
      >
        {isSubmitting ? "Updating..." : "Update List"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">Error: {error}</p>
      )}
    </form>
  );
}
