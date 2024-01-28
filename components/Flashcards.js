'use client'

import React from 'react';
import { Flashcard, FlashcardArray } from "react-quizlet-flashcard";

const Flashcards = ({ words }) => {
  // console.log("Words inside Flashcards");
  // console.log(words);
  const flashcards = [];
  for (let i = 0; i < words.length; i++) {
    flashcards.push( {frontHTML : words[i].word, backHTML: words[i].wordData});
  }

  console.log("What data flashcards store");
  console.log(flashcards);

  return (
    <div>
      {/* {flashcards.map((flashcard, index) => (
        <Flashcard key={index} frontHTML={flashcard.front} backHTML={flashcard.back} />
      ))} */}
      <FlashcardArray cards={flashcards} />
    </div>
  );
};

export default Flashcards;
