import LinkPagination from "./LinkPagination";
import { promises as fs } from 'fs';
import commonLinks from "@utils/commonLinks";
import Link from "next/link";

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
                  <h1 className="mb-3">
                    WordPapa English Dictionaries
                  </h1>
                  <p>Ever wondered what kind of word that is? Explore the building blocks of language and master the different parts of speech! 
                  </p>
                  <p>
                    This page is your one-stop shop for exploring the rich tapestry of the English language! Dive into separate dictionaries dedicated to adjectives, adverbs, nouns, and verbs, your essential tools for crafting vibrant and expressive sentences.</p>
                </div>
                <div className="row">
                  <div className="card col-6 text-center">
                    <div className="m-2 p-2">
                      <p>Find definitions and sentence examples of an English Word</p>
                    </div>
                    <button className="p-2 custom-button medium-text">
                      <a href={commonLinks.definition} className="medium-text font-white">Word Dictionary
                      </a> </button>
                  </div>
                  <div className="card col-6 text-center" >
                    <div className="m-2 p-2">
                      <p>
                        Explore thesaurus for more than 100000+ Words </p>
                    </div>
                    <button className="custom-button medium-text">
                      <a href={commonLinks.thesaurus} className="medium-text font-white">Thesaurus Dictionary
                      </a></button>
                  </div>
                </div>
                <div className="row">
                  <div className="card col-6 text-center" >
                    <div className="m-2 p-2">
                      <p>
                        Explore 80000+ Noun words in English language</p>
                    </div>
                    <button className="custom-button medium-text">
                      <a href="/browse/nouns" className="medium-text font-white">Noun Dictionary
                      </a></button>
                  </div>
                  <div className="card col-6 text-center" >
                    <div className="m-2 p-2">
                      <p>
                        Explore 21000+ Adjective words in English </p>
                    </div>
                    <button className="custom-button medium-text">
                      <a href="/browse/adjectives" className="medium-text font-white">Adjectives Dictionary
                      </a></button>
                  </div>
                </div>
                <div className="row">
                  <div className="card col-6 text-center">
                    <div className="m-2">
                      <p>
                        Explore list of 11000+ Verbs in English</p>
                    </div>
                    <button className="custom-button p-2">
                      <a href="/browse/verbs" className="medium-text font-white"> Verbs Dictionary</a>
                    </button>
                  </div>
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
