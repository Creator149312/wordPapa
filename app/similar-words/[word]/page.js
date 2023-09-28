import axios from 'axios';
import { displayWords } from '@utils/HelperFunctions';

// let allWords = ["apple", "card", "papa"]

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
      const response = await axios.get(`https://api.datamuse.com/words?ml=${word}&max=15`
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
      <h1>Similar Words and Phrases for {word}</h1>
      <p> There are {rhymingWords.length} words and phrases that are related to {word}. </p>
      {displayWords(rhymingWords, '', '', '', '')}
    </div>
    );
  }

