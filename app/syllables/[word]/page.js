import Error from "../error";
import { CardContent, CardHeader } from "@components/ui/card";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
  // read route params
  titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";
  const descriptionStr =
    "Check how many syllables are in " +
    params.word +
    " and Learn to divide " +
    params.word +
    " into syllables.";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

let syllableWords = [];
export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";

  try {
    syllableWords = {};
    const timeout = 5000; // Set timeout to 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=sr&max=1&ipa=1`;
    const res = await fetch(endpoint, { signal: controller.signal });

    clearTimeout(timeoutId); // Clear the timeout since the request completed

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    syllableWords = data[0];
    // const endTime = Date.now(); // Record the end time of the request
    // const elapsedTime = (endTime - startTime); // Calculate elapsed time in seconds
    // console.log(`It took ${elapsedTime} milliseconds to process request`);
    //console.log(data);
  } catch (error) {
    //console.log(" I am inside error block with error - " + error.name);
    //return <Error />;

    // We'll do this thing in the future if above works fine
    syllableWords = {
      word: word,
      score: 100001,
      numSyllables: 0,
      tags: ["query", "pron: ", "ipa_pron: "],
    };
  }

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold"> {titleStr}</h1>
      </CardHeader>
      <CardContent className="m-3 p-3">
        <h2 className="text-3xl mb-6 font-semibold">{word.charAt(0).toUpperCase() + word.slice(1)}</h2>
        <p className="mb-6 text-lg font-normal">
          <strong>Number of Syllables:</strong> {syllableWords.numSyllables}
        </p>
        {/* <p><strong>Divide {syllableWords.word} in Syllables: </strong></p> */}
        {/* <p><strong>Part of Speech: </strong>{syllableWords.tags[1]}</p> */}
        <p className="mb-6 text-lg font-normal">
          <strong>ARPAnet Pronounciation:</strong>{" "}
          {syllableWords.tags[syllableWords.tags.length - 2].split(":")[1]}
        </p>
        <p className="mb-6 text-lg font-normal">
          <strong>IPA Notation: </strong>
          {syllableWords.tags[syllableWords.tags.length - 1].split(":")[1]}
        </p>
        <p className="mb-6 text-lg font-normal">
          <strong>Number of Characters: </strong>
          {word.length}
        </p>
      </CardContent>
    </>
  );
}
