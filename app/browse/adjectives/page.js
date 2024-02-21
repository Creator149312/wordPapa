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
      <div className="row" key={i}>
        <div className="card col-6 text-center">
          <a href={`/browse/adjectives/${firstChar}`}>
            <div className="medium-text">Letter {firstChar} Adjectives</div>
          </a>
        </div>
        <div className="card col-6 text-center">
          <a href={`/browse/adjectives/${secondChar}`}>
            <div className="medium-text">Letter {secondChar} Adjectives</div>
          </a>
        </div>
      </div>
    );
  }

  return adjJsx;
};

const Page = async () => {
  let adjLinks = await generateAdjectiveLinks();

  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <h1>Adjective Dictionary: List of All Adjectives in English</h1>
          <p>
            Welcome to the adjectives dictionary page where you can find all the describing words in
            English. Here, you'll discover a rich vocabulary of descriptive
            words that capture a myriad of sentiments and characteristics.
          </p>
          <p>
            From words that show how things look, feel, or act, to words that
            help you express your thoughts and feelings, you'll find them all
            here.
          </p>
          <p>
            There are approximately 21,000 uncommon and common adjectives in English, used to describe nouns. We've organized
            them into sorted lists of adjectives from a to z, each starting with a specific letter.
          </p>
          {adjLinks.map((linkdata) => linkdata)}
          <p>
            Whether you're a writer seeking inspiration or a language
            enthusiast, this page offers an exploration of the diverse and
            nuanced world of adjectives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
