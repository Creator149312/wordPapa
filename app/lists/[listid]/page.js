'use client'

import ListDisplay from '@components/ListDisplay';
import { useState, useEffect } from 'react';
import apiConfig from "@utils/apiUrlConfig";

export default function Page({ params }) {
  const {listid} = params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.apiUrl}/list/${listid}`, { cache: "no-store" }); // Replace with your actual API endpoint

        if (!response.ok) {
          throw new Error("Failed to fetch lists");
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
  }, []);

  return (
    <div>
      {isLoading && <p>Loading list data...</p>}
      {error && <p>Error: {error.message}</p>}
      {( data !== null) && (
        <ListDisplay title={data.title} description={data.description} words={data.words}/>
      )}
    </div>)
}