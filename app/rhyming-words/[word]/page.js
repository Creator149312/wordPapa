import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import { CardContent, CardHeader } from "@components/ui/card";


let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
  // read route params
  titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore list of common words that rhyme with " +
    params.word +
    " to use in creative writing and poetry.";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

let rhymingWords = [];
export default async function Page({ params }) {
  const word = decodeURIComponent(params.word); //this one gives the best results
  titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  //const word = params.word.split('-').join(' ');

  try {
    rhymingWords = [];
    const timeout = 5000; // Set timeout to 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const endpoint = `https://api.datamuse.com/words?rel_rhy=${word}&max=200`;

    const res = await fetch(endpoint, { signal: controller.signal });

    clearTimeout(timeoutId); // Clear the timeout since the request completed

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    rhymingWords = data.map((item) => item.word);
  } catch (error) {
    // // console.error(error);
    // return {
    //   notFound: true,
    // };
    rhymingWords = [];
  }

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of {rhymingWords.length} words and phrases that
          rhyme with {word}:
        </p>
        <DataFilterDisplay words={rhymingWords} />
        <p className="mb-6 text-lg font-normal">
          With all these rhyming words at your disposal, you'll surely find the
          perfect word to match with {word} in your writing.
        </p>
        {rhymingWords.length > 0 && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );
}
