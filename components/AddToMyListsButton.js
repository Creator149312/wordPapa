'use client'

import { useSession } from "next-auth/react";
import {useState, useEffect}  from "react";
import { usePathname } from 'next/navigation';
import apiConfig from "@utils/apiUrlConfig";

export default function AddToMyListsButton() {
const [wordToAdd, setWordToAdd] = useState("");
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { status, data: session } = useSession();
  
  useEffect(() => {
      //get the path and the word needs to be added
    let path = pathname.split("/");
    setWordToAdd(path[path.length - 1]); 

    //fetch lists data from DB
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.apiUrl}/list`, { cache: "no-store" }); // Replace with your actual API endpoint

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

  //method used to Add Word to Existing List
  const addWordToList = async (e) =>{
    let itemToAdd = data[e.target.value];
    let newTitle = itemToAdd.title;
    let newDescription = itemToAdd.description;
    let newWords = [...itemToAdd.words, wordToAdd];
    
    try {
        const res = await fetch(`${apiConfig.apiUrl}/list/${itemToAdd._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({newTitle, newDescription, newWords }),
        });
  
        if (!res.ok) {
          throw new Error("Failed to update topic");
        }

        console.log(res);
        console.log("Updated Data successfully");
      } catch (error) {
        console.log(error);
      }
  }

  //if user is logged he is showed a dropdown to add word to an existing list
  if (status === "authenticated" || session !== null) {
    return (
        <div className="m-3">
        <select onChange={addWordToList} className="custom-button">
        <option value="">Add to My List</option>
        {data.length > 0 && (
           data.map((item, index) => (
              <option value={index}>{item.title} {item.words.includes(wordToAdd) ? "*": "" }</option>
           )))}
            </select>
            </div>
    );
  }
}