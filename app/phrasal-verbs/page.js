import { PHRASALVERBS } from "./PHRASALVERBS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import AdsUnit from "@components/AdsUnit";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata() {
  return {
    title: `Phrasal Verbs List: A to Z Dictionary`,
    description: `Use Phrasal Verbs Dictionary to browse the list of 8000+ phrasal verbs in English from A to Z and find the multi-word verb you are looking for.`,
  };
}

const Page = async () => {
  const titleString = `Phrasal Verbs List: A to Z Dictionary`;

  function customLink(word) {
    const wordWithHyphens = word.toLowerCase().replace(/ /g, "-");
    const slug = commonLinks.definition + wordWithHyphens;

    return (
      <Link href={slug} target="_blank" rel="noopener noreferrer">
        {word}
      </Link>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>

      <p className="mb-6 text-lg font-normal">
        Welcome to your comprehensive phrasal verb dictionary! It contains all
        common and uncommon phrasal verbs to empower learners of all levels,
        from beginners taking their first steps in English to advanced users
        seeking to refine their fluency.
      </p>

      <p className="mb-6 text-lg font-normal">
        All 8000+ phrasal verbs are meticulously organized alphabetically from
        A to Z, making it easy to find the specific verb you're looking for.
        Easily navigate this extensive list using the "Filter Results" option to
        pinpoint the phrasal verbs you need right away. It's designed to be an
        interactive learning companion for someone willing to learn different{" "}
        <a
          href="https://www.englishbix.com/4-types-of-phrasal-verbs-with-examples/"
          target="_blank"
          rel="noopener noreferrer"
        >
          types of Phrasal Verbs
        </a>
        .
      </p>

      <DataFilterDisplay words={Object.keys(PHRASALVERBS)} />

      <p className="mb-6 text-lg font-normal">
        Boost your English fluency naturally by incorporating phrasal verbs into
        your everyday conversations and sound more confident with a wider range
        of multi-word verbs at your disposal. Whether you're a beginner eager to
        grasp the fundamentals or an advanced learner seeking to polish your
        skills, this phrasal verb dictionary is your ultimate resource.
      </p>

      <AdsUnit slot="7782807936" />

      <p className="mb-6 text-lg font-normal">
        <strong>Note: </strong>The term "Group Verbs" isn't widely used in
        standard grammar. It might be a less formal way of referring to phrasal
        verbs, or it could be a misinterpretation of the concept. It is better
        to stick with the term "phrasal verbs" for these verb combinations, and
        if you encounter "group verbs," it likely refers to phrasal verbs.
      </p>
    </>
  );
};

export default Page;
