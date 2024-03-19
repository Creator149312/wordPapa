import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import ToggleView from "../ToggleView";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  let word = decodeURIComponent(params.word);
  word = word.replace(/-/g, " ");
  // read route params
  titleStr =
    "Synonyms and Antonyms for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore an extensive list of synonyms and antonyms for " +
    params.word +
    " and choose another word that suits you the best for your writing";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

let AllRelatedWords = [];
let synonymWords = [];
let antonymWords = [];

export default async function Page({ params }) {
  let word = decodeURIComponent(params.word);
  word = word.replace(/-/g, " ");

  // try {
  //   AllRelatedWords = [];
  //   const response = await axios.get(
  //     `https://api.datamuse.com/words?ml=${word}&max=200`
  //   );

  //   const antresponse = await axios.get(
  //     `https://api.datamuse.com/words?rel_ant=${word}`
  //   );

  //   // const synresponse = await axios.get(
  //   //   `https://api.datamuse.com/words?rel_syn=${word}`
  //   // );
  //   const allData = response.data;

  //   AllRelatedWords = allData.map((item) => item.word);
  //   const synresponse = allData.filter((obj) => {
  //     if (obj.hasOwnProperty("tags")) return obj.tags.includes("syn");
  //   });

  //   // console.log(response.data);
  //   // console.log(synresponse);
  //   // console.log(antresponse.data);

  //   synonymWords = synresponse.map((item) => item.word);
  //   antonymWords = antresponse.data.map((item) => item.word);
  // } catch (error) {
  //   return {
  //     notFound: true,
  //   };
  // }


  try {
    AllRelatedWords = [];

    let endpointSyn = `https://api.datamuse.com/words?ml=${word}&max=200`;
    const synres = await fetch(endpointSyn);
    const syndata = await synres.json();

    let endpointAnt = `https://api.datamuse.com/words?rel_ant=${word}`;
    const antres = await fetch(endpointAnt);
    const antdata = await antres.json();

    const allData = syndata;

    AllRelatedWords = allData.map((item) => item.word);
    const synresponse = allData.filter((obj) => {
      if (obj.hasOwnProperty("tags")) return obj.tags.includes("syn");
    });

    synonymWords = synresponse.map((item) => item.word);
    antonymWords = antdata.map((item) => item.word);
  } catch (error) {
    return {
      notFound: true,
    };
  }


  return (
    <div>
      <h1>{titleStr}</h1>
      <p>
        Following is a list of {AllRelatedWords.length} synonym words and
        phrases that are related to "{word}":
      </p>
      <ToggleView
        allWords={AllRelatedWords}
        synWords={synonymWords}
        antWords={antonymWords}
      />
      <p>Take your writing to the next level with these similar words and pick the best synonyms to use in place of "{word}" in your sentences.</p>
      {AllRelatedWords.length > 0 && (
        <RelLinksonPageBottom word={word} pos={null} />
      )}
    </div>
  );
}