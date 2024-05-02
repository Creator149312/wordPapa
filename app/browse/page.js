import LinkPagination from "./LinkPagination";
import { promises as fs } from 'fs';
import commonLinks from "@utils/commonLinks";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"


/*
* this file will include browsing of all words like nouns, adjectives, adverbs
*/

export async function generateMetadata({ params }, parent) {
  // read route params
  const titleStr = `WordPapa English Dictionaries`;
  const descriptionStr = `Browse the Ultimate List of Dictionaries in English to find the words you want.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}


const Page = async () => {

  const working = false;

  return (
    working ? (<p> We are working to create something amazing for you</p>) : (
      <div>
        <div className="row">
          {/* Left side: 9-column scrollable content */}
          <div className="m-2 p-3">
            <div>
              <div>
                <div className="p-3 text-center mb-2">
                  <h1 className="mb-3 text-4xl font-bold">
                    WordPapa English Dictionaries
                  </h1>
                  <p className="m-2 p-2 text-lg font-normal">Ever wondered what kind of word that is? Explore the building blocks of language and master the different parts of speech!
                  </p>
                  <p className="m-2 p-2 text-lg font-normal">
                    This page is your one-stop shop for exploring the rich tapestry of the English language! Dive into separate dictionaries dedicated to adjectives, adverbs, nouns, and verbs, your essential tools for crafting vibrant and expressive sentences.</p>
                </div>
                <div className="grid md:grid-cols-12">
                  <Card className="md:col-span-6 text-center m-2 p-2">
                    <p className="m-2 p-2 text-lg font-normal">Find definitions and sentence examples of an English Word</p>
                    <a href="/define" > <Button variant={"searchcustom"} className="p-5 text-lg m-2">Word Dictionary
                    </Button> </a>
                  </Card>
                  <Card className="md:col-span-6 text-center m-2 p-2" >
                    <p className="m-2 p-2 text-lg font-normal"> Explore thesaurus for more than 100000+ Words </p>
                    <a href="/thesaurus">   <Button variant={"searchcustom"} className="p-5 text-lg m-2">Thesaurus Dictionary
                    </Button> </a>
                  </Card>
                </div>
                <div className="grid md:grid-cols-12">
                  <Card className="md:col-span-6 text-center m-2 p-2" >
                    <p className="m-2 p-2 text-lg font-normal">Explore 80000+ Noun words in English language</p>
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">
                      <a href="/browse/nouns">Noun Dictionary
                      </a></Button>
                  </Card>
                  <Card className="md:col-span-6 text-center m-2 p-2" >
                    <p className="m-2 p-2 text-lg font-normal">
                      Explore 21000+ Adjective words in English </p>
                    <Button variant={"searchcustom"} className="p-5 text-lg m-2">
                      <a href="/browse/adjectives" >Adjectives Dictionary
                      </a></Button>
                  </Card>
                </div>
                <div className="grid md:grid-cols-12">
                  <Card className="md:col-span-6 text-center m-2 p-2">
                    <p className="m-2 p-2 text-lg font-normal">
                      Explore list of 11000+ Verbs in English</p>
                      <a href="/browse/verbs"> <Button variant={"searchcustom"} className="p-5 text-lg m-2"> Verbs Dictionary</Button></a>
                  </Card>
                  <Card className="md:col-span-6 text-center m-2 p-2">
                    <p className="m-2 p-2 text-lg font-normal">
                      Explore list of 8000+ Phrasal Verbs in English</p>
                      <a href="/phrasal-verbs"> <Button variant={"searchcustom"} className="p-5 text-lg m-2"> Phrasal Verbs List</Button></a>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
};

export default Page;
