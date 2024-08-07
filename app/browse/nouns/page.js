import {
  Card,
} from "@/components/ui/card"

import AdsUnit from "@components/AdsUnit";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Noun Dictionary: List of All Nouns in English`;
  const descriptionStr = `Browse all 80000+ nouns in alphabetically sorted order which are commonly used in English language for naming person, place, thing or idea.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const generateNounLinks = async () => {
  let nounsJsx = [];

  for (let i = 0; i < 26; i += 2) {
    let firstChar = String.fromCharCode(97 + i);
    let secondChar = String.fromCharCode(97 + i + 1);
    nounsJsx.push(
      <div className="grid md:grid-cols-12 m-2" key={i}>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/nouns/${firstChar}`}>
            <div className="text-lg">Nouns beginning with {firstChar}</div>
          </a>
        </Card>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/nouns/${secondChar}`}>
            <div className="text-lg">Nouns beginning with {secondChar}</div>
          </a>
        </Card>
      </div>
    );
  }

  return nounsJsx;
};

const generateNounEndLinks = async () => {
  let nounsJsx = [];
  let endingPhrases = ["o", "s", "f", "z", "fe", "ment", "ss", "ies", "sh", "ing", "us", "y", "es", "ves"]

  for (let i = 0; i < endingPhrases.length; i += 2) {
    let firstChar = endingPhrases[i];
    let secondChar = endingPhrases[i + 1];
    nounsJsx.push(
      <div className="grid md:grid-cols-12 m-2" key={i}>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/nouns/end/${firstChar}`}>
            <div className="text-lg">Nouns Ending with {firstChar}</div>
          </a>
        </Card>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/nouns/end/${secondChar}`}>
            <div className="text-lg">Nouns Ending with {secondChar}</div>
          </a>
        </Card>
      </div>
    );
  }

  return nounsJsx;
};

const Page = async () => {
  let nounsLinks = await generateNounLinks();
  let nounsEndLinks = await generateNounEndLinks();

  return (
    <div className="m-2 p-3">
      <h1 className="mb-3 text-4xl font-bold">Noun Dictionary: List of All Nouns in English</h1>
      <p className="mb-6 text-lg font-normal">
        Welcome to the noun dictionary page where you can find all the noun words in
        English from A to Z. Here, you'll explore the vast array of words that name people,
        places, things, and ideas!
      </p>
      <p className="mb-6 text-lg font-normal">
        From common objects like "table" and "chair" to abstract concepts like
        "love" and "justice," you'll find nouns spanning every aspect of human experience.
      </p>
      <AdsUnit slot='7782807936'/> 
      <p className="mb-6 text-lg font-normal">
        There are around 80,000 plus frequently used nouns in the
        English language, available for naming.
      </p>
      <h2 className="mb-3 mt-5 text-3xl font-semibold">Nouns that Begin With</h2>
      <p className="mb-6 text-lg font-normal">We've organized
        them into alphabetically sorted lists of nouns, each beginning with a specific letter or group of letters.</p>
      {nounsLinks.map((linkdata) => linkdata)}
      <AdsUnit slot='7782807936'/> 
      <h2 className="mb-3 mt-5 text-3xl font-semibold">Nouns that End With</h2>
      <p className="mb-6 text-lg font-normal">The following lists offer a glimpse into the diverse vocabulary of noun words that end with the letter or sequence of letters.</p>
      {nounsEndLinks.map((linkdata) => linkdata)}
      <p className="mb-6 text-lg font-normal">
        Whether you're a student expanding your vocabulary, a writer seeking inspiration, this exhaustive noun compilation gives you endless possibilities of naming person, place or thing and discover the beauty of
        linguistic expression.
      </p>
      <AdsUnit slot='7782807936'/> 
    </div>
  );
};

export default Page;
