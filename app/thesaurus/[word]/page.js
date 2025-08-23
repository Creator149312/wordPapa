import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import ToggleView from "../ToggleView";
import synonymWordsSET from "../synonym-wordsSET";
import { CardContent, CardHeader } from "@components/ui/card";

export const revalidate = 2592000; // ✅ Cache full page HTML

// Metadata stays the same — no change needed for caching
export async function generateMetadata({ params }) {
  let word = decodeURIComponent(params.word);
  const toIndex = synonymWordsSET.has(word);

  word = word.replace(/-/g, " ");
  const titleStr =
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

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word).replace(/-/g, " ");
  const titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  let AllRelatedWords = [];
  let synonymWords = [];
  let antonymWords = [];

  try {
    // ✅ Fetch both in parallel with API-level caching
    const [syndata, antdata] = await Promise.all([
      fetch(`https://api.datamuse.com/words?ml=${word}&max=100`, {
        cache: "force-cache",
      }).then((res) => res.json()),
      fetch(`https://api.datamuse.com/words?rel_ant=${word}`, {
        cache: "force-cache",
      }).then((res) => res.json()),
    ]);

    AllRelatedWords = syndata.map((item) => item.word);
    synonymWords = syndata
      .filter((obj) => obj.tags?.includes("syn"))
      .map((item) => item.word);
    antonymWords = antdata.map((item) => item.word);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
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

        <p className="mb-6 text-lg font-normal">
          Using this list of similar-meaning words, you can choose the best
          synonyms to replace <strong>{word}</strong> in your sentences.
        </p>
        <p className="mb-6 text-lg font-normal">
          Additionally, you'll find antonyms included, perfect for when you
          need the complete opposite meaning of <strong>{word}</strong> in your
          writing.
        </p>

        {AllRelatedWords.length > 0 && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );
}
