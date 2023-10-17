import React from "react";
import axios from "axios";
import { sortStringArrayinASC } from "@utils/HelperFunctions";

let errorWorknick = null;
let errorTwinWord = null;

function joinSentenceArrays(sWordNick, sTwinWord, word) {
  const wordNicksSentences = sWordNick.map(
    (sent) => sent.includes(word) && sent
  );

  return sortStringArrayinASC([...wordNicksSentences, ...sTwinWord]);
}

/*
examples: [
  {
    provider: { id: 712 },
    year: 2011,
    rating: 749,
    url: 'http://www.walesonline.co.uk/showbiz-and-lifestyle/film-in-wales/2011/07/22/michael-caine-on-his-big-screen-role-in-cars-2-91466-29097118/',
    word: 'cartoon',
    text: "But the word cartoon didn't seem to apply to this movie, and I can't think of any word which does.",
    documentId: 32640138,
    exampleId: 638137060,
    title: 'WalesOnline - Home'
  }
]
*/

async function getSentencesUsingWordnik(word) {
  try {
    const endpoint = `https://api.wordnik.com/v4/word.json/${word}/examples`;
    const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4"; // Replace with your Wordnik API key
    const response = await axios.get(endpoint, {
      params: {
        api_key: apiKey,
      },
    });

    // console.log(response.data.examples);
    if (response.data.examples !== null) {
      return sortStringArrayinASC(
        response.data.examples.map((sent) => {
          return sent.text;
        })
      );
    } else {
      throw new Error();
    }
  } catch (e) {
    errorWorknick = e;
  }
}

async function getSentencesUsingTwinWord(word) {
  try {
    const options = {
      method: "GET",
      url: "https://twinword-word-graph-dictionary.p.rapidapi.com/example/",
      params: { entry: word },
      headers: {
        "X-RapidAPI-Key": "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
        "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    // console.log(response.data);
    if (response.data.example !== null) {
      return sortStringArrayinASC(response.data.example);
    } else {
      throw new Error();
    }
  } catch (e) {
    errorTwinWord = e;
  }
}

const SentencesFetcher = async ({ word }) => {
  if (!word.includes("%20")) {
    //if it is word not a phrase or
    //if there is only one word in input text
    const sentencesDataofTwinWord = getSentencesUsingTwinWord(word);
    const sentencesDataofWordNick = getSentencesUsingWordnik(word);

    const [sentencesTwinWord, sentencesWordNick] = await Promise.all([
      sentencesDataofTwinWord,
      sentencesDataofWordNick,
    ]);

    if (errorWorknick && errorTwinWord) {
      errorWorknick = null;
      errorTwinWord = null;
      return <></>; //if there is error in fetching sentences return nothing
    }

    return (
      <div className="card m-2" id="examples">
        <h1>Examples of "{word}"</h1>
        <ul className="m-2  p-2">
          {/* Join sentences array and sort them in the order of length and display them */}
          {errorTwinWord
            ? sentencesWordNick.map(
                (sent, index) => sent.includes(word) && <li key={index}>{sent}</li>
              )
            : joinSentenceArrays(
                sentencesWordNick,
                sentencesTwinWord,
                word
              ).map((sent, index) =>
                sent.includes(word) ? <li key={index}>{sent}</li> : ""
              )}
        </ul>
      </div>
    );
  } else {
    //if word is a compound word or a phrase
    word = word.replace("%20", "-");
    const sentencesDataofWordNick = getSentencesUsingWordnik(word);

    const [sentencesWordNick] = await Promise.all([sentencesDataofWordNick]);

    word = word.replace("%20", "-");

    if (errorWorknick !== null) {
      errorWorknick = null;
      return <></>; //if there is error in fetching sentences return nothing
    }

    return (
      <div className="card m-2">
        <h1>Examples of "{word}" in Sentences</h1>
        {/* {console.log(sentencesWordNick)} */}
        <ul className="m-2">
          {sentencesWordNick.map((sent, index) =>
            sent.includes(word) ? <li key={index}>{sent}</li> : ""
          )}
        </ul>
      </div>
    );
  }
};

export default SentencesFetcher;
