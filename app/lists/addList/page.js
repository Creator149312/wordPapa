"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";

export default function AddList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState([]);
  const createdBy = useSession().data?.user?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  //creating a unique set of Words when words data is updated
  const handleWordsChange = (e) => {
    const textareaValue = e.target.value;
    const lines = textareaValue.split(/\s+/).filter(Boolean);
    let uniqueSet = new Set(lines);
    setWords(Array.from(uniqueSet));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !description || !words) {
      alert("Title and description are required.");
      return;
    }

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, words, createdBy }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create a List");
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form-50">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="form-control m-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="form-control m-2"
        type="text"
        placeholder="Topic Description"
      />
      <textarea
        onChange={handleWordsChange}
        className="form-control m-2"
        rows="5"
        placeholder="Enter Words in each line"
      />

      <button
        type="submit"
        className="custom-button"
      >
        Add Topic
      </button>
      {isLoading && <p>Adding Your List ...</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}