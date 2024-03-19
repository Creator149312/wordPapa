import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import axios from "axios";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word  = decodeURIComponent(params.word);
  // read route params
  titleStr = "Adjective Words to Describe " + (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr = "Explore list of commonly used adjective words for describing " + params.word + " in writing.";
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

let adjectiveWords = [];

export default async function Page({ params }) {
  //const word = params.word.split('-').join(' ');
  const word  = decodeURIComponent(params.word);
  // try {
  //   adjectiveWords = [];
  //   const response = await axios.get(
  //     `https://api.datamuse.com/words?rel_jjb=${word}&max=200`
  //   );
  //   adjectiveWords = response.data.map((item) => item.word);
  // } catch (error) {
  //   // console.error(error);
  //   return {
  //     notFound: true,
  //   };
  // }

  try {
    adjectiveWords = [];
    const endpoint = `https://api.datamuse.com/words?rel_jjb=${word}&max=200`;
    const res = await fetch(endpoint);
    const data = await res.json();

    adjectiveWords = data.map((item) => item.word);
  } catch (error) {
    // console.error(error);
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <h1>{titleStr}</h1>
      <p> Following is a list of {adjectiveWords.length} adjective words and phrases used for describing {word} in writing. </p>
      <DataFilterDisplay words={adjectiveWords} />
      {adjectiveWords.length > 0 && <RelLinksonPageBottom word={word} pos={null} />}
    </div>
  );
}
