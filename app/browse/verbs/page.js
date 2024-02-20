let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  // read route params
  titleStr = `A to Z Complete List of Verbs in English`;
  const descriptionStr = `Browse all 11000+ verbs which are commonly used in English language to describe actions of a person, place or thing.`;
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
      <div className="row" key={i}>
        <div className="card col-6 text-center">
          <a href={`/browse/nouns/${firstChar}`}>
            <div className="medium-text">Nouns beginning with {firstChar}</div>
          </a>
        </div>
        <div className="card col-6 text-center">
          <a href={`/browse/nouns/${secondChar}`}>
            <div className="medium-text">Nouns beginning with {secondChar}</div>
          </a>
        </div>
      </div>
    );
  }

  return nounsJsx;
};

const Page = async () => {
  let nounsLinks = await generateNounLinks();

  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <h1>The Complete List of Nouns in English</h1><p>
          Welcome to "The Complete List of Nouns in English," your definitive
          resource for exploring the vast array of words that name people,
          places, things, and ideas! Dive into this comprehensive catalog, where
          you'll find nouns spanning every aspect of human experience. From
          common objects like "table" and "chair" to abstract concepts like
          "love" and "justice," this list encompasses the richness and diversity
          of the English language. Whether you're a student expanding your
          vocabulary, a writer seeking inspiration, or simply curious about
          language, this exhaustive compilation is your gateway to understanding
          the fundamental building blocks of communication. Embark on a journey
          through the endless possibilities of nouns and discover the beauty of
          linguistic expression.</p>
          <p>
            Welcome to the page where you can find all the describing words in
            English. Here, you'll discover a rich collection of descriptive
            words that capture a myriad of sentiments and characteristics.
          </p>
          <p>
            From words that show how things look, feel, or act, to words that
            help you express your thoughts and feelings, you'll find them all
            here.
          </p>
          <p>
            There are around 21,000 frequently used adjective words in the
            English language, available for describing nouns. We've organized
            them into lists of adjectives, each starting with a specific letter.
          </p>
          {nounsLinks.map((linkdata) => linkdata)}
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
