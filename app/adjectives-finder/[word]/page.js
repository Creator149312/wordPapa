import DataFilterDisplay from "@utils/DataFilterDisplay";
import axios from "axios";
import Link from "next/link";

export function generateStaticParams() {
//   // let words = allWords.map((w)=>{
//   //   return {word: w};
//   // });

//   // return words;
   return [{ word: "apple" }, { word: "card" }, { word: "papa" }];
}

let rhymingWords = [];

export default async function Page({ params }) {
  const { word } = params;

  try {
    rhymingWords = [];
    const response = await axios.get(
      `https://api.datamuse.com/words?rel_jjb=${word}`
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
      <h1>Adjective Words to Describe "{params.word.toUpperCase()}"</h1>
      <p> Following is a list of {rhymingWords.length} adjective words and phrases used to describe {word}. </p>
      <DataFilterDisplay words={rhymingWords} />
      <div className='p-4 m-4'>
          <p><strong>Related Links:</strong></p>
        <ol>
          <li><Link href={`/adjectives-finder/${word}/`}>Adjectives for {word}</Link></li>
          <li><Link href={`/similar-words/${word}/`}>Synonyms for {word}</Link></li>
          <li><Link href={`/homophones-finder/${word}/`}>Homophones for {word}</Link></li>
        </ol>
        </div>
    </div>
  );
}
