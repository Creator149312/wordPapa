import ALLCLEANWORDS from "@app/browse/ALLCLEANWORDS";
import DataFilterDisplaybyStartingLetter from "@/utils/DataFilterDisplaybyStartingLetter";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = parseInt(decodeURIComponent(params.length));

  // read route params
  titleStr = `${L} Letter Words in English`;
  const descriptionStr = `Browse the list of all ${L} English words and filter them according to starting letters, ending letters and containing letters.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  let L = parseInt(params.length);
  const regex = /^[a-zA-Z]+$/;
  let words = ALLCLEANWORDS.filter((w) => (w.length === L && regex.test(w)));
  let titleString = `${L} Letter Words in English`;

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the complete list of {L} Letter English words. Use Filter option to sort these {L}-Letter words according to starting letters, ending letters and containing letters.   
      </p>
      <DataFilterDisplaybyStartingLetter words={words}/>
    </>
  );
};

export default Page;
