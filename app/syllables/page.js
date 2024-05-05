import MostSearchedWordsList from "@components/MostSearchedWordsList";
import SyllableFinder from "./SyllableFinder";
import commonLinks from "@utils/commonLinks";

export const metadata = {
  title: "Syllable Counter: Check Number of Syllables in Word",
  description:
    "Our Syllable Counter is a tool to count number of syllables in a word or sentence, by identifying vowel sounds and syllable boundaries within a text.",
};

const mostSearchedWordsList = [
  "very",
  "music",
  "reading",
  "family",
  "teacher",
  "telemarketing",
  "ladybug"
];

function SyllableCounterPage() {
  return (
    <div>
      <div className="row">
        <div>
          <div>
            <div>
              <div className="m-3 p-3">
                <h1 className="mb-3 text-4xl font-bold">
                  Syllable Counter - Count Number of Syllables in Word
                </h1>
                <SyllableFinder />
                <p className="mb-2">
                  <strong>Syllable Counter</strong> is a an online tool designed
                  to determine the count of syllables in a word or sentence.
                  Counting syllables is useful for various purposes such as
                  linguistic analysis, poetry writing, or English language
                  learning.
                </p>
                <AdsUnit slot='7782807936'/> 
                <p className="mb-2">
                  Our Syllable checker typically work by analyzing the phonetic
                  structure of words. It takes into account factors such as
                  vowel combinations, consonant clusters, and stress patterns to
                  accurately determine syllable counts.
                </p>
                <p className="mb-2">
                  You simply input the word or sentence you want to analyze, and
                  the tool will provide the corresponding syllable count. Use it
                  you can quickly assess the syllabic structure of text.
                </p>
                <p className="mb-2">
                  You can use it to create rhythmic and structured compositions,
                  such as haikus, sonnets, and limericks.
                </p>
                <AdsUnit slot='7782807936'/> 
                <p className="mb-2">
                  Teachers and educators use syllable counters as educational
                  tools to teach <a href="https://www.englishbix.com/types-of-syllables-in-english/">types of syllables</a>, phonetics, spelling, and
                  word recognition to students.
                </p>
                <p className="mb-2">
                  For future updates, We are working to offer additional
                  features such as pronunciation guides or syllable stress
                  indicators to further aid in language comprehension.
                </p>
                <div className="m-2 p-2">
                  <MostSearchedWordsList
                    wordList={mostSearchedWordsList}
                    preText={"count syllables in "}
                    postText={""}
                    slug={commonLinks.syllables}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyllableCounterPage;
