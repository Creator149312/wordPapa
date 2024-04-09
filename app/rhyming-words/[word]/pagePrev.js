import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word  = decodeURIComponent(params.word);
  // read route params
  titleStr = "Rhyming Words and Phrases for " + (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr = "Explore list of common words that rhyme with " + params.word + " to use in creative writing and poetry.";
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

let rhymingWords = [];
export default async function Page({ params }) {
  const word  = decodeURIComponent(params.word); //this one gives the best results
  //const word = params.word.split('-').join(' ');
  
  // try {
  //   rhymingWords = [];
  //   const response = await axios.get(
  //     `https://api.datamuse.com/words?rel_rhy=${word}&max=200`
  //   );
  //   rhymingWords = response.data.map((item) => item.word);
  // } catch (error) {
  //   // console.error(error);
  //   return {
  //     notFound: true,
  //   };
  // }

  try {
    rhymingWords = [];
    const endpoint = `https://api.datamuse.com/words?rel_rhy=${word}&max=200`;

    const res = await fetch(endpoint);
    const data = await res.json();

    rhymingWords = data.map((item) => item.word);
  } catch (error) {
    // console.error(error);
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
      <p>With all these rhyming words at your disposal, you'll surely find the perfect word to match with {word} in your writing.</p>
      {rhymingWords.length > 0 && <RelLinksonPageBottom word={word} pos={null} />}
    </div>
  );
}
