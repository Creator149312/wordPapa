'use client'
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
    <div className="card">
      <div className="list-heading-container"><h1 className="card-title">{title}</h1><button onClick={(showPractice)} className="custom-button">Practice</button></div>
      {practice ? (<Flashcards words={words}/>) : (<><p>{description}</p>
        <ul className="card-content m-3">
          {words.map((word, index) => (
            <li key={index}><h3><Link href={`/define/${word.word}`}>{word.word} - {word.wordData}</Link></h3></li>
          ))}
        </ul></>)}
    </div>
  );
};

export default ListDisplay;
