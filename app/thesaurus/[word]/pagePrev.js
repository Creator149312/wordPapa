import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import ToggleView from "../ToggleView";
import synonymWordsSET from "../synonym-wordsSET"
import { Card, CardContent, CardHeader } from "@components/ui/card";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  let word = decodeURIComponent(params.word);
  const toIndex = synonymWordsSET.has(word); //if word is present in the syllableWordsArray used to generate sitemap we index it otherwise we do not index

  word = word.replace(/-/g, " ");
  // read route params
  titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore an extensive list of synonyms and antonyms for " +
    params.word +
    " and choose another word that suits you the best for your writing";
  return {
    title: titleStr,
    description: descriptionStr,
    robots: {
      index: toIndex,
    },
  };
}

let AllRelatedWords = [];
let synonymWords = [];
let antonymWords = [];

export default async function Page({ params }) {
  let word = decodeURIComponent(params.word);
  word = word.replace(/-/g, " ");

  titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  try {
    AllRelatedWords = [];

    const timeout = 5000; // Set timeout to 5 seconds
    const syncontroller = new AbortController();
    const syntimeoutId = setTimeout(() => {
      syncontroller.abort();
    }, timeout);

    let endpointSyn = `https://api.datamuse.com/words?ml=${word}&max=150`;
    const synres = await fetch(endpointSyn, { signal: syncontroller.signal });

    clearTimeout(syntimeoutId); // Clear the timeout of synonym request since the request completed

    if (!synres.ok) {
      throw new Error(`API request failed with status ${synres.status}`);
    }

    const syndata = await synres.json();

    const antcontroller = new AbortController();
    const anttimeoutId = setTimeout(() => {
      antcontroller.abort();
    }, timeout);

    let endpointAnt = `https://api.datamuse.com/words?rel_ant=${word}`;
    const antres = await fetch(endpointAnt, { signal: antcontroller.signal });

    clearTimeout(anttimeoutId); // Clear the timeout of synonym request since the request completed

    if (!antres.ok) {
      throw new Error(`API request failed with status ${antres.status}`);
    }

    const antdata = await antres.json();

    const allData = syndata;

    AllRelatedWords = allData.map((item) => item.word);
    const synresponse = allData.filter((obj) => {
      if (obj.hasOwnProperty("tags")) return obj.tags.includes("syn");
    });

    synonymWords = synresponse.map((item) => item.word);
    antonymWords = antdata.map((item) => item.word);
  } catch (error) {
    console.log("Error occured while getting data from api request....")
    AllRelatedWords = [];
    synonymWords = [];
    antonymWords = [];
  }

  return (
    <Card>
      <CardHeader>
      <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
      <p className="mb-6 text-lg font-normal">
        Following is a list of {AllRelatedWords.length} synonym words and
        phrases that are related to <strong>{word}</strong>:
      </p>
      <ToggleView
        allWords={AllRelatedWords}
        synWords={synonymWords}
        antWords={antonymWords}
      />
      <p className="mb-6 text-lg font-normal">Using this list of similar-meaning words, you can choose the best synonyms to replace <strong>{word}</strong> in your sentences.</p>
      <p className="mb-6 text-lg font-normal">Additionally, you'll find antonyms included, perfect for when you need the complete opposite meaning of <strong>{word}</strong> in your writing. </p>
      {AllRelatedWords.length > 0 && (
        <RelLinksonPageBottom word={word} pos={null} />
      )}
      </CardContent>
    </Card>
  );
}