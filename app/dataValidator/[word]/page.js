
import axios from 'axios';

let rhymingWords = 0;
export default async function Page({ params }) {

    const { word } = params;
  
    try {
      rhymingWords = 0;
      const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&qe=sp&md=d&max=1&v=enwiki`);
      console.log(response.data);
      const wordData = response.data[0];
      if (wordData.hasOwnProperty("defs")) {
        console.log(`The JSON object has the property DEFS.`);
        rhymingWords = wordData.defs.length;
      }
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }

    return (
      <div>
        <h1>{word} is {rhymingWords > 0 ? 'Valid': 'Invalid'}</h1>
      </div>
    );
  }

