let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Verb Dictionary: List of All Verbs in English`;
  const descriptionStr = `Browse Verb Dictionary of 11000+ verbs which are commonly used in English language to describe positve and negative actions of a person, place or thing.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const generateVerbLinks = async () => {
  let nounsJsx = [];

  for (let i = 0; i < 26; i += 2) {
    let firstChar = String.fromCharCode(97 + i);
    let secondChar = String.fromCharCode(97 + i + 1);
    nounsJsx.push(
      <div className="row" key={i}>
        <div className="card col-6 text-center">
          <a href={`/browse/verbs/${firstChar}`}>
            <div className="medium-text">Verbs with Letter {firstChar}</div>
          </a>
        </div>
        <div className="card col-6 text-center">
          <a href={`/browse/verbs/${secondChar}`}>
            <div className="medium-text">Verbs with Letter {secondChar}</div>
          </a>
        </div>
      </div>
    );
  }

  return nounsJsx;
};

const generateVerbEndingLinks = async () => {
  let nounsJsx = [];
  let endingPhrases = ["ed", "ch", "sh", "e", "s", "y", "x", "o", "z", "ee", "d", "en", "es", "ie", "ss", "ch", "ing", "ir"];

  for (let i = 0; i < endingPhrases.length; i += 2) {
    let firstChar = endingPhrases[i];
    let secondChar = endingPhrases[i + 1];
    nounsJsx.push(
      <div className="row" key={i}>
        <div className="card col-6 text-center">
          <a href={`/browse/verbs/end/${firstChar}`}>
            <div className="medium-text">Verbs Ending with {firstChar}</div>
          </a>
        </div>
        <div className="card col-6 text-center">
          <a href={`/browse/verbs/end/${secondChar}`}>
            <div className="medium-text">Verbs Ending with {secondChar}</div>
          </a>
        </div>
      </div>
    );
  }

  return nounsJsx;
};

const Page = async () => {
  let verbLinks = await generateVerbLinks();
  let verbEndingLinks = await generateVerbEndingLinks();

  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <h1>Verb Dictionary: List of All Verbs in English</h1>
          <p>
            Welcome to Verb Dictionary where you can find all the action words in
            English. Here, you'll discover a rich collection of words to articulate various actions, experiences, and sentiments.
          </p>
          <p>
            It helps people find verbs for talking about things they do, feel, and think.
            From verbs that denote positive actions like helping and winning, to words that
            help you convey negative actions, like hurting and struggling, you'll find them all
            here to breathe life into your sentences.
          </p>
          <p>
            There are around 11,000 verbs in English language, available for describing actions.
          </p>
          <h2>Verbs that Begin With</h2>
          <p>
            We've organized them into alphabetically sorted lists of verbs, each starting with a specific letter or group of letters.</p>
          {verbLinks.map((linkdata) => linkdata)}
          <div className="row">
            <div className="card col-6 text-center">
              <a href={`/browse/verbs/re`}>
                <div className="medium-text">Verbs Starting with re</div>
              </a>
            </div>
          </div>
          <h2>Verbs that End With</h2>
          <p>The following lists offer a glimpse into the vocabulary of verbs that end with the letter or sequence of letters.</p>
          {verbEndingLinks.map((linkdata) => linkdata)}
          <p>
            With this Verb dictionary, people can find the wealth of verbs to express actions, states of being, and occurrences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
