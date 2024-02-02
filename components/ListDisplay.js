"use client";
import { useState } from "react";
import Link from "next/link";
import Flashcards from "./Flashcards";

const ListDisplay = ({ title, description, words }) => {
  const [practice, setPractice] = useState(false);

  // Function to handle the button click and disable the component
  const showPractice = () => {
    setPractice(!practice);
  };

  return (
    <>
      <div className="">
        <div className="list-heading-container">
          <h1 className="card-title">{title}</h1>
          <button onClick={showPractice} className="custom-button">
            {practice ? 'Show List': 'Flashcards'}
          </button>
        </div>
        {practice ? (
          <Flashcards words={words} />
        ) : (
          <>
            <p>{description}</p>
            <ul className="card-content m-3">
              {words.map((word, index) => (
                <li key={index} className="card user-list-item">
                  <Link href={`/define/${word.word}`} className="medium-text user-list-item-word">{word.word}</Link>
                  <div className="user-list-item-worddata">{word.wordData}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ListDisplay;
