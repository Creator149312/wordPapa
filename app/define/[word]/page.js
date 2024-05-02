import SentencesFetcher from "./SentencesFetcher";
import RelLinksOnPageTop from "@components/RelLinksonPageBottom";
import { redirect } from "next/navigation";
import AddToMyListsButton from "@components/AddToMyListsButton";
import Link from "next/link";
import { WORDMAP } from "../WORDMAP";
import { Card, CardContent, CardHeader } from "@components/ui/card";

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

async function getDefinitions(word, iscompound) {
  const timeout = 5000; // Set timeout to 5 second

  let endpoint = "";
  if (iscompound) {
    try {
      const compoundController = new AbortController();
      const compoundtimeoutId = setTimeout(() => {
        compoundController.abort();
      }, timeout);

      endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1`;
      const res = await fetch(endpoint, { signal: compoundController.signal });

      clearTimeout(compoundtimeoutId); // Clear the timeout since the request completed

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      //console.log(data);
      return data;
    } catch (error) {
      // console.log("Error occured in Compound trial");
      return [{
        word: word,
        score: 11111111,
        tags: ['query', 'pron:  ', 'ipa_pron: '],
        defs: []
      }];
    }
  } else {
    try {
      const simpleController = new AbortController();
      const simpletimeoutId = setTimeout(() => {
        simpleController.abort();
      }, timeout);

      endpoint = `https://api.datamuse.com/words?sp=${word}&qe=sp&md=dr&ipa=1&max=1&v=enwiki`;
      const res = await fetch(endpoint, { signal: simpleController.signal });

      clearTimeout(simpletimeoutId); // Clear the timeout since the request completed

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const data = await res.json();
      //console.log(data[0]);
      return data[0];
    } catch (error) {
      // console.log("Error occured in simple trial");

      //we are not adding defs property to return object
      return {
        word: word,
        score: 11111111,
        tags: ['query', 'pron:  ', 'ipa_pron: ']
      };
    }
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
    <>
      {Object.keys(defTypes).map(
        (key) =>
          defTypes[key].length > 0 && (
            <div key={key}>
              <h3 className="mb-2 font-bold text-xl">{types[key]}</h3>
              <ul className="list-disc m-2 p-2">
                {defTypes[key].map((def, index) => (
                  <li className="p-0.5" key={index}>{def}</li>
                ))}
              </ul>
            </div>
          )
      )}
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
            <Card className="m-2">
              <CardHeader className="list-heading-container">
                <h1 className="text-4xl font-extrabold">{decodedWord}</h1>
                {/* <AddToMyListsButton /> */}
              </CardHeader>
              <CardContent className="card-body">
                <p className="mb-6 text-lg font-normal">
                  <strong>IPA:</strong>{" "}
                  {definitions.tags[definitions.tags.length - 1].split(":")[1]}
                </p>
                {definitions.hasOwnProperty("defHeadword") && (
                  <p className="mb-6 text-lg font-normal">
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
                {await displayDefs()}
              </CardContent>
            </Card>
            <SentencesFetcher word={word} />
            <RelLinksOnPageTop word={decodedWord} pos={defTypes} />
          </>
        );
      } else {
        return (<>
          <Card className="m-2">
            <CardHeader>
              <h1 className="text-4xl font-extrabold">{word}</h1>
            </CardHeader>
            <CardContent className="card-body">
              <p className="mb-6 text-lg font-normal">
                <strong>IPA:</strong>{" "}
              </p>
              <p className="mb-6 text-lg font-normal"> We couldn't find any matches for "{word}" in the dictionary. Please check your Word.</p>
            </CardContent>
          </Card>
        </>);
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
      // console.log("Final Matches length = ", finalMatches.length);
      if (finalMatches.length > 0) {
        for (let i = 0; i < finalMatches.length; i++) {
          if (finalMatches[i].hasOwnProperty("defs")) {
            await splitDefsbyPOS(finalMatches[i].defs);
            defsForWord.push(
              <>
                <Card className="card m-2">
                  <CardHeader >
                    <h1 className="text-4xl font-extrabold">{finalMatches[i].word}</h1>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-lg font-normal">
                      <strong>IPA:</strong>{" "}
                      {
                        finalMatches[i].tags[
                          finalMatches[i].tags.length - 1
                        ].split(":")[1]
                      }
                    </p>
                    {finalMatches[i].hasOwnProperty("defHeadword") && (
                      <p className="mb-6 text-lg font-normal">
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
                  </CardContent>
                </Card>
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
        //  getDefinePageTemplate(decodedWord);
        return (<>
          <Card className="card m-2">
            <CardHeader className="card-header">
              <h1 className="text-4xl font-extrabold">{word}</h1>
            </CardHeader>
            <CardContent className="card-body">
              <p className="mb-6 text-lg font-normal">
                <strong>IPA:</strong>{" "}
              </p>
              <p className="mb-6 text-lg font-normal"> We couldn't find any matches for "{word}" in the dictionary. Please check your Word.</p>
            </CardContent>
          </Card>
        </>);
      }
    }
  }
}
