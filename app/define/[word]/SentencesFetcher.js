import { sortStringArrayinASC } from "@utils/HelperFunctions";

let errorWordNick = null;
let errorTwinWord = null;
let regex = null;

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

// async function getSentencesUsingWordnik(word) {
//   errorWordNick = null;
//   try {
//     const endpoint = `https://api.wordnik.com/v4/word.json/${word}/examples`;
//     const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4"; // Replace with your Wordnik API key
//     const response = await axios.get(endpoint, {
//       params: {
//         api_key: apiKey,
//       },
//     });

//     // console.log(`Response Data from WorkNick for ${word}- `, response.data);
//     if (
//       response.data.examples !== undefined &&
//       response.data.examples !== null &&
//       response.data.examples.length > 0
//     ) {
//       return sortStringArrayinASC(
//         response.data.examples.map((sent) => {
//           return sent.text;
//         })
//       );
//     } else {
//       throw new Error();
//     }
//   } catch (e) {
//     errorWordNick = e;
//   }
// }

async function getSentencesUsingWordnik(word) {
  errorWordNick = null;
  try {
    const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4"; // Replace with your Wordnik API key
    const endpoint = `https://api.wordnik.com/v4/word.json/${word}/examples?api_key=${apiKey}`;

    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    //console.log(`Response Data from WorkNick for ${word}- `, data);
    if (
      data.examples !== undefined &&
      data.examples !== null &&
      data.examples.length > 0
    ) {
      return sortStringArrayinASC(
        data.examples.map((sent) => {
          return sent.text;
        })
      );
    } else {
      throw new Error();
    }
  } catch (e) {
    errorWordNick = e;
  }
}

// async function getSentencesUsingTwinWord(word, regex) {
//   errorTwinWord = null;
//   try {
//     const options = {
//       method: "GET",
//       url: "https://twinword-word-graph-dictionary.p.rapidapi.com/example/",
//       params: { entry: word },
//       headers: {
//         "X-RapidAPI-Key": "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
//         "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
//       },
//     };

//     const response = await axios.request(options);
//     // console.log("Response Data from TwinWord - ", response.data);

//     if (
//       response.data.examples !== undefined &&
//       response.data.example !== null &&
//       response.data.example.length > 0
//     ) {
//       return sortStringArrayinASC(
//         response.data.example.filter((sent) => sent.match(regex) && sent)
//       );
//     } else {
//       throw new Error();
//     }
//   } catch (e) {
//     errorTwinWord = e;
//   }
// }

async function getSentencesUsingTwinWord(word, regex) {
  errorTwinWord = null;
  try {
    const url = `https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=${word}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
        "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const data = await response.json();
    // console.log("Response Data from TwinWord - ", data);

    if (
      data.example !== undefined &&
      data.example !== null &&
      data.example.length > 0
    ) {
      return sortStringArrayinASC(
        data.example.filter((sent) => sent.match(regex) && sent)
      );
    } else {
      throw new Error();
    }
  } catch (e) {
    errorTwinWord = e;
  }
}

const SentencesFetcher = async ({ word }) => {
  // Create a regular expression with the 'i' flag for case-insensitive search
  regex = new RegExp(word, "i"); //to match all cases of word in a sentence

  if (!(word.includes(" ") || word.includes("-"))) {
    //if it is word not a phrase or
    //if there is only one word in input text
    const sentencesDataofTwinWord = getSentencesUsingTwinWord(word, regex);
    const sentencesDataofWordNick = getSentencesUsingWordnik(word);

    const [sentencesTwinWord, sentencesWordNick] = await Promise.all([
      sentencesDataofTwinWord,
      sentencesDataofWordNick,
    ]);
    // console.log("We are inside, Checking for", word);
    // console.log("Sentences from Twinword", sentencesTwinWord);
    // console.log("Sentences from WorkNick", sentencesWordNick);
    // console.log(errorWordNick + " --- " + errorTwinWord);

    //if no sentences found return empty jsx element
    if (errorWordNick && errorTwinWord) {
      errorWordNick = null;
      errorTwinWord = null;
      //console.log("Nothing is rendered")
      return <></>;
    }

    return (
      <div className="card m-2" id="examples">
        <h1>Examples of "{word}" in Sentences</h1>
        <ul className="m-2 p-2">
          {
            // if there is an error in fetching Sentences using Twinword API
            errorTwinWord &&
              (sentencesWordNick !== undefined &&
              sentencesWordNick.length > 0 ? (
                sentencesWordNick.map(
                  (sent, index) =>
                    sent.match(regex) && <li key={index}>{sent}</li>
                )
              ) : (
                <p>No Sentences Found for {word}</p>
              ))
          }
          {
            //if there is an error fetching sentences using WordNick API
            errorWordNick &&
              ((sentencesTwinWord !== undefined &&
              sentencesTwinWord.length > 0) ? (
                sentencesTwinWord.map(
                  (sent, index) =>
                    sent.match(regex) && <li key={index}>{sent}</li>
                )
              ) : (
                <p>No Sentences Found for {word}</p>
              ))
          }
          {
            /* If no errors are found Join sentences array and sort them in the order of length and display them */
            // !errorTwinWord &&
            //   !errorWordNick &&
            //   sortStringArrayinASC(sentencesTwinWord.concat(sentencesWordNick)).map((sent, index) =>
            //     sent.match(regex) ? <li key={index}>{sent}</li> : ""
            //   )
            !errorTwinWord &&
              !errorWordNick &&
              sortStringArrayinASC(
                sentencesTwinWord.concat(sentencesWordNick)
              ).map((sent, index) => <li key={index}>{sent}</li>)
          }
        </ul>
      </div>
    );
  } else {
    //if word is a compound word or a phrase
    //word = word.replace("%20", "-");
    const sentencesDataofWordNick = getSentencesUsingWordnik(word);

    const [sentencesWordNick] = await Promise.all([sentencesDataofWordNick]);

    //word = word.replace("%20", "-");
    // console.log("We are inside, Checking for", word);
    if (errorWordNick !== null) {
      errorWordNick = null;
      return <></>; //if there is error in fetching sentences return nothing
    }

    return (
      <div className="card m-2">
        <h1>Examples of "{word}" in Sentences</h1>
        {/* { console.log(sentencesWordNick)} */}
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
