import commonLinks from "@utils/commonLinks";
import React from "react";


function displayLinK(link, AnchorText) {
    return <a className="m-2 top-pageLinks" href={link}>{AnchorText}</a>;
  }  

const RelLinksonPageBottom = ({ slug, word, pos}) => {
  return (
    <div className="p-2 m-2">
      <h3>Related Links</h3>
      {displayLinK(commonLinks.definition + word+"/", 'meaning of ' + word)}
      {displayLinK(commonLinks.syllables+ word+"/", 'syllables in '+ word)}
      {displayLinK(commonLinks.thesaurus +word+"/", 'synonyms for ' + word)}
      {displayLinK(commonLinks.rhyming +word+"/", 'rhymes for ' + word)}
      {(pos !== null && pos.n.length > 0) && displayLinK(commonLinks.adjectives +word+"/", 'describing words for ' + word)}
    </div>
  );
};

export default RelLinksonPageBottom;
