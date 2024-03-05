import commonLinks from "@utils/commonLinks";

const Page = () => {
  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <div>
            <div>
              <div className="p-3 text-center mb-2">
                <h1 className="mb-3">
                  <strong>WordPapa</strong>
                  <sub className="p-1"> by</sub>
                  <sub className="p-1">EnglishBix</sub>
                </h1>
                <h3>The free, fun, and effective way to master a word!</h3>
                <p>
                  An enriching vocabulary hub, where language mastery begins.
                  Dive into a world of words and their nuances.
                </p>
                <p>
                  Our comprehensive dictionary is your key to unlocking the
                  depth of the English language. Explore meanings, discover
                  synonyms, unravel antonyms, and delve into the intricacies of
                  adjectives.
                </p>
              </div>
              <p className="text-center large-text">I am looking for....</p>
              <div className="row">
                <div className="card col-6 text-center" href={commonLinks.definition}>
                  <div className="m-2 p-2">
                <p>
                    A dictionary to find new words along with their definitions and examples
                    </p>
                  </div>
                  <button className="p-2 custom-button medium-text">
                 <a href="/define" className="medium-text font-white" > Word Dictionary
                 </a> </button>
                </div>
                <div className="card col-6 text-center" >
                  <div className="m-2 p-2">
                  <p>
                  Tool to find Adjective words to describe a Noun or Object  </p>
                  </div>
                  <button className="custom-button medium-text">
                     <a href="/adjectives" className="medium-text font-white">Adjectives Finder
                     </a>  </button>
                  </div>
              </div>
              <div className="row">
              <div className="card col-6 text-center" >
                  <div className="m-2">
                  <p>
                    Synonyms and antonyms of a word that I know
                  </p>
                  </div>
                    <button className="custom-button p-2">
                      <a href="/thesaurus"  className="medium-text font-white">Thesaurus</a>
                    </button>
                </div>
                <div className="card col-6 text-center">
                  <div className="m-2">
                  <p>
                  rhyming words that rhyme with a word that I know</p>
                  </div>
                    <button className="custom-button p-2">
                      <a href="/rhyming-words"  className="medium-text font-white"> Rhyming Dictionary </a>
                    </button>
                </div>
              </div>
              <div className="row">
              <div className="card col-6 text-center">
                  <div className="m-2 p-2">
                  <p>
                    a tool to find number of syllables in a given word
                  </p>
                  </div>
                  <button className="custom-button p-2">
                    <a href="/syllables" className="medium-text font-white">
                      Syllable Counter
                    </a>
                  </button>
                </div>
                <div className="card col-6 text-center">
                  <div className="m-2 p-2">
                  <p>
                  a tool to generate all possible words with given letters</p>
                  </div>
                  <button className="p-2 custom-button">
                    <a href="/word-finder" className="medium-text font-white">
                      Word Finder
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
