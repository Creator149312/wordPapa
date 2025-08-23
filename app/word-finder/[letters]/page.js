import allUSWords from "../allUsWords";
import unScrambledWordsSet from "../unscrambled-wordsSET"
import DataFilterDisplay from "@/utils/DataFilterDisplay";
import { CardContent, CardHeader } from "@/components/ui/card";

export const revalidate = 2592000; // Revalidate 

export async function generateStaticParams() {
  const popularCombos = ["stone", "apple", "train", "react", "words"];
  return popularCombos.map((letters) => ({ letters }));
}

export async function generateMetadata({ params }) {
  const letters = decodeURIComponent(params.letters);
  const toIndex = unScrambledWordsSet.has(letters);
  const ltUp = letters.toUpperCase();

  return {
    title: `Unscramble ${ltUp} | Find Words with letters in ${ltUp}`,
    description: `Explore list of words you can make using letters in ${ltUp} when you unscramble.`,
    robots: {
      index: toIndex,
    },
  };
}

function getWords(letters) {
  const questionMarks = (letters.match(/_/g) || []).length;
  const maxLength = letters.length;
  const minLength = 2;

  // Build frequency map of input letters
  const letterFreq = {};
  for (const char of letters) {
    if (char !== "_") {
      letterFreq[char] = (letterFreq[char] || 0) + 1;
    }
  }

  const matchingWords = [];

  for (const word of allUSWords) {
    const wordLen = word.length;

    // Skip words that are too short or too long
    if (wordLen < minLength) continue;
    if (wordLen > maxLength) break; // Because list is sorted by length

    // Build frequency map of the word
    const wordFreq = {};
    for (const char of word) {
      wordFreq[char] = (wordFreq[char] || 0) + 1;
    }

    let wildcardsUsed = 0;
    let canForm = true;

    for (const char in wordFreq) {
      const required = wordFreq[char];
      const available = letterFreq[char] || 0;
      if (required > available) {
        wildcardsUsed += required - available;
        if (wildcardsUsed > questionMarks) {
          canForm = false;
          break;
        }
      }
    }

    if (canForm) {
      matchingWords.push(word);
    }
  }

  return matchingWords;
}


export default async function Page({ params }) {
  const letters = decodeURIComponent(params.letters);
  const wordsWithLetters = getWords(letters);
  const letterinUppercase = letters.toUpperCase();
  const pageHeading = `Unscramble ${letterinUppercase} | Find Words with letters in ${letterinUppercase}`;

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold">{pageHeading}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of English words you can form using letters in{" "}
          {letterinUppercase} when unscrambled.
        </p>
        <DataFilterDisplay words={wordsWithLetters} />
      </CardContent>
    </>
  );
}
