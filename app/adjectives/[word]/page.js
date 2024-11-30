import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import adjectiveWordsSET from "../adjectivewordsSET";
import { CardContent, CardHeader } from "@components/ui/card";
import apiConfig from "@utils/apiUrlConfig";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
  const toIndex = adjectiveWordsSET.has(word); //if word is present in the syllableWordsArray used to generate sitemap we index it otherwise we do not index

  // read route params
  titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));
  const descriptionStr =
    "Explore list of commonly used adjective words for describing " +
    params.word +
    " in writing.";
  return {
    title: titleStr,
    description: descriptionStr,
    robots: {
      index: toIndex,
    },
  };
}

let adjectiveWords = [];

export default async function Page({ params }) {
  const word = decodeURIComponent(params.word);
  const isNotCompound = word.split(" ").length === 1;
  let isAIUsed = false; //to keep a check if we are using AI or not

  //redirect to /rhyming-words page when that work is causing some 404 or soft 404 errors in google search console
  // if (soft404words.includes(word)) {
  //   redirect("/adjectives");
  // }

  titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  if (isNotCompound) {
    try {
      adjectiveWords = [];
      const timeout = 5000; // Set timeout to 5 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      const endpoint = `https://api.datamuse.com/words?rel_jjb=${word}&max=200`;
      const res = await fetch(endpoint, { signal: controller.signal });

      clearTimeout(timeoutId); // Clear the timeout since the request completed

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      adjectiveWords = data.map((item) => item.word);

      if (adjectiveWords.length < 5) {
        isAIUsed = true;
        try {
          const response = await fetch(`${apiConfig.apiUrl}/generateWords`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ queryType: "adjective", prompt: word }),
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
            adjectiveWords.push(
              str
                .replace(/^\W+|\W+$/, "")
                .replace(/^\d+\.\s*/, "")
                .trim()
            )
          );

          // console.log("Data Words = ", adjectiveWords);
        } catch (error) {
          // console.error("Error fetching words:", error);
          adjectiveWords = adjectiveWords.length === 0 ? [] : adjectiveWords;
        }
      }
    } catch (error) {
      adjectiveWords = [];
    }
  } else {
    isAIUsed = true;
    adjectiveWords = [];
    await newFunction(word);
  }

  return (
    <>
      <CardHeader>
        <h1 className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of {adjectiveWords.length} adjective words and
          phrases used for describing <strong>{word}</strong> in writing.
        </p>
        <DataFilterDisplay words={adjectiveWords} />
        <p className="mb-6 text-lg font-normal">
          With these adjectives you can choose the one that perfectly describes{" "}
          {word} in your writing. Don't be afraid to experiment with various
          combinations. Try to push the boundaries of your descriptions to
          elevate it from good to great.
        </p>
        {adjectiveWords.length > 0 && isNotCompound && !isAIUsed && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );

  async function newFunction(word) {
    try {
      const response = await fetch(`${apiConfig.apiUrl}/generateWords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryType: "adjective", prompt: word }),
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
      adjectiveWords = wordForProcessing.map((str) =>
        str
          .replace(/^\W+|\W+$/, "")
          .replace(/^\d+\.\s*/, "")
          .trim()
      );

      // console.log("Data Words = ", adjectiveWords);
    } catch (error) {
      // console.error("Error fetching words:", error);
      adjectiveWords = adjectiveWords.length === 0 ? [] : adjectiveWords;
    }
  }
}
