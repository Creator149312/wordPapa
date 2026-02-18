"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read Excel file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Extract words from sheet
    const words = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      .flat()
      .filter((w) => typeof w === "string" && w.trim().length > 0);

    setLoading(true);

    // Process words with delay
    const processedWords = [];
    for (let i = 0; i < words.length; i++) {
      processedWords.push(words[i]);
      // wait 200ms before next iteration
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Send words to API route
    try {
      await fetch("/api/words/upload-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: processedWords }),
      });
    } catch (err) {
      console.error("Error uploading words:", err);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="text-2xl font-bold mb-4">Upload Excel of Words</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {loading && <p className="mt-4">Processing words...</p>}
    </div>
  );
}
