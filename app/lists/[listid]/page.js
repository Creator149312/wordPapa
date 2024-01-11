import ListDisplay from "@components/ListDisplay";

let titleStr = "";
// export async function generateMetadata({ params }, parent) {
//   const word  = decodeURIComponent(params.word);
//   // read route params
//   titleStr = "Adjective Words to Describe " + (word.charAt(0).toUpperCase() + word.slice(1));
//   const descriptionStr = "Explore list of commonly used adjective words for describing " + params.word + " in writing.";
//   return {
//     title: titleStr,
//     description: descriptionStr ,
//   }
// }

let wordsList = null;

export default async function Page({ params }) {
  if (params.listid !== "favicon.ico") {
    const id = params.listid;
    try {
      const response = await fetch(`http://localhost:3000/api/list/${id}`, { cache: "no-store" }); // Replace with your actual API endpoint

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      const data = await response.json();
      wordsList = data.list;
    } catch (error) {
      console.log(error)
    } finally {
      // console.log("data loaded");
    }
  }

  return (
    <div>
      {(wordsList !== null) && (
        <ListDisplay title={wordsList.title} description={wordsList.description} words={wordsList.words} />
      )}
    </div>
  );
}