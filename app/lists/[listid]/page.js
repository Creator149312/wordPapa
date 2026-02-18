import ListDisplay from "@components/ListDisplay";
import apiConfig from "@utils/apiUrlConfig";
import { validateObjectID } from "@utils/Validator";

let listerror = null;

export async function generateMetadata({ params }) {
  let listdata = null;

  if (validateObjectID(params.listid)) {
    const id = params.listid;
    try {
      const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch list");
      listdata = (await response.json()).list;
    } catch (error) {
      listerror = error;
    } finally {
      if (listdata === null) {
        listerror = { message: "No records Found" };
      }
    }
  }

  if (listdata !== null) {
    const titleStr = `${listdata.title} Learning Flashcards`;
    const descriptionStr = `Explore the list "${listdata.title}" and practice using flashcards.`;
    return {
      title: titleStr,
      description: descriptionStr,
    };
  } else {
    return {
      title: "No List Found",
      description: "No List Found",
    };
  }
}

export default async function Page({ params }) {
  let wordsList = null;
  let IfIdValid = validateObjectID(params.listid);

  if (IfIdValid) {
    const id = params.listid;
    try {
      const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch list");
      const data = await response.json();
      wordsList = data.list;
    } catch (error) {
      listerror = error;
    } finally {
      if (wordsList === null) {
        listerror = { message: "No records Found" };
      }
    }
  }

  return (
    <div className="mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-full sm:max-w-3xl">
      {wordsList !== null && listerror == null && (
        <ListDisplay
          title={wordsList.title}
          description={wordsList.description}
          words={wordsList.words}
        />
      )}

      {listerror && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 sm:p-4 rounded-md text-center text-sm sm:text-base">
          We can't find the list. It may have been deleted by the creator.
        </div>
      )}
    </div>
  );
}
