import DataFilterDisplay from "@utils/DataFilterDisplay";
import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import { CardContent, CardHeader } from "@components/ui/card";
import apiConfig from "@utils/apiUrlConfig";
import rhymingWordsSET from "../rhyming-wordsSET"

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
  const toIndex = rhymingWordsSET.has(word); //if word is present in the syllableWordsArray used to generate sitemap we index it otherwise we do not index
 
  // read route params
  titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore list of common words that rhyme with " +
    params.word +
    " to use in creative writing and poetry.";
  return {
    title: titleStr,
    description: descriptionStr,
    robots: {
      index: toIndex,
    },
  };
}

let rhymingWords = [];
let similarSoundingWords = [];

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word); //this one gives the best results

  const isNotCompound = word.split(" ").length === 1;
  let isAIUsed = false;
  //redirect to /rhyming-words page when that work is causing some 404 or soft 404 errors in google search console
  // if (soft404words.includes(word)) {
  //   redirect("/rhyming-words");
  // }

  titleStr =
    "Rhyming Words and Phrases for " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  //const word = params.word.split('-').join(' ');

  if (isNotCompound) {
    try {
      rhymingWords = [];
      similarSoundingWords = [];
      const timeout = 5000; // Set timeout to 5 seconds
      //start of code to get rhyming words for a word
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      const endpoint = `https://api.datamuse.com/words?rel_rhy=${word}&max=100`;

      const res = await fetch(endpoint, { signal: controller.signal });

      clearTimeout(timeoutId); // Clear the timeout since the request completed

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      rhymingWords = data.map((item) => item.word);
      //End of code to get rhyming words for a word

      if (rhymingWords.length < 4) {
        isAIUsed = true;
        await newFunction();
      }
      
      //if now rhyming words are found we display similar sounding words for user
      if (rhymingWords.length <= 0) {
        const SScontroller = new AbortController();
        const SStimeoutId = setTimeout(() => {
          SScontroller.abort();
        }, timeout);

        const SSendpoint = `https://api.datamuse.com/words?sl=${word}&max=50`;

        const SSres = await fetch(SSendpoint, { signal: SScontroller.signal });

        clearTimeout(SStimeoutId); // Clear the timeout since the request completed
        if (!SSres.ok) {
          throw new Error(`API request failed with status ${SSres.status}`);
        }
        const SSdata = await SSres.json();
        similarSoundingWords = SSdata.map((item) => item.word);
        //End of code to get the similar sounding words for a word
      }
    } catch (error) {
      rhymingWords = rhymingWords.length === 0 ? [] : rhymingWords;
      similarSoundingWords =
        similarSoundingWords.length === 0 ? [] : similarSoundingWords;
    }
  } else {
    rhymingWords = [];
    isAIUsed = true;
    await newFunction();
  }

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of {rhymingWords.length} words and phrases that
          rhyme with {word}:
        </p>
        <DataFilterDisplay words={rhymingWords} />
        <p className="mb-6 text-lg font-normal">
          With all these rhyming words at your disposal, you'll surely find the
          perfect word to match with {word} in your writing.
        </p>
        {similarSoundingWords.length > 0 && (
          <>
            <h2 className="text-3xl mb-6 font-bold">
              Words that Sound Similar to {word}
            </h2>
            <p className="mb-6 text-lg font-normal">
              If you are not fully satisfied with rhyming words, you can pick
              from the words that sound similar to {word}.
            </p>
            <DataFilterDisplay words={similarSoundingWords} />
          </>
        )}
        {rhymingWords.length > 0 && (isNotCompound && !isAIUsed) && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );

  async function newFunction() {
    try {
      const response = await fetch(`${apiConfig.apiUrl}/generateWords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryType: "rhymes", prompt: word }),
      });

      const data = await response.json();
      // console.log("Data = ", data);
      let wordForProcessing = null;
      if (data.words[0].includes("\n")) {
        wordForProcessing = data.words[0].split("\n");
      } else {
        wordForProcessing = data.words;
      }

      // console.log("Words for Processing = ", wordForProcessing);
     
      wordForProcessing.map((str) =>
        rhymingWords.push(
          str
            .replace(/^\W+|\W+$/, "")
            .replace(/^\d+\.\s*/, "")
            .trim()
        )
      );

      //   rhymingWords = rhymingWords.map(item => item.replace(/^\d+\.\s*/, ''))
      // console.log("Data Words = ", rhymingWords);
    } catch (error) {
      // console.error("Error fetching words:", error);
      rhymingWords = rhymingWords.length === 0 ? [] : rhymingWords;
    }
  }
}
