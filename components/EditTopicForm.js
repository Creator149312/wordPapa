"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiConfig from "@utils/apiUrlConfig";
import { HiPencilAlt } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import Link from "next/link";

export default function EditTopicForm({ id, title, description, words }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newWords, setNewWords] = useState(words ? words : []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [simpleView, setSimpleView] = useState(false);
  const [wordData, setWordData] = useState(null);
  const [updatedIndex, setUpdatedIndex] = useState(-1);
  // const [dataRequested, setDataRequested] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(false);
  const [titleEdit, setTitleEdit] = useState(false);

  const router = useRouter();

  // useEffect({

  // }, [dataRequested]);

  // Function to handle the button click and disable the component
  const showSimpleView = (e) => {
    e.preventDefault();
    setSimpleView(!simpleView);
  };

  //submit data to database for saving
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
    } finally {
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
      if (i != words.length - 1) txtAreaValue += words[i].word + "\n";
      else txtAreaValue += words[i].word;
    }
    return txtAreaValue;
  };

  const handleWordDataChange = (newValue, index) => {
    newWords[index].wordData = newValue;
    setNewWords(newWords);
    setUpdatedIndex(-1);
  };

  //start of code to check valid words
  async function fetchWordData(word) {
    setWordData(null);
    // Trim input word and convert to lowercase before checking
    const trimmedWord = word.trim().toLowerCase();
    if (trimmedWord === "") {
      return false; // Empty string is not considered valid
    }

    console.log(" I am finding defs of word");

    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${trimmedWord}&qe=sp&md=d&max=1&v=enwiki`
      );
      const data = await response.json();
      //check if word has property "defs" and is not a stopWord
      if (data[0].hasOwnProperty("defs")) {
        setWordData({
          word: trimmedWord,
          wordData: data[0].defs,
        }); //we'll get all the defs of that particular word
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // Assume word is not valid if there's an error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <label>List Title</label>
      {titleEdit ? (
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={()=>setTitleEdit(false)}
        value={newTitle}
        className="form-control m-2"
        type="text"
        placeholder="Topic Title"
      />) : (
        <>
        <div className="card list-heading-container m-2">
          <div>{newTitle}</div>
          <a
            onClick={(e) => {
              e.preventDefault();
              setTitleEdit(true);
            }}
          >
            <HiPencilAlt size={24} />
          </a>
        </div>
      </>
      )
}
      <label>Description</label>
      {descriptionEdit ? (
        <input
          onChange={(e) => {setNewDescription(e.target.value);}}
          onBlur={()=>setDescriptionEdit(false)}
          value={newDescription}
          className="form-control m-2"
          type="text"
          placeholder="Topic Description"
        />
      ) : (
        <>
          <div className="card list-heading-container m-2">
            <div>{newDescription}</div>
            <a
              onClick={(e) => {
                e.preventDefault();
                setDescriptionEdit(true);
              }}
            >
              <HiPencilAlt size={24} />
            </a>
          </div>
        </>
      )}
      <>
        <div className="">
          <div className="list-heading-container">
            <h1 className="card-title">Edit List</h1>
            <button onClick={showSimpleView} className="custom-button">
              {simpleView ? "List View" : "Simple View"}
            </button>
          </div>
          {simpleView ? (
            <textarea
              onChange={handleWordsChange}
              rows="5"
              className="form-control m-2"
              placeholder="Write Your Words"
            >
              {showNewWords(newWords)}
            </textarea>
          ) : (
            <>
              <ul className="card-content m-3">
                {newWords.map((word, index) => (
                  <li key={index} className="card user-list-item">
                    <Link
                      href={`/define/${word.word}`}
                      className="medium-text user-list-item-word"
                    >
                      {word.word}
                    </Link>
                    {(wordData && updatedIndex === index) ? (
                      <select
                        className="user-list-item-worddata input-lg"
                        onChange={(e) => {
                          handleWordDataChange(e.target.value, index);
                        }}
                        style={{ maxWidth: "500px", minWidth: "150px" }}
                      >
                        {wordData.wordData.map((option, index) => (
                          <option
                            key={index}
                            value={option}
                            style={{
                              maxWidth: "500px",
                              minWidth: "150px",
                              textOverflow: "wrap",
                            }}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="user-list-item-worddata">
                        {word.wordData}
                      </div>
                    )}
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        fetchWordData(word.word);
                        setUpdatedIndex(index);
                      }}
                    >
                      <HiPencilAlt size={24} />
                    </a>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("executing trashclick");
                        newWords.splice(index, 1);
                        setNewWords(newWords);
                        console.log(newWords);
                        setUpdatedIndex(index);
                      }}
                    >
                      <HiOutlineTrash size={24} />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </>

      <button className="custom-button">Update List</button>

      {isSubmitting && <p> Updating List Data... </p>}
      {error && <p>Error Updating the List, Try Again sometime!</p>}
    </form>
  );
}
