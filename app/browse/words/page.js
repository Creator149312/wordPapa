let titleStr = "";
export async function generateMetadata({ params }, parent) {
    const L = decodeURIComponent(params.letter);
    // read route params
    titleStr = `List of All English Words`;
    const descriptionStr = `Browse the Ultimate list of 150000+ English words in alphabetically sorted order which are commonly used in English language.`;
    return {
        title: titleStr,
        description: descriptionStr,
    };
}

const generateWordsStartingLinks = async () => {
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

const generateWordsLinks = async () => {
    let adjJsx = [];

    for (let i = 0; i < 26; i += 2) {
        let firstChar = String.fromCharCode(97 + i);
        let secondChar = String.fromCharCode(97 + i + 1);
        adjJsx.push(
            <div className="row" key={i}>
                <div className="card col-6 text-center">
                    <a href={`/browse/words/${firstChar}`}>
                        <div className="medium-text">Letter {firstChar} Words</div>
                    </a>
                </div>
                <div className="card col-6 text-center">
                    <a href={`/browse/words/${secondChar}`}>
                        <div className="medium-text">Letter {secondChar} Words</div>
                    </a>
                </div>
            </div>
        );
    }

    return adjJsx;
};

const generateWordsEndingLinks = async () => {
    let adjJsx = [];
    let endingPhrases = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

    for (let i = 0; i < endingPhrases.length; i += 2) {
        let firstChar = endingPhrases[i];
        let secondChar = endingPhrases[i + 1];
        adjJsx.push(
            <div className="row" key={i}>
                <div className="card col-6 text-center">
                    <a href={`/browse/words/end/${firstChar}`}>
                        <div className="medium-text">Words Ending with {firstChar}</div>
                    </a>
                </div>
                <div className="card col-6 text-center">
                    <a href={`/browse/words/end/${secondChar}`}>
                        <div className="medium-text">Words Ending with {secondChar}</div>
                    </a>
                </div>
            </div>
        );
    }

    return adjJsx;
};

const Page = async () => {
    let wordsLinks = await generateWordsLinks();
    let wordsEndingLinks = await generateWordsEndingLinks();

    return (
        <div>
            <div className="row">
                {/* Left side: 9-column scrollable content */}
                <div className="m-2 p-3">
                    <h1>List of All English Words</h1>
                    <p>
                        We are here to delve into the vast and ever-evolving world of English vocabulary. You'll explore a comprehensive list of words, encompassing the richness and diversity of the English language.
                    </p>
                    <p>This list is a treasure trove of terms which extends far beyond frequently used words, venturing into the realms of specialized terminology, rare gems, and obscure vocabulary, related to specific <a href="https://www.englishbix.com/english-vocabulary-list-for-kids/">English Vocabulary Topics</a>.</p>
                    <p>
                        There are approximately 150,000 uncommon and common words in English, used as different parts of speech.
                    </p>
                    <p>
                        You can use this page to find new words and learn more about the ones you have never heard before. So, dive in, embark on your personal word-discovery adventure, and let your vocabulary flourish!</p>
                    <h2>Words that Start With </h2>
                    <p> We've organized them into sorted lists of words from a to z, each starting with a specific letter or group of letters.</p>
                    {wordsLinks.map((linkdata) => linkdata)}
                    <h2>Words that End With</h2>
                    <p> The following lists offer a glimpse into the vocabulary of words each ending with the letter or sequence of letters.</p>
                    {wordsEndingLinks.map((linkdata) => linkdata)}
                    <p>Whether you're a word enthusiast, a student seeking to expand your knowledge, or a writer looking for some fancy words.
                    </p><p> <strong>Please note:</strong> It's important to acknowledge that compiling an exhaustive list of all English words is a near-impossible feat due to the language's constant evolution and the inclusion of slang, technical terms, and regional variations. This list strives to be as comprehensive as possible while acknowledging its limitations.
                    </p>
                </div>
            </div>
        </div >
    );
};

export default Page;
