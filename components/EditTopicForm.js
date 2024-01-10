"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiConfig from "@utils/apiUrlConfig";

export default function EditTopicForm({ id, title, description, words }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newWords, setNewWords] = useState(words ? words : []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription, newWords }),
      });

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      setError(error);
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleWordsChange = (e) => {
    const textareaValue = e.target.value;
    const lines = textareaValue.split(/\s+/).filter(Boolean);
    setNewWords(lines);
  };

  const showNewWords = (words) => {
    let txtAreaValue = "";
    for (let i = 0; i < words.length; i++) {
      if (i != words.length - 1)
        txtAreaValue += words[i] + "\n";
      else
        txtAreaValue += words[i];
    }
    return txtAreaValue;
  }

  return (
    <form onSubmit={handleSubmit} className="card form-50">
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="form-control m-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="form-control m-2"
        type="text"
        placeholder="Topic Description"
      />

      <textarea onChange={handleWordsChange}
        rows="5"
        className="form-control m-2"
        placeholder="Write Your Words"
        >{showNewWords(newWords)}
      </textarea>

      <button className="custom-button">
        Update List
      </button>
    
      {isSubmitting && <p> Updating List Data... </p>}
    {error && <p>Error Updating the List, Try Again sometime!</p>}
    </form>
  );
}