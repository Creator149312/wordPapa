'use client'

import { useState } from 'react';
const WordsDisplay = ({ length, words }) => {

  const [showAll, setShowAll] = useState(false);
  const maxWordsToShow = 40;

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="card text-center p-2 words-container">
      <div className="card-title">
        <h3>{length} Letter Words</h3>
        <div className="card-content">
          {/* {words.map((word, index) => {
            return <span className='wordSpan' key={index}>{word}</span>
          })} */}
          {words.slice(0, showAll ? words.length : maxWordsToShow).map((word, index) => (
            <span className='wordSpan' key={index}>{word} </span>
          ))}
          {(words.length > maxWordsToShow) && (!showAll ? (
            <div><button onClick={handleShowAll} className='custom-button m-2'>Load More..</button></div>
          ) : <div><button onClick={handleShowAll} className='custom-button m-2'>Show Less..</button></div>)}
        </div>
      </div>
    </div>

  )
}

export default WordsDisplay