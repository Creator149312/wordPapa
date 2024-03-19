/**
 * Need to check how to handle 3 letter words because 
 * xxx-yyy zzz  using url xxx-yyy-zzz is not fetching xxx-yyy zzz word.
 * And in some cases  "xxx yyy zzz" is not fetched by url xxx-yyy-zzz
 */
import THREELETTERWORDS from "./3LETTERWORDS";

let validWords = [];

const handleCheckValidity = async (checkWord) => {
  let isValid = false;
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`
    );
    const data = await response.json();
    if (data[0] !== null) {
      isValid = data[0].defs.length > 0;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    isValid = false; // Assume word is not valid if there's an error
  }

  if (isValid) {
    validWords.push(checkWord);
  } else {
    console.log(checkWord + " with 0 Defs");
  }
};

const WordValidator = async () => {
  // console.log(THREELETTERWORDS.length);

  // for (var i = 0; i < THREELETTERWORDS.length; i++) {
  //   let word = THREELETTERWORDS[i].replace(/ /g, "-");
  //   await handleCheckValidity(word);
  // }

  // return (
  //   <>
  //     <ul>
  //       {validWords.map((item, index) => (
  //         <li key={index}>{item}</li>
  //       ))}
  //     </ul>
  //   </>
  // );
};

export default WordValidator;
