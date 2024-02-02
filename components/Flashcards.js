'use client'

import { FlashcardArray } from "react-quizlet-flashcard";

const frontContentCSS = {
  fontSize: '28px',
  display: 'flex',
  justifyContent: 'center', /* horizontally center */
  alignItems: 'center', /* vertically center */
  padding: '15px',
}

const backContentCSS = {
  fontSize: '20px',
  display: 'flex',
  justifyContent: 'center', /* horizontally center */
  alignItems: 'center', /* vertically center */
  padding: '20px',
}

const Flashcards = ({ words }) => {
  // console.log("Words inside Flashcards");
  // console.log(words);
  const flashcards = [];
  for (let i = 0; i < words.length; i++) {
    flashcards.push( {frontHTML : words[i].word, backHTML: words[i].wordData});
  }

  return (
    <div className='flashcard-container p-4 m-3'>
      {/* {flashcards.map((flashcard, index) => (
        <Flashcard key={index} frontHTML={flashcard.front} backHTML={flashcard.back} />
      ))} */}
      <FlashcardArray cards={flashcards} frontContentStyle={frontContentCSS} backContentStyle={backContentCSS}/>
    </div>
  );
};

export default Flashcards;
