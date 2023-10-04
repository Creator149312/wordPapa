import axios from "axios";
import Link from "next/link";
import DataFilterDisplay from "@utils/DataFilterDisplay";

// export function generateStaticParams() {
//   // let words = allWords.map((w)=>{
//   //   return {word: w};
//   // });

//   // return words;
//   return [{word: "apple"}, {word: "card"}, {word: "papa"}];
// }

let rhymingWords = [];
export default async function Page({ params }) {
  const { word } = params;

  try {
    rhymingWords = [];
    const response = await axios.get(
      `https://api.datamuse.com/words?rel_rhy=${word}`
    );
    rhymingWords = response.data.map((item) => item.word);
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <h1>
        Rhyming Words and Phrases for {word.charAt(0).toUpperCase() + word.slice(1)}
      </h1>
      <p>
        Following is a list of {rhymingWords.length} words and phrases that
        rhyme with {word}:
      </p>
      <DataFilterDisplay words={rhymingWords} />
      <div className="p-4 m-4">
        <p>
          <strong>Related Links:</strong>
        </p>
        <ol>
          <li>
            <Link href={`/adjectives/${word}/`}>
              Adjectives for {word}
            </Link>
          </li>
          <li>
            <Link href={`/similar-words/${word}/`}>Synonyms for {word}</Link>
          </li>
          <li>
            <Link href={`/homophones/${word}/`}>
              Homophones for {word}
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}
