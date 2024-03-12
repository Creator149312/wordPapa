import axios from "axios";
import SentencesFetcher from "./SentencesFetcher";
import RelLinksOnPageTop from "@components/RelLinksonPageBottom";
import { redirect } from "next/navigation";
import AddToMyListsButton from "@components/AddToMyListsButton";
import Link from "next/link";
import { WORDMAP } from "../WORDMAP";

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
  let word = decodeURIComponent(params.word);
  if (word.includes("-")) word = word.replace("-", " ");
  // read route params
  titleStr =
    word.toUpperCase() + " Definition & Meaning with Sentence Examples";
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
// This is previous getDefinitions Function using axios
// async function getDefinitions(word, iscompound) {
//   let endpoint = "";
//   if (iscompound) {
//     endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1`;
//     const res = await axios.get(endpoint);
//     // console.log(res.data);
//     return res.data;
//   } else {
//     endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1&max=1&v=enwiki`;

//     const res = await axios.get(endpoint);
//     //console.log(res.data[0]);
//     return res.data[0];
//   }
// }

async function getDefinitions(word, iscompound) {
  let endpoint = "";
  if (iscompound) {
    endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1`;
    const res = await fetch(endpoint);
    const data = await res.json();
    // console.log(data);
    return data;
  } else {
    endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1&max=1&v=enwiki`;
    const res = await fetch(endpoint);
    const data = await res.json();
    // console.log(data[0]);
    return data[0];
  }
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

/*
 * Display Definitions under different Parts of Speech
 */
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

async function printRelatedWordsSection(word) {
  //if no definitions found
  const relatedWordsData = getRelatedWordsUsingML(word);

  // Wait for the promises to resolve
  const [relatedWords] = await Promise.all([relatedWordsData]);

  if (relatedWords.length === 0 || relatedWords === null) {
    return (
      <>
        <div className="card m-2">
          <h2>We couldn't find any matches for "{word}" in the dictionary.</h2>
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

export default async function WordSpecificPage({ params }) {
  let word = decodeURIComponent(params.word); //in this form there will be - in word in place of spaces
  //let decodedWord = word.split('-').join(' ') //This is the original word typed by User
  let key = word.replace(/[ -]/g, "");
  let decodedWord = WORDMAP[key] ? WORDMAP[key] : word;

  if (word !== decodedWord) {
    redirect("/define/" + decodedWord);
  }

  // console.log("Decoded Word = " + decodedWord);

  if (!word.includes(".ico")) {
    if (!(word.includes("-") || word.includes(" "))) {
      //if word is made up of only 1 set of letters without spaces or hyphes
      // Initiate both requests in parallel
      const definitionsData = getDefinitions(decodedWord, false);
      // console.log("Definitions Data -", definitionsData);

      // Wait for the promises to resolve
      const [definitions] = await Promise.all([definitionsData]);

      if (definitions.hasOwnProperty("defHeadword")) {
        const hw = definitions.defHeadword.toLowerCase();
        if (hw !== word.toLowerCase())
          //check if defHeadword is not same as the typed word
          redirect("/define/" + hw);
      }

      //if we have found definitions for a word
      if (definitions.hasOwnProperty("defs")) {
        return (
          <>
            {await splitDefsbyPOS(definitions.defs)}
            <div className="card m-2">
              <div className="card-header list-heading-container">
                <h1>{decodedWord}</h1>
                {/* <AddToMyListsButton /> */}
              </div>
              <div className="card-body">
                <p className="ipa">
                  IPA:{" "}
                  {definitions.tags[definitions.tags.length - 1].split(":")[1]}
                </p>
                {definitions.hasOwnProperty("defHeadword") && (
                  <p className="normal-text">
                    Root Word:{" "}
                    <Link
                      href={definitions.defHeadword
                        .toLowerCase()
                        .replace(/ /g, "-")}
                    >
                      {definitions.defHeadword}
                    </Link>
                  </p>
                )}
                {/* {console.log(definitions)} */}
                {/* <p>Following are different meanings of {decodedWord} depending on the part of speech:</p> */}
                {await displayDefs()}
              </div>
            </div>
            <SentencesFetcher word={word} />
            <RelLinksOnPageTop word={decodedWord} pos={defTypes} />
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
    } else {
      // Initiate both requests in parallel
      const searchWord = decodedWord.replace(/[ -]/g, "*"); //replace all spaces and hyphes with * for searching all instances and variations

      const wordsData = await getDefinitions(searchWord, true);
      // const wordsDatawithSpaces = await getDefinitions(
      //   decodedWord.replace(" ", "-"),
      //   true
      // );

      // const wordsDatawithSpaces = await getDefinitions(
      //   decodedWord.replace(/-/g, "*"),
      //   true
      // );

      // Merge arrays
      // const mergedArray = wordsData.concat(wordsDatawithSpaces);
      const mergedArray = wordsData;

      // Filter duplicates based on the 'id' property
      // Use Set to remove duplicates based on object properties
      const uniqueObjects = Array.from(
        new Set(mergedArray.map((obj) => JSON.stringify(obj)))
      ).map((str) => JSON.parse(str));
      // Constructing a regex pattern to match the characters in the search word
      const pattern = decodedWord.replace(/[\s-]/g, "").split("").join("\\s*");

      // Creating a regex object with the pattern
      const regex = new RegExp(pattern);
      // const finalMatches = wordsData.filter(
      //   (dataObj) =>
      //     regex.test(dataObj.word.replace(/[\s-]/g, "")) &&
      //     dataObj.hasOwnProperty("defs")
      // );

      const finalMatches = uniqueObjects.filter((dataObj) =>
        regex.test(dataObj.word.replace(/[\s-]/g, ""))
      );

      let AllDataforPage = [];
      let defsForWord = [];
      let sentencesForWord = [];
      let relLinkForWord = [];
      let doIneedCheckingforHyphenated = true;

      if (finalMatches.length > 0) {
        for (let i = 0; i < finalMatches.length; i++) {
          if (finalMatches[i].hasOwnProperty("defs")) {
            await splitDefsbyPOS(finalMatches[i].defs);
            defsForWord.push(
              <>
                <div className="card m-2">
                  <div className="card-header">
                    <h1>{finalMatches[i].word}</h1>
                  </div>
                  <div className="card-body">
                    <p className="ipa">
                      IPA:{" "}
                      {
                        finalMatches[i].tags[
                          finalMatches[i].tags.length - 1
                        ].split(":")[1]
                      }
                    </p>
                    {finalMatches[i].hasOwnProperty("defHeadword") && (
                      <p>
                        Root Word:{" "}
                        <Link
                          href={finalMatches[i].defHeadword
                            .toLowerCase()
                            .replace(/ /g, "-")}
                        >
                          {finalMatches[i].defHeadword}
                        </Link>
                      </p>
                    )}
                    {/* {console.log(definitions)} */}
                    {await displayDefs()}
                  </div>
                </div>
              </>
            );

            if (relLinkForWord.length === 0) {
              relLinkForWord.push(
                <RelLinksOnPageTop
                  word={finalMatches[i].word}
                  pos={defTypes}
                  isCompound={true}
                />
              );
            } //isCompound is true if word is compound and we don't want to display related links for describing words and rhyming words
          }
          sentencesForWord.push(
            <SentencesFetcher word={finalMatches[i].word} />
          );

          if (
            doIneedCheckingforHyphenated &&
            finalMatches[i].word === decodedWord
          )
            doIneedCheckingforHyphenated = false;
        }

        if (doIneedCheckingforHyphenated) {
          // console.log("checking hyphenated...");
          sentencesForWord.push(<SentencesFetcher word={decodedWord} />);
        }

        return (
          <>
            {defsForWord.map((part, index) => (
              <div key={index}>{part}</div>
            ))}
            {sentencesForWord.map((sen) => (
              <div>{sen}</div>
            ))}
            {relLinkForWord.map((rel) => (
              <div>{rel}</div>
            ))}
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
}
