import Error from "../error";
import syllableWordsSET from "../syllable-wordsSET";
import { CardContent, CardHeader } from "@components/ui/card";

export const revalidate = 2592000; // ✅ Cache full page HTML

export async function generateMetadata({ params }) {
  const word = decodeURIComponent(params.word);
  const toIndex = syllableWordsSET.has(word);

  const titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";

  const descriptionStr =
    "Check how many syllables are in " +
    params.word +
    " and learn to divide " +
    params.word +
    " into syllables.";

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
  const titleStr =
    "How many syllables in " +
    (word.charAt(0).toUpperCase() + word.slice(1)) +
    "?";

  let syllableWords;

  try {
    const endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=sr&max=1&ipa=1`;

    // ✅ API-level caching
    const res = await fetch(endpoint, { cache: "force-cache" });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    syllableWords = data[0];
  } catch (error) {
    console.error("Error fetching syllable data:", error);

    // Fallback data
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
        <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent className="m-3 p-3">
        <h2 className="text-3xl mb-6 font-semibold">
          {word.charAt(0).toUpperCase() + word.slice(1)}
        </h2>
        <p className="mb-6 text-lg font-normal">
          <strong>Number of Syllables:</strong> {syllableWords.numSyllables}
        </p>
        <p className="mb-6 text-lg font-normal">
          <strong>ARPAnet Pronunciation:</strong>{" "}
          {syllableWords.tags[syllableWords.tags.length - 2]?.split(":")[1] || ""}
        </p>
        <p className="mb-6 text-lg font-normal">
          <strong>IPA Notation: </strong>
          {syllableWords.tags[syllableWords.tags.length - 1]?.split(":")[1] || ""}
        </p>
        <p className="mb-6 text-lg font-normal">
          <strong>Number of Characters: </strong>
          {word.length}
        </p>
      </CardContent>
    </>
  );
}
