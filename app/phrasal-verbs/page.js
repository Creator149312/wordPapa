import { PHRASALVERBS } from "./PHRASALVERBS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

export async function generateMetadata() {
  return {
    title: `Phrasal Verbs List: A to Z Dictionary`,
    description: `Use Phrasal Verbs Dictionary to browse the list of 8000+ phrasal verbs in English from a to z and find the multi-word verb you are looking for.`,
  };
}

const Page = async () => {
  function customLink(word) {
    let wordwithHyphens = word.toLowerCase().replace(/ /g, "-");
    let slug = commonLinks.definition + wordwithHyphens;

    return (
      <Link href={slug} target="_blank" rel="noopener noreferrer">
        {word}
      </Link>
    );
  }

  let titleString = `Phrasal Verbs List: A to Z Dictionary`;

  return (
    <>
      <h1>{titleString}</h1>
      <p>
        Welcome to your comprehensive phrasal verb dictionary! It contains all common and uncommon phrasal verbs to empower learners of all levels, from beginners taking their first steps in English to advanced users seeking to refine their fluency.</p>
      <p>All 8000+ phrasal verbs are meticulously organized alphabetically from A to Z, making it easy to find the specific verb you're looking for.
        Easily navigate this extensive list using the "Filter Results" option to pinpoint the phrasal verbs you need right away. It's designed to be an interactive learning companion for someone willing to learn different<a href="https://www.englishbix.com/4-types-of-phrasal-verbs-with-examples/">types of Phrasal Verbs</a>.
      </p>
      <DataFilterDisplay words={Object.keys(PHRASALVERBS)} />
      <p>
        Boost your english fluency naturally by incorporating phrasal verbs into your everyday conversations and sound more confident with a wider range of multi-word verbs at your disposal.
        Whether you're a beginner eager to grasp the fundamentals or an advanced learner seeking to polish your skills, this phrasal verb dictionary is your ultimate resource.
      </p>
      <p><strong>Note: </strong>The term "Group Verbs" isn't widely used in standard grammar. It might be a less formal way of referring to phrasal verbs, or it could be a misinterpretation of the concept. It is better to stick with the term "phrasal verbs" for these verb combinations
        and if you encounter "group verbs," it likely refers to phrasal verbs.</p>
    </>
  );
};

export default Page;