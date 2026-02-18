'use client'

import { FlashcardArray } from "react-quizlet-flashcard";

const frontContentCSS = {
  fontSize: '28px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '15px',
};

const backContentCSS = {
  fontSize: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const Flashcards = ({ words }) => {
  const flashcards = words.map((w) => ({
    frontHTML: w.word,
    backHTML: w.wordData,
  }));

  return (
    <div className="flashcard-container p-4 m-3 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <FlashcardArray
        cards={flashcards}
        frontContentStyle={{
          ...frontContentCSS,
          color: 'var(--tw-prose-body)',
        }}
        backContentStyle={{
          ...backContentCSS,
          color: 'var(--tw-prose-body)',
        }}
      />
    </div>
  );
};

export default Flashcards;
