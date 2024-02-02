import ADJECTIVE from "../../ADJECTIVE_WORDS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L  = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Adjective Words Starting with ${L} Letters`;
  const descriptionStr = `Browse all adjectives that start with the letter ${L} to perfectly describe nouns and objects`;
  return {
    title: titleStr,
    description: descriptionStr ,
  }
}

const Page = async ({ params }) => {
  function customLink(word){
    let wordwithHyphens = word.toLowerCase().replace(/ /g, '-');
    let slug = commonLinks.definition + wordwithHyphens;
    
    return <Link href={slug} target="_blank" rel="noopener noreferrer">{word}</Link>;
  }

  let words = ADJECTIVE.filter((adj)=> {return adj.startsWith(params.letter)})
  return (
    <>
      <h1>{titleStr}</h1>
      {console.log(words.length)}
      {words.map((link, index) => (
        <div key={index} className='wordSpan'>
          {customLink(link)}
        </div>
      ))}
  
    </>
  );
};

export default Page;
