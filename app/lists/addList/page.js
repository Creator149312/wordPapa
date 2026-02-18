"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";
import { validateListTitle } from "@utils/Validator";
import toast from "react-hot-toast";

export default function AddList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createdBy = useSession().data?.user?.email;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!title) {
      setError("Title is required.");
      setIsLoading(false);
      return;
    }

    const vlt = validateListTitle(title);
    if (vlt) {
      setError(vlt);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, description, createdBy }),
      });

      const resObj = await res.json();
      if (resObj?.error) {
        toast.error("Failed to create list");
        setError("Failed to create list");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Error creating list");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New List</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            List Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Enter a title for your list"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description (optional)
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Brief description of your list"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          {isLoading ? "Creating..." : "Create List"}
        </button>
      </form>
    </div>
  );
}
