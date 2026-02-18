"use client";

import EditTopicForm from "@components/EditTopicForm";
import apiConfig from "@utils/apiUrlConfig";
import { useState, useEffect } from "react";

export default function GetListData({ params }) {
  const { id } = params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch list");
        }

        const data = await response.json();
        setData(data.list);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit List</h1>

      {isLoading && (
        <p className="text-center text-gray-500">Loading list data...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center">
          Error: {error.message}
        </div>
      )}

      {data !== null && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <EditTopicForm
            id={id}
            title={data.title}
            description={data.description}
            words={data.words}
          />
        </div>
      )}
    </div>
  );
}
