import axios from "axios";
import SentencesFetcher from "./SentencesFetcher";
import RelLinksOnPageTop from "@components/RelLinksonPageBottom";

let titleStr = "";

let defTypes = { n: [], v: [], adj: [], adv: [], u: [] };

const types = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  u: "Other Meanings",
};

export async function generateMetadata({ params }, parent) {
  const { word } = params;
  // read route params
  titleStr =
    word.charAt(0).toUpperCase() +
    word.slice(1) +
    " Definition and Sentence Examples";
  const descriptionStr =
    "Find what does " +
    params.word +
    " mean and Have a look at list of sentence examples using " +
    params.word +
    ".";
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

/*
* spellcor - stands for spell correction
* defs - stands for all the definition arrays that are found for a specific word and at the very start it defines its part of speech.
* 
* returned Data for a query will have the following json data
[{
"word":"unbox",
"score":2147483647,
"tags":["query","spellcor:inbox"],
"defs":["v\t(transitive) To remove from a box. ","v\t(transitive, computing) To retrieve (a value of a primitive type) from the object in which it is boxed. "]
"defHeadword" : "xxxxx"
}]
*****************
* returned data in every case
* [{"word":"kjxluaydoaiu","score":2147483647,"tags":["query"]}]
*/
async function getDefinitions(word) {
  let endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1&max=1`;
  const res = await axios.get(endpoint);
  console.log(res.data[0]);
  return res.data[0];
}

//use to split definitions by part of speech and return the Lists segreated
async function splitDefsbyPOS(defs) {
  defTypes = { n: [], v: [], adj: [], adv: [], u: [] };

  defs.map((def) => {
    let parts = def.split("\t");
    let pos = parts[0].toLowerCase();

    defTypes[pos].push(parts[1]);
  });
}

async function displayDefs() {
  return (
    <div>
      {Object.keys(defTypes).map(
        (key) =>
          defTypes[key].length > 0 && (
            <div key={key}>
              <h3>{types[key]}</h3>
              <ul className="m-2 p-2">
                {defTypes[key].map((def, index) => (
                  <li key={index}>{def}</li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
}

async function getRelatedWordsUsingML(word) {
  const endpoint = `https://api.datamuse.com/words?ml=${word}`;
  const res = await axios.get(endpoint);
  // console.log("Endpoint for ML: " + endpoint);
  // console.log(res.data);
  return res.data;
}

// async function getSynonymsUsingSYN(word){
//   const endpoint = `https://api.datamuse.com/words?rel_syn=${word}`;
//   const res = await axios.get(endpoint);
//   console.log("Endpoint for Synonyms: " + endpoint);
//   console.log(res.data);
//   return res.data === null ? [] : res.data;
// }

export default async function WordSpecificPage({ params }) {
  let word = params.word; //in this form there will be - in word in place of spaces
  let decodedWord = word.split('-').join(' '); //This is the original word typed by User

  if (!word.includes(".ico")) {
    // Initiate both requests in parallel
    const definitionsData = getDefinitions(decodedWord);
    // const wordsLike = getSynonymsUsingSYN(word);

    // Wait for the promises to resolve
    const [definitions] = await Promise.all([definitionsData]);

    //if we have found definitions for a word
    if (definitions.hasOwnProperty("defs")) {
      return (
        <>
          {await splitDefsbyPOS(definitions.defs)}
          <div className="card m-2">
            <div className="card-header">
            <h1>{decodedWord}</h1>
            </div>
            <div className="card-body">
            <p className="ipa">IPA: {definitions.tags[2].split(":")[1]}</p>
            {/* {console.log(definitions)} */}
            {await displayDefs()}
            </div>
          </div>
          <SentencesFetcher word={word} />
          <RelLinksOnPageTop word={decodedWord} pos={defTypes}/>
          {/* <div className="card m-2">
              <h1>Words like "{word}"</h1>
              {console.log(wordsLike)}
              <ul className="m-2">
                {wordsLike.map((data, index) => (
                  <li key={index}>{data.word}</li>
                ))}
              </ul>
            </div> */}
        </>
      );
    } else {
      //if no definitions found
      const relatedWordsData = getRelatedWordsUsingML(word);

      // Wait for the promises to resolve
      const [relatedWords] = await Promise.all([relatedWordsData]);

      if (relatedWords.length === 0 || relatedWords === null) {
        return (
          <>
            <div className="card m-2">
              <h2>
                We couldn't find any matches for "{word}" in the dictionary.
              </h2>
            </div>
          </>
        );
      }

      return (
        <>
          <div className="card m-2">
            <h1>Words like "{word}"</h1>
            {/* {console.log("Related Words" + relatedWords + " is this")} */}
            <ul className="m-2">
              {relatedWords.map((data, index) => (
                <li key={index}>{data.word}</li>
              ))}
            </ul>
          </div>
        </>
      );
    }
  }
}
