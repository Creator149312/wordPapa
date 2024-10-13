import SentencesFetcher from "./SentencesFetcher";
import RelLinksOnPageTop from "@components/RelLinksonPageBottom";
import { permanentRedirect, redirect } from "next/navigation";
import AddToMyListsButton from "@components/AddToMyListsButton";
import Link from "next/link";
import { WORDMAP } from "../../WORDMAP";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import soft404words from "./../../soft-404words";
import AdsUnit from "@components/AdsUnit";
import apiConfig from "@utils/apiUrlConfig";

let titleStr = "";

let defTypes = { n: [], v: [], adj: [], adv: [], u: [] };

const types = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  u: "Other Meanings",
};

let siteURL =
  process.env.NODE_ENV === "production"
    ? "https://words.englishbix.com"
    : "http://localhost:3000";

export async function generateMetadata({ params }, parent) {
  let word = decodeURIComponent(params.word);
  let slug = decodeURIComponent(params.word);

  let canonical = `${siteURL}/define/${word}`;
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

  if (soft404words.includes(slug)) {
    canonical = "https://words.englishbix.com/define";
  }

  let key = slug.replace(/[ -]/g, "");
  let decodedWord = WORDMAP[key] ? WORDMAP[key] : slug;

  if (slug !== decodedWord) {
    //using permanentRedirect for 301 redirect instead of temporary redirect
    //redirect("/define/" + decodedWord);
    canonical = `https://words.englishbix.com/define/${decodedWord}`;
  }

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: canonical,
    },
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
      return [
        {
          word: word,
          score: 11111111,
          tags: ["query", "pron:  ", "ipa_pron: "],
          defs: [],
        },
      ];
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
        tags: ["query", "pron:  ", "ipa_pron: "],
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
              <h3 className="mb-2 font-bold text-2xl">{types[key]}</h3>
              <ul className="list-disc m-2 text-lg p-2">
                {defTypes[key].map((def, index) => (
                  <li className="p-0.5" key={index}>
                    {def}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </>
  );
}

/*
 * Get all the similar sounding words which user has searched
 */
async function getRelatedWordsUsingML(word) {
  try {
    const timeout = 5000; // Set timeout to 5 second
    const Controller = new AbortController();
    const timeoutId = setTimeout(() => {
      Controller.abort();
    }, timeout);

    const endpoint = `https://api.datamuse.com/words?sl=${word}&max=30`;
    const res = await fetch(endpoint, { signal: Controller.signal });

    clearTimeout(timeoutId); // Clear the timeout since the request completed

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export default async function WordSpecificPage({ params }) {
  let word = decodeURIComponent(params.word); //in this form there will be - in word in place of spaces

  // if this word is causing soft 404 or other google search console errors
  // we'll redirect it to the /define to avoid future errors
  if (soft404words.includes(word)) {
    //again using temporary redirect because permanentRedirect was causing redirect errors in search console
    redirect("/define");
    // permanentRedirect("/define");
  }

  //let decodedWord = word.split('-').join(' ') //This is the original word typed by User
  let key = word.replace(/[ -]/g, "");
  let decodedWord = WORDMAP[key] ? WORDMAP[key] : word;

  if (word !== decodedWord) {
    //again using temporary redirect because permanentRedirect was causing redirect errors in search console
    redirect("/define/" + decodedWord); // commented this on 12th Aug
    //using permanentRedirect for 301 redirect instead of temporary redirect
    // permanentRedirect("/define/" + decodedWord);
  }

  if (!word.includes(".ico")) {
    if (!(decodedWord.includes("-") || decodedWord.includes(" "))) {
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
                <h1 className="text-5xl font-extrabold">{decodedWord}</h1>
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
            <AdsUnit slotID={3722270586} />
            <SentencesFetcher word={word} />
            <RelLinksOnPageTop word={decodedWord} pos={defTypes} />
          </>
        );
      } else {
        let sentencesByAI = null;
        console.log("inside AI Set for Definition");
        try {
          const response = await fetch(
            `${apiConfig.apiUrl}/generateSentences`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ word: word }),
            }
          );

          const data = await response.json();
          console.log("Data = ", data.definitionAndSentences);

          let wordForProcessing = null;
          if (data.definitionAndSentences.includes("\n")) {
            wordForProcessing = data.definitionAndSentences.split("\n");
          } else {
            wordForProcessing = data.definitionAndSentences;
          }

          console.log("Words for Processing = ", wordForProcessing);
          sentencesByAI = wordForProcessing.map((str) =>
            str
              .replace(/^\W+|\W+$/, "")
              .replace(/^\d+\.\s*/, "")
              .trim()
          );

          console.log("Data Words = ", sentencesByAI);
        } catch (error) {
          console.error("Error fetching words:", error);
        }

        if (sentencesByAI.length > 0) {
          return (
            <>
              <Card className="m-2">
                <CardHeader className="list-heading-container">
                  <h1 className="text-5xl font-extrabold">{decodedWord}</h1>
                  {/* <AddToMyListsButton /> */}
                </CardHeader>
                <CardContent className="card-body">
                  <p className=" m-2 text-lg p-2">{sentencesByAI[0]}</p>
                </CardContent>
              </Card>
              <AdsUnit slotID={3722270586} />
              <Card className="m-2" id="examples">
                <CardHeader>
                  <h1 className="text-4xl font-extrabold">
                    Examples of "{word}" in Sentences
                  </h1>
                </CardHeader>
                <CardContent>
                  <ul className="m-2 p-2 text-lg list-disc">
                    {sentencesByAI.map(
                      (sent, index) =>
                        sent &&
                        index >= 1 && (
                          <li className="p-0.5" key={index}>
                            {sent}
                          </li>
                        )
                    )}
                  </ul>
                </CardContent>
              </Card>
              <RelLinksOnPageTop word={decodedWord} pos={defTypes} />
            </>
          );
        }
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
                  <CardHeader>
                    <h1 className="text-4xl font-extrabold">
                      {finalMatches[i].word}
                    </h1>
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
            {/* 
            //Add it in future 
            <AdsUnit slotID={3722270586} /> */}
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

        return (
          <>
            <Card className="m-2">
              <CardHeader>
                <h1 className="text-4xl font-extrabold">{word}</h1>
              </CardHeader>
              <CardContent className="card-body">
                <p className="mb-6 text-lg font-normal">
                  Looks like we couldn't find {word} word in our dictionary yet.{" "}
                </p>

                <p className="m-2 text-lg font-normal">
                  Don't worry, new words are added all the time! Here are some
                  options you can try:{" "}
                </p>

                <ul className="list-disc m-2">
                  <li className="p-0.5 list-item">
                    Wordstruck? Don't fret! Search for a words similar to {word}{" "}
                    in our{" "}
                    <a href="/thesaurus" className="text-[#75c32c] p-0.5">
                      thesaurus
                    </a>
                    .
                  </li>
                  <li className="p-0.5 list-item">
                    Feeling fancy? Browse our{" "}
                    <a
                      href="/browse/adjectives"
                      className="text-[#75c32c] p-0.5"
                    >
                      adjective dictionary
                    </a>{" "}
                    to find words that describe popular nouns, then craft
                    powerful verbs using our{" "}
                    <a href="/browse/verbs" className="text-[#75c32c] p-0.5">
                      verb dictionary
                    </a>{" "}
                    to bring your writing to life!
                  </li>
                </ul>
                {relatedWords.length > 0 && (
                  <div className="mb-2">
                    <h2 className="text-3xl font-bold">
                      Words Close to "{word}"
                    </h2>
                    {/* {console.log("Related Words" + relatedWords + " is this")} */}
                    <ul className="list-disc m-2">
                      {relatedWords.map((data, index) => (
                        <li key={index} className="p-0.5">
                          {data.word}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="m-2 pt-2 text-lg font-normal">
                  While you're here, check out some of our most popular words:{" "}
                </p>
                <ul className="list-disc m-2 mb-6">
                  <li>
                    <a
                      href="/define/ephemeral"
                      className="text-[#75c32c] p-0.5"
                    >
                      Ephemeral
                    </a>
                  </li>
                  <li>
                    <a
                      href="/define/pulchritudinous"
                      className="text-[#75c32c] p-0.5"
                    >
                      Pulchritudinous{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/define/cacophony"
                      className="text-[#75c32c] p-0.5"
                    >
                      Cacophony{" "}
                    </a>
                  </li>
                  <li>
                    <a href="/define/gazump" className="text-[#75c32c] p-0.5">
                      Gazump{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/define/facetious"
                      className="text-[#75c32c] p-0.5"
                    >
                      Facetious{" "}
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
    }
  }
}
