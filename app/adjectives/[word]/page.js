import RelLinksonPageBottom from "@components/RelLinksonPageBottom";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import { CardContent, CardHeader } from "@components/ui/card";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const word = decodeURIComponent(params.word);
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
  };
}

let adjectiveWords = [];

export default async function Page({ params }) {
  //const word = params.word.split('-').join(' ');

  const word = decodeURIComponent(params.word);
  titleStr =
    "Adjective Words to Describe " +
    (word.charAt(0).toUpperCase() + word.slice(1));

  // try {
  //   adjectiveWords = [];
  //   const response = await axios.get(
  //     `https://api.datamuse.com/words?rel_jjb=${word}&max=200`
  //   );
  //   adjectiveWords = response.data.map((item) => item.word);
  // } catch (error) {
  //   // console.error(error);
  //   return {
  //     notFound: true,
  //   };
  // }

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
  } catch (error) {
    //  console.log(" I am inside error block with error - " + error.name);
    // return {
    //   notFound: true,
    // };

    adjectiveWords = [];
  }

  return (
    <>
      <CardHeader>
        <h1  className="text-4xl font-extrabold">{titleStr}</h1>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-lg font-normal">
          Following is a list of {adjectiveWords.length} adjective words and
          phrases used for describing <strong>{word}</strong> in writing.{" "}
        </p>
        <DataFilterDisplay words={adjectiveWords} />
        <p className="mb-6 text-lg font-normal">
          With these adjectives you can choose the one that perfectly describes{" "}
          {word} in your writing. Don't be afraid to experiment with various
          combinations. Try to push the boundaries of your descriptions to
          elevate it from good to great.
        </p>
        {adjectiveWords.length > 0 && (
          <RelLinksonPageBottom word={word} pos={null} />
        )}
      </CardContent>
    </>
  );
}
