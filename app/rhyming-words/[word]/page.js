import axios from "axios";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";

let titleStr = "";
export async function generateMetadata({ params }, parent) {

  const {word} = params;
  // read route params
  titleStr = "Rhyming Words and Phrases for " + (word.charAt(0).toUpperCase() + word.slice(1));
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
  const { word } = params; //this one gives the best results
  //const word = params.word.split('-').join(' ');
  
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
      {titleStr}
      </h1>
      <p>
        Following is a list of {rhymingWords.length} words and phrases that
        rhyme with {word}:
      </p>
      <DataFilterDisplay words={rhymingWords} />
      {rhymingWords.length > 0 && <RelLinksonPageBottom word={word} pos={null} />}
    </div>
  );
}
