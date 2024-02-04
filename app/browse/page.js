import LinkPagination from "./LinkPagination";
import { promises as fs } from 'fs';
import commonLinks from "@utils/commonLinks";
import Link from "next/link";

/*
* this file will include browsing of all words like nouns, adjectives, adverbs
*/

const Page = async () => {

  const working = true;

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
                  Explore All English Words 
                </h1>
                <p>
                  Our comprehensive dictionary is your key to unlocking the
                  depth of the English language. Explore meanings, discover
                  synonyms, unravel antonyms, and delve into the intricacies of
                  adjectives.
                </p>
              </div>
              <div className="row">
                <div className="card col-6 text-center" href={commonLinks.definition}>
                  <div className="m-2 p-2">
                  <p></p>
                  </div>
                  <button className="p-2 custom-button medium-text">
                 <a href={commonLinks.definition} className="medium-text font-white" > Word Dictionary 
                 </a> </button>
                </div>
                <div className="card col-6 text-center" >
                  <div className="m-2 p-2">
                  <p>
                  Explore all Nouns </p>
                  </div>
                  <button className="custom-button medium-text">
                     <a href={commonLinks.adjectives} className="medium-text font-white">Noun Dictionary
                     </a></button>
                  </div>
              </div>
              <div className="row">
              <div className="card col-6 text-center" >
                  <div className="m-2">
                  <p>
                    Explore all Adjectives
                  </p>
                  </div>
                    <button className="custom-button p-2">
                      <a href={commonLinks.thesaurus}  className="medium-text font-white">Adjectives </a>
                    </button>
                </div>
                <div className="card col-6 text-center">
                  <div className="m-2">
                  <p>
                  rhyming words that rhyme with a word that I know</p>
                  </div>
                    <button className="custom-button p-2">
                      <a href={commonLinks.rhyming}  className="medium-text font-white"> Rhyming Dictionary</a>
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
