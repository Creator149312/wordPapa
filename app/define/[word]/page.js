import axios from 'axios';

let allWords = ["apple", "card", "papa"]

export function generateStaticParams() {
  // let words = allWords.map((w)=>{
  //   return {word: w};
  // });

  // return words; 
  return [{word: "apple"}, {word: "card"}, {word: "papa"}];
}

let rhymingWords = [];
export default async function Page({ params }) {

    const { word } = params;
  
    try {
      rhymingWords = [];
      const response = await axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`);
      rhymingWords = response.data.map((item) => item.word);
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }

    return (
      <div>
        <h1>Rhyming words for "{word}"</h1>
        <ul>
          {rhymingWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    );
  }

