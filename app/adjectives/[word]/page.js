import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import adjectiveWordsSET from "../adjectivewordsSET";
import { CardContent, CardHeader } from "@components/ui/card";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = adjectiveWordsSET.has(word);

  const titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  const descriptionStr =
    "Explore list of commonly used adjective words for describing " +
    params.word +
    " in writing.";

  return {
    title: titleStr,
    description: descriptionStr,
    robots: {
      index: toIndex,
    },
  };
}

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  const isNotCompound = word.split(" ").length === 1;
  let adjectiveWords = [];

  const titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  if (isNotCompound) {
    try {
      // ✅ API-level caching for Datamuse
      const res = await fetch(
        `https://api.datamuse.com/words?rel_jjb=${word}&max=100`,
        { cache: "force-cache" }
      );

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      adjectiveWords = (await res.json()).map((item) => item.word);
    } catch (error) {
      console.error("Error fetching adjectives:", error);
      adjectiveWords = [];
    }
  }

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of {adjectiveWords.length} adjective words and
          phrases used for describing <strong>{word}</strong> in writing.
        </p>
        <DataFilterDisplay words={adjectiveWords} />
        <p className="mb-6 text-lg font-normal">
          With these adjectives you can choose the one that perfectly describes{" "}
          {word} in your writing. Don't be afraid to experiment with various
          combinations. Try to push the boundaries of your descriptions to
          elevate it from good to great.
        </p>
        {adjectiveWords.length > 0 && isNotCompound && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );
}


