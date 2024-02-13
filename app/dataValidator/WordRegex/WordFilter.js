"use client";
import { useState } from "react";

function WordFilter({ words }) {
  const [expression, setExpression] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);

  const checkWords = (words, expression) => {
    const result = [];
    const questionMarks = (expression.match(/\?/g) || []).length;

    for (const word of words) {
      let matches = 0;

      if (word.length <= questionMarks) {
        result.push(word);
      } else {
        let matchedChars = 0;
        let e = expression.split("");
        for (let i = 0; i < word.length; i++) {
          for (let j = 0; j < e.length; j++) {
            if (e[j] === word[i]) {
                matchedChars++;
            //   word.splice(i, 1);
              e[j] = "0";
              console.log("Word : ", word);
              console.log("Expression : ", e);
            }
          }
        }

        console.log("Total Matched Chars", matchedChars);
        console.log("Final Expression", e);

        if(matchedChars + questionMarks >= word.length){
            result.push(word);
        }
      }

    //   if (questionMarks === 0 || matches >= questionMarks - 1) {
    //     result.push(word);
    //   }
    }

    return result;
  };

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
    const filtered = checkWords(words, event.target.value);
    setFilteredWords(filtered);
  };

  return (
    <div>
      <input
        type="text"
        value={expression}
        onChange={handleExpressionChange}
        placeholder="Enter expression"
      />
      <ul>
        {filteredWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default WordFilter;
