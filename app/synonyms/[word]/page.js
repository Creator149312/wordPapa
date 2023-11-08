import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import axios from "axios";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word  = decodeURIComponent(params.word);
  // read route params
  titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore an extensive list of synonyms and antonyms for " +
    params.word +
    " and choose another word that suits you the best";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

// export function generateStaticParams() {
//   // let words = allWords.map((w)=>{
//   //   return {word: w};
//   // });

//   // return words;
//   return [{word: "apple"}, {word: "card"}, {word: "papa"}];
// }

let synonymWords = [];
export default async function Page({ params }) {
  const word  = decodeURIComponent(params.word);

  try {
    synonymWords = [];
    const response = await axios.get(
      `https://api.datamuse.com/words?ml=${word}`
    );
    synonymWords = response.data.map((item) => item.word);
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <h1>{titleStr}</h1>
      <p>
        Following is a list of {synonymWords.length} synonym words and phrases
        that are related to {word}.
      </p>
      <DataFilterDisplay words={synonymWords} />
      {synonymWords.length > 0 && <RelLinksonPageBottom word={word} pos={null} />}
    </div>
  );
}
