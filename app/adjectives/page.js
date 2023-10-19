import MostSearchedWordsList from "@components/MostSearchedWordsList";
import AdjectivesExtractor from "./AdjectivesExtractor";
import commonLinks from "@utils/commonLinks";

const mostSearchedWordsList =[
  "socks",
  "turtle",
  "grace",
  "watch",
  "months",
  "wish",
  "negotiation",
  "display",
  "lunch",
  "dinner",
  "supervisors",
  "christian",
  "bond",
  "fan",
  "blue",
  "play",
  "reader",
  "apps",
  "fountain",
  "office",
  "plan",
  "nails",
  "table",
  "rest",
  "recitation",
  "model",
  "packaging",
  "condolences",
  "collection",
  "monday",
  "construction",
  "tattoo",
  "portfolio",
  "gamer",
  "standard",
  "insect",
  "lipstick",
  "task",
  "workout",
  "chef",
  "internet",
  "curtains",
  "speech",
  "poverty",
  "brownies",
  "sunglasses",
  "decoration",
  "principal",
  "sloth",
  "machine",
  "seminar",
  "wisdom",
  "sustainability",
  "startups",
  "bathroom",
  "gym",
  "material",
  "tea",
  "report",
  "salad",
  "box",
  "program",
  "classmates",
  "accessories",
  "december",
  "soap",
  "spices",
  "modern",
  "topic",
  "wall",
  "relaxing",
  "pasta",
  "spaghetti",
  "mentor",
  "math",
  "connection",
  "message",
  "year",
  "group",
  "weekend",
  "laptop",
  "soup",
  "playground",
  "vibes",
  "drums",
  "development",
  "leaves",
  "speaker",
  "rabbit",
  "view",
  "pencil",
  "evening",
  "guidance",
  "morning",
  "plastic"
];

export const metadata = {
  title: "Adjectives Finder: Get Describing Words for Nouns",
  description: "Use our Adjectives Finder to find perfect describing words for Nouns or Objects to enhance the quality of your writings and make communications engaging."
}

function AdjectivesExtractorPage() {
  return (
    <div>
      <div className="row">
        <div>
          <div>
            <div >
              <AdjectivesExtractor />
              <div className="m-2 p-2">
                <p>
                  Introducing our Adjectives Finder is a handy resource for word
                  enthusiasts, writers, and language lovers. Also known as an
                  describing words generator, assists users in finding
                  adjectives or describing words to enhance the details and
                  imagery in their writing.
                </p>
                <p>
                  By inputting a noun or object, users can generate a list of
                  adjectives that can be used to paint a more vivid picture in
                  their writing. This tool is valuable for improving the
                  descriptive quality of narratives, product descriptions, and
                  creative storytelling, helping writers create more engaging
                  and expressive content.
                </p>
                <p>
                  You simply have to give it a word, this tool will effortlessly
                  generates a curated list of descriptive words related to your
                  chosen term, enhancing your vocabulary and creative writing.
                </p>
                <p>
                  What sets it apart is its intuitive sorting feature, arranging
                  these adjectives in alphabetical order by length, making it a
                  breeze to find the perfect word for your expression.
                </p>
              </div>
              <MostSearchedWordsList wordList={mostSearchedWordsList} preText={"describing words for "} postText={""} slug={commonLinks.adjectives}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjectivesExtractorPage;
