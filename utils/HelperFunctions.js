import WordsDisplay from "@utils/WordsDisplay";
import { Card } from "@components/ui/card";
import AdsUnit from "@components/AdsUnit";
// import GoogleAd from "./GoogleAd";

export const filterWord = (word, input1, input2, input3, length) => {
  // Initialize check variables
  let startsWithInput1 = true;
  let endsWithInput2 = true;
  let containsInput3 = true;
  let hasCorrectLength = true;

  // Perform checks only if the corresponding inputs are provided
  if (input1) {
    startsWithInput1 = input1 === input1.trim() && word.startsWith(input1);
  }
  if (input2) {
    endsWithInput2 = input2 === input2.trim() && word.endsWith(input2);
  }
  if (input3) {
    containsInput3 = input3 === input3.trim() && word.includes(input3);
  }
  if (length) {
    hasCorrectLength = word.length == length;
  }

  // Return the result of all checks
  return (
    startsWithInput1 && endsWithInput2 && containsInput3 && hasCorrectLength
  );
};

/* It is used to group words by Length and then display it using WordDisplay component */
export const groupWordsByLength = (
  sortedWords,
  startsWith,
  endsWith,
  contains,
  length
) => {
  const groupedWords = {};

  sortedWords.forEach((word) => {
    const wordLength = word.length;
    if (!groupedWords[wordLength]) {
      groupedWords[wordLength] = [];
    }

    if (filterWord(word, startsWith, endsWith, contains, length))
      groupedWords[wordLength].push(word);
  });

  //console.log(groupedWords);
  return groupedWords; //format is {1 : ["a"], 2: ["ba", "ab"] }
};

/* It is used to Display words in sorted order according to filters after data fetching is done by API */
export const displayWords = (
  wordsArr,
  startsWith,
  endsWith,
  contains,
  length
) => {
  const groupedWords = groupWordsByLength(
    wordsArr,
    startsWith,
    endsWith,
    contains,
    length
  );
  const result = Object.entries(groupedWords).map(([length, words], index) => {
    return (
      <div key={`Index${index}`}>
        <div key={length}>
          <WordsDisplay length={length} words={words} />
        </div>
        {index % 4 === 0 && (
          <div
            key={`ad${index}`}
          >
          <AdsUnit slot='7782807936'/> 
          </div>
        )}
      </div>
    );
  });
  return result;
};

export const sortStringArrayinASC = (StrArray) => {
  return StrArray.sort((a, b) => a.length - b.length).filter(
    (value, index, self) => {
      // Return true for the first occurrence of each unique element
      return self.indexOf(value) === index;
    }
  ); //sort examples based on the length of sentences
};
