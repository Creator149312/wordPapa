import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import { CardContent, CardHeader } from "@components/ui/card";
import rhymingWordsSET from "../rhyming-wordsSET";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = rhymingWordsSET.has(word);

  const titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  const descriptionStr =
    "Explore list of common words that rhyme with " +
    params.word +
    " to use in creative writing and poetry.";

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
  let rhymingWords = [];
  let similarSoundingWords = [];

  const titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  if (isNotCompound) {
    try {
      // ✅ API-level caching for rhyming words
      const res = await fetch(
        `https://api.datamuse.com/words?rel_rhy=${word}&max=100`,
        { cache: "force-cache" }
      );

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      rhymingWords = (await res.json()).map((item) => item.word);

      // If no rhyming words, fetch similar sounding words
      if (rhymingWords.length <= 0) {
        const SSres = await fetch(
          `https://api.datamuse.com/words?sl=${word}&max=50`,
          { cache: "force-cache" }
        );

        if (!SSres.ok) {
          throw new Error(`API request failed with status ${SSres.status}`);
        }

        similarSoundingWords = (await SSres.json()).map((item) => item.word);
      }
    } catch (error) {
      console.error("Error fetching rhyming/similar words:", error);
    }
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

        {similarSoundingWords.length > 0 && (
          <>
            <h2 className="text-3xl mb-6 font-bold">
              Words that Sound Similar to {word}
            </h2>
            <p className="mb-6 text-lg font-normal">
              If you are not fully satisfied with rhyming words, you can pick
              from the words that sound similar to {word}.
            </p>
            <DataFilterDisplay words={similarSoundingWords} />
          </>
        )}

        {rhymingWords.length > 0 && isNotCompound && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );
}

