import commonLinks from "@utils/commonLinks";
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"

const Page = () => {
  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div className="m-2 p-3">
          <div>
            <div>
              <div className="p-3 text-center mb-2">
                <h1 className="mb-3 text-4xl">
                  <strong>WordPapa</strong>
                  <sub className="p-1"> by</sub>
                  <sub className="p-1 text-3xl">EnglishBix</sub>
                </h1>
                <h3 className="text-2xl m-2 p-2">The free, fun, and effective way to master a word!</h3>
                <p className="m-3 p-2 text-lg font-normal">
                  An enriching vocabulary hub, where language mastery begins.
                  Dive into a world of words and their nuances.
                </p>
                <p className="m-3 p-2 text-lg font-normal">
                  Our comprehensive dictionary is your key to unlocking the
                  depth of the English language. Explore meanings, discover
                  synonyms, unravel antonyms, and delve into the intricacies of
                  adjectives.
                </p>
              </div>
              <div className="grid md:grid-cols-12">
                <Card className="md:col-span-6 text-center m-2  p-2" href={commonLinks.definition}>
                  <p className="m-2 p-2 text-lg font-normal">
                    A dictionary to find new words along with their definitions and examples
                  </p>
                  <a href="/define"  >
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">
                      Word Dictionary
                    </Button></a>
                </Card>
                <Card className="md:col-span-6 text-center m-2  p-2" >
                  <p className="m-2 p-2 text-lg font-normal">
                    Tool to find Adjective words to describe a Noun or Object  </p>
                  <a href="/adjectives"> <Button variant={"searchcustom"} className="p-5 text-lg m-2">Adjectives Finder
                  </Button> </a>
                </Card>
              </div>
              <div className="grid md:grid-cols-12">
                <Card className="md:col-span-6 text-center m-2 p-2" >
                  <p className="m-2 p-2 text-lg font-normal">
                    Synonyms and antonyms of a word that I know
                  </p>
                  <a href="/thesaurus">
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">Thesaurus</Button></a>
                </Card>
                <Card className="md:col-span-6 text-center m-2  p-2">
                  <p className="m-2 p-2 text-lg font-normal">
                    rhyming words that rhyme with a word that I know</p>
                  <a href="/rhyming-words">  <Button variant={"searchcustom"} className="p-5 text-lg m-2">Rhyming Dictionary </Button></a>
                </Card>
              </div>
              <div className="grid md:grid-cols-12">
                <Card className="md:col-span-6 text-center m-2  p-2">
                  <p className="m-2 p-2 text-lg font-normal">
                    a tool to find number of syllables in a given word
                  </p>
                  <a href="/syllables">
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">
                      Syllable Counter
                    </Button>
                  </a>
                </Card>
                <Card className="md:col-span-6 text-center m-2  p-2">
                  <p className="m-2 p-2 text-lg font-normal">
                    a tool to generate all possible words with given letters</p>
                  <a href="/word-finder">
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">
                      Word Finder
                    </Button>
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
