import AdsUnit from '@components/AdsUnit';
import DataFilterDisplay from '@utils/DataFilterDisplay';
import axios from 'axios';
import AdsScriptLoader from '@components/AdsScriptLoader';

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
    const response = await axios.get(`https://api.datamuse.com/words?rel_hom=${word}&max=12`);
    rhymingWords = response.data.map((item) => item.word);
  } catch (error) {
    //console.error(error);
    rhymingWords = [];
  }

  return (<>
    <div>
      <h1>Homophones words for "{word}"</h1>
      <AdsUnit w="100%" h="100%" slot="7782807936" />
      <DataFilterDisplay words={rhymingWords} />
    </div>
    <AdsScriptLoader />
  </>
  );
}

