import axios from "axios";
import Link from "next/link";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {

  const {word} = params;
  // read route params
  titleStr = "How many syllables in " + (word.charAt(0).toUpperCase() + word.slice(1)) + "?";
  const descriptionStr = "Explore list of common words that rhyme with " + params.word + " to use in creative writing and poetry.";
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

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
      `https://api.datamuse.com/words?sp=${word}&qe=sp&md=psr&max=1&ipa=1`
    );

    console.log(response.data[0]);
    rhymingWords = response.data[0];
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <h1>
      {titleStr}
      </h1>
      <div className="card m-3 p-4">
        <h2>{word.charAt(0).toUpperCase() + word.slice(1)}</h2>
        <p><strong>Number of Syllables:</strong> {rhymingWords.numSyllables}</p>
        {/* <p><strong>Divide {rhymingWords.word} in Syllables: </strong></p> */}
        <p><strong>Part of Speech: </strong>{rhymingWords.tags[1]}</p>
        <p><strong>ARPAnet Pronounciation:</strong> {rhymingWords.tags[2].split(":")[1]}</p>
        <p><strong>IPA Pronounciation: </strong>{rhymingWords.tags[3].split(":")[1]}</p>
      </div>
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
            <Link href={`/synonyms/${word}/`}>Synonyms for {word}</Link>
          </li>
          <li>
            <Link href={`/define/${word}/`}>
              Homophones for {word}
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}