import axios from "axios";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  //const word = params.word.split('-').join(' ');
  const word  = decodeURIComponent(params.word);
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

let syllableWords = [];
export default async function Page({ params }) {
  //const { word } = params;
  //const word = params.word.split('-').join(' ');
  const word  = decodeURIComponent(params.word);

  try {
    syllableWords = [];
    
    const response = await axios.get(
      `https://api.datamuse.com/words?sp=${word}&qe=sp&md=sr&max=1&ipa=1`
    );

    syllableWords = response.data[0];
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
      <div className="card m-3 p-4">
        <h2>{word.charAt(0).toUpperCase() + word.slice(1)}</h2>
        <p><strong>Number of Syllables:</strong> {syllableWords.numSyllables}</p>
        {/* <p><strong>Divide {syllableWords.word} in Syllables: </strong></p> */}
        {/* <p><strong>Part of Speech: </strong>{syllableWords.tags[1]}</p> */}
      <p><strong>ARPAnet Pronounciation:</strong> {syllableWords.tags[syllableWords.tags.length - 2].split(":")[1]}</p> 
        <p><strong>IPA Notation: </strong>{syllableWords.tags[syllableWords.tags.length - 1].split(":")[1]}</p>
        <p><strong>Number of Characters: </strong>{word.length}</p>
      </div>
    </div>
  );
}
