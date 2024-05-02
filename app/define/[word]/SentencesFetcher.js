import { sortStringArrayinASC } from "@utils/HelperFunctions";
import { Card, CardContent, CardHeader } from "@components/ui/card";

let errorWordNick = null;
let errorTwinWord = null;
let regex = null;
const timeout = 5000; // Set timeout to 5 second

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
  errorWordNick = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4"; // Replace with your Wordnik API key
    const endpoint = `https://api.wordnik.com/v4/word.json/${word}/examples?api_key=${apiKey}`;

    const response = await fetch(endpoint, { signal: controller.signal });

    clearTimeout(timeoutId); // Clear the timeout since the request completed
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
    // console.log("Error occured in WordNick Fetch, for Word ", word);
    errorWordNick = e;
  }
}

async function getSentencesUsingTwinWord(word, regex) {
  errorTwinWord = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);
    const signal = controller.signal;

    const url = `https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=${word}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
        "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
      },
      signal
    };

    const response = await fetch(url, options);

    clearTimeout(timeoutId); // Clear the timeout since the request completed

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
    // console.log("Error occured in Twinword Fetch");
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
      <Card className="m-2" id="examples">
        <CardHeader><h1 className="text-3xl font-extrabold">Examples of "{word}" in Sentences</h1></CardHeader>
        <CardContent>
          <ul className="m-2 p-2 list-disc">
            {
              // if there is an error in fetching Sentences using Twinword API
              errorTwinWord &&
              (sentencesWordNick !== undefined &&
                sentencesWordNick.length > 0 ? (
                sentencesWordNick.map(
                  (sent, index) =>
                    sent.match(regex) && <li className="p-0.5" key={index}>{sent}</li>
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
                    sent.match(regex) && <li className="p-0.5" key={index}>{sent}</li>
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
              ).map((sent, index) => <li className="p-0.5" key={index}>{sent}</li>)
            }
          </ul>
        </CardContent>
      </Card>
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
      <Card className="m-2">
        <CardHeader>
          <h1 className="text-3xl font-extrabold">Examples of "{word}" in Sentences</h1>
        </CardHeader>
        <CardContent>
          {/* { console.log(sentencesWordNick)} */}
          <ul className="m-2 p-2 list-disc">
            {sentencesWordNick.map((sent, index) =>
              sent.includes(word) ? <li className="p-0.5" key={index}>{sent}</li> : ""
            )}
          </ul>
        </CardContent>
      </Card>
    );
  }
};

export default SentencesFetcher;