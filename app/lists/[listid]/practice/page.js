'use client'

import React from 'react';
import { Flashcard, FlashcardArray } from "react-quizlet-flashcard";

const Cards = () => {
  const words = ["future", "past", "present", "culture", "revenue", "stocks"];
    const flashcards = [];
   for(let i = 0; i < words.length; i++){
    flashcards.push({ frontHTML: words[i], backHTML:  `Back of Card ${i}`});
   } 

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

export default Cards;
