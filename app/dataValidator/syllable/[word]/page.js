import Error from "../error";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
  // read route params
  titleStr = "How many syllables in " + (word.charAt(0).toUpperCase() + word.slice(1)) + "?";
  const descriptionStr = "Check how many syllables are in " + params.word + " and Learn to divide " + params.word + " into syllables.";
  return {
    title: titleStr,
    description: descriptionStr,
  }
}

let syllableWords = [];
export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  titleStr = "How many syllables in " + (word.charAt(0).toUpperCase() + word.slice(1)) + "?";

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
    // console.log(" I am inside error block with error - " + error.name);
    return <Error />;

    // // We'll do this thing in the future if above works fine
    //  syllableWords = {
    //     word: word,
    //     score: 100001,
    //     numSyllables: 0,
    //     tags: [ 'query', 'pron: ', 'ipa_pron: ' ]
    //   }
  }

  return (
    <div>
      <h1>
        {titleStr}
      </h1>
      <div className="card m-3 p-4">
        <h2>{word.charAt(0).toUpperCase() + word.slice(1)}</h2>
        <p><strong>Number of Syllables:</strong> {syllableWords.numSyllables}</p>
        {/* <p><strong>Divide {syllableWords.word} in Syllables: </strong></p> */}
        {/* <p><strong>Part of Speech: </strong>{syllableWords.tags[1]}</p> */}
        <p><strong>ARPAnet Pronounciation:</strong> {syllableWords.tags[syllableWords.tags.length - 2].split(":")[1]}</p>
        <p><strong>IPA Notation: </strong>{syllableWords.tags[syllableWords.tags.length - 1].split(":")[1]}</p>
        <p><strong>Number of Characters: </strong>{word.length}</p>
      </div>
    </div>
  );
}
