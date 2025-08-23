import { sortStringArrayinASC } from "@utils/HelperFunctions";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import apiConfig from "@utils/apiUrlConfig";

let errorWordNick = null;
let errorTwinWord = null;

async function getSentencesUsingWordnik(word) {
  errorWordNick = null;
  try {
    const apiKey = "e0d094e089e87c411680f08f6ab0e7be39143f84626e8c9e4";
    const endpoint = `https://api.wordnik.com/v4/word.json/${word}/examples?api_key=${apiKey}`;

    const response = await fetch(endpoint, { cache: "force-cache" });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (data.examples?.length > 0) {
      return sortStringArrayinASC(data.examples.map((sent) => sent.text));
    } else {
      throw new Error();
    }
  } catch (e) {
    errorWordNick = e;
  }
}

async function getSentencesUsingTwinWord(word, regex) {
  errorTwinWord = null;
  try {
    const url = `https://twinword-word-graph-dictionary.p.rapidapi.com/example/?entry=${word}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "338b7bbeaemsh4f79a8247d73aefp18217cjsn6cf2a83d6072",
        "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
      },
      cache: "force-cache",
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (data.example?.length > 0) {
      return sortStringArrayinASC(
        data.example.filter((sent) => sent.match(regex))
      );
    } else {
      throw new Error();
    }
  } catch (e) {
    errorTwinWord = e;
  }
}

async function fetchAISentences(word) {
  try {
    const response = await fetch(`${apiConfig.apiUrl}/generateSentences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, queryType: "sentences" }),
      cache: "force-cache",
    });

    const data = await response.json();
    const raw = data.definitionAndSentences.includes("\n")
      ? data.definitionAndSentences.split("\n")
      : data.definitionAndSentences;

    return raw.map((str) =>
      str.replace(/^\W+|\W+$/, "").replace(/^\d+\.\s*/, "").trim()
    );
  } catch {
    return [];
  }
}

function NoResults({ word }) {
  return (
    <Card className="m-2 border-red-500">
      <CardHeader>
        <h1 className="text-2xl font-bold text-red-600">No Sentences Found</h1>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          Sorry, we couldn’t find any example sentences for{" "}
          <strong>{word}</strong>. Try searching for a different word or check
          your spelling.
        </p>
      </CardContent>
    </Card>
  );
}

const SentencesFetcher = async ({ word }) => {
  const regex = new RegExp(word, "i");

  if (!(word.includes(" ") || word.includes("-"))) {
    const [sentencesTwinWord, sentencesWordNick] = await Promise.all([
      getSentencesUsingTwinWord(word, regex),
      getSentencesUsingWordnik(word),
    ]);

    let sentencesByAI = null;

    if (
      (!sentencesTwinWord || sentencesTwinWord.length === 0) &&
      (!sentencesWordNick || sentencesWordNick.length === 0)
    ) {
      sentencesByAI = await fetchAISentences(word);
    }

    const allSentences = sentencesByAI?.length
      ? sentencesByAI
      : sortStringArrayinASC(
          (sentencesTwinWord || []).concat(sentencesWordNick || [])
        );

    if (!allSentences.length) {
      return <NoResults word={word} />;
    }

    return (
      <Card className="m-2" id="examples">
        <CardHeader>
          <h1 className="text-4xl font-extrabold">
            Examples of "{word}" in Sentences
          </h1>
        </CardHeader>
        <CardContent>
          <ul className="m-2 p-2 text-lg list-disc">
            {allSentences.map(
              (sent, index) =>
                sent && (
                  <li className="p-0.5" key={index}>
                    {sent}
                  </li>
                )
            )}
          </ul>
        </CardContent>
      </Card>
    );
  } else {
    const sentencesWordNick = await getSentencesUsingWordnik(word);

    if (!sentencesWordNick?.length) {
      return <NoResults word={word} />;
    }

    return (
      <Card className="m-2">
        <CardHeader>
          <h1 className="text-3xl font-extrabold">
            Examples of "{word}" in Sentences
          </h1>
        </CardHeader>
        <CardContent>
          <ul className="m-2 p-2 text-lg list-disc">
            {sentencesWordNick.map(
              (sent, index) =>
                sent.includes(word) && (
                  <li className="p-0.5" key={index}>
                    {sent}
                  </li>
                )
            )}
          </ul>
        </CardContent>
      </Card>
    );
  }
};

export default SentencesFetcher;
