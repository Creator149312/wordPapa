'use client'

import Link from "next/link";
import RemoveListBtn from "./RemoveListBtn";
import { HiPencilAlt } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function WordLists() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { status, data: session } = useSession();
  let createdBy = session?.user?.email;

  useEffect(() => {
    console.log("Created By = "+createdBy);
    const fetchData = async () => {
      try {
        // const response = await fetch('https://fictional-space-sniffle-jj99r9vggv4fj55g-3000.app.github.dev/api/list', { cache: "no-store" }); // Replace with your actual API endpoint
        
       const response = await fetch(`https://fictional-space-sniffle-jj99r9vggv4fj55g-3000.app.github.dev/api/list/user/${createdBy}`, { cache: "no-store" }); // Replace with your actual API endpoint
      
        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }

        const data = await response.json();
        setData(data.lists);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div key="wordlist">
      {isLoading && <p>Fetching Your Lists ...</p>}
      {error && <p>Failed to Load Your Lists</p>}
      {data.length > 0 && (
        data.map((item) => (
          <div key={item.id} className="card p-2 m-3"
          >
            <div className="card-content m-2">
              <h2 className="card-title">{item.title}</h2>
              <div>{item.description}</div>
            </div>
            <div className="card-footer">
              <Link href={`/lists/${item._id}`}><HiOutlineEye size={24} /></Link>
              <Link href={`/editList/${item._id}`}>
                <HiPencilAlt size={24} />
              </Link>
              <RemoveListBtn id={item._id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

