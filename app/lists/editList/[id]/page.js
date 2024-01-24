'use client'

import EditTopicForm from "@components/EditTopicForm";
import apiConfig from "@utils/apiUrlConfig";
import { useState, useEffect } from 'react';

export default function GetListData({ params }) {
  const {id} = params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, { cache: "no-store" }); // Replace with your actual API endpoint

        if (!response.ok) {
          throw new Error("Failed to Fetch Lists");
        }

        const data = await response.json();
        //console.log(data);
        setData(data.list);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading List data...</p>}
      {error && <p>Error: {error.message}</p>}
      {( data !== null) && (
        <EditTopicForm id={id} title={data.title} description={data.description} words={data.words}/>
      )}
    </div>)
}