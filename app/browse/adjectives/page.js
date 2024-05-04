import {
  Card,
} from "@/components/ui/card"

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Adjective Dictionary: List of All Adjectives in English`;
  const descriptionStr = `Browse the Ultimate Adjective Dictionary of 21000+ adjective words in alphabetically sorted order which are commonly used in English language to describe person, place or thing.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const generateAdjectiveLinks = async () => {
  let adjJsx = [];

  for (let i = 0; i < 26; i += 2) {
    let firstChar = String.fromCharCode(97 + i);
    let secondChar = String.fromCharCode(97 + i + 1);
    adjJsx.push(
      <div className="grid md:grid-cols-12 m-2" key={i}>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/adjectives/${firstChar}`}>
            <div className="text-lg">Letter {firstChar} Adjectives</div>
          </a>
        </Card>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/adjectives/${secondChar}`}>
            <div className="text-lg">Letter {secondChar} Adjectives</div>
          </a>
        </Card>
      </div>
    );
  }

  return adjJsx;
};

const generateAdjectiveEndingLinks = async () => {
  let adjJsx = [];
  let endingPhrases = ["y", "ly", "ful", "less", "e", "a", "al", "er"];

  for (let i = 0; i < endingPhrases.length; i += 2) {
    let firstChar = endingPhrases[i];
    let secondChar = endingPhrases[i + 1];
    adjJsx.push(
      <div className="grid md:grid-cols-12 m-2" key={i}>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/adjectives/end/${firstChar}`}>
            <div className="text-lg">Adjectives Ending with {firstChar}</div>
          </a>
        </Card>
        <Card className="md:col-span-6 text-center m-2 p-2">
          <a href={`/browse/adjectives/end/${secondChar}`}>
            <div className="text-lg">Adjectives Ending with {secondChar}</div>
          </a>
        </Card>
      </div>
    );
  }

  return adjJsx;
};

const Page = async () => {
  let adjLinks = await generateAdjectiveLinks();
  let adjEndingLinks = await generateAdjectiveEndingLinks();

  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <h1 className="mb-3 text-4xl font-bold">Adjective Dictionary: List of All Adjectives in English</h1>
          <p className="mb-6 text-lg font-normal">
            Welcome to the adjectives dictionary page where you can find all the describing words in
            English. Here, you'll discover a rich vocabulary of descriptive
            words that capture a myriad of sentiments and characteristics.
          </p>
          <p className="mb-6 text-lg font-normal">
            From words that show how things look, feel, or act, to words that
            help you <a href="https://www.englishbix.com/words-to-describe-feeling-and-emotions/">express your emotions and feelings</a>, you'll find them all
            here.
          </p>
          <p className="mb-6 text-lg font-normal">
            There are approximately 21,000 uncommon and common adjectives in English, used to describe nouns.
          </p>
          <h2 className="mb-3 mt-5 text-3xl font-semibold">Adjectives the Start With </h2>
          <p className="mb-6 text-lg font-normal"> We've organized
            them into sorted lists of adjectives from a to z, each starting with a specific letter or group of letters.</p>
          {adjLinks.map((linkdata) => linkdata)}
          <div className="grid md:grid-cols-12 m-2">
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/al`}>
                <div className="text-lg">Adjectives that starts with al</div>
              </a>
            </Card>
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/th`}>
                <div className="text-lg">Adjectives that starts with th</div>
              </a>
            </Card>
          </div>
          <div className="grid md:grid-cols-12 m-2">
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/un`}>
                <div className="text-lg">Adjectives that starts with un</div>
              </a>
            </Card>
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/in`}>
                <div className="text-lg">Adjectives that starts with in</div>
              </a>
            </Card>
          </div>
          <div className="grid md:grid-cols-12 m-2">
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/ch`}>
                <div className="text-lg">Adjectives that starts with ch</div>
              </a>
            </Card>
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/ab`}>
                <div className="text-lg">Adjectives that starts with ab</div>
              </a>
            </Card>
          </div>
          <div className="grid md:grid-cols-12 m-2">
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/de`}>
                <div className="text-lg">Adjectives that starts with de</div>
              </a>
            </Card>
            <Card className="md:col-span-6 text-center m-2 p-2">
              <a href={`/browse/adjectives/gr`}>
                <div className="text-lg">Adjectives that starts with gr</div>
              </a>
            </Card>
          </div>
          <h2 className="mb-3 mt-5 text-3xl font-semibold">Adjectives that End With</h2>
          <p className="mb-6 text-lg font-normal"> The following lists offer a glimpse into the vocabulary of adjective words each ending with the letter or sequence of letters.</p>
          {adjEndingLinks.map((linkdata) => linkdata)}
          <p className="mb-6 text-lg font-normal">
            Whether you're a writer seeking inspiration or a language
            enthusiast, this page offers an a spectrum of words to describe and enhance your nouns, painting vivid pictures with words that express quality, size, shape, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
