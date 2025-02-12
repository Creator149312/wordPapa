"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { capitalizeFirstLetter } from "./HelperFunctions";

const WordsDisplayStartingLetter = ({ letter, words }) => {
  const [showAll, setShowAll] = useState(false);
  const maxWordsToShow = 30;

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <Card className="text-center mt-3 mb-3">
      <CardTitle className="mb-2 font-bold text-xl">
       Starting with {capitalizeFirstLetter(letter)}
      </CardTitle>
      <CardContent className="p-2">
        {/* {words.map((word, index) => {
            return <span className='wordSpan' key={index}>{word}</span>
          })} */}
        {words
          .slice(0, showAll ? words.length : maxWordsToShow)
          .map((word, index) => (
            <span key={index}
              className="p-2 m-1.5 text-lg text-center font-semibold shadow-lg inline-block rounded-md bg-[#75c32c]"
            >
              {word}
            </span>
          ))}
        {words.length > maxWordsToShow &&
          (!showAll ? (
            <div key={`load${letter}`}>
              <button onClick={handleShowAll} className="custom-button m-2">
                Load More..
              </button>
            </div>
          ) : (
            <div key={`unload${letter}`}>
              <button onClick={handleShowAll} className="custom-button m-2">
                Show Less..
              </button>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default WordsDisplayStartingLetter;
