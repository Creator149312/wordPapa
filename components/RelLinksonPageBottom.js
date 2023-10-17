import React from "react";

function displayLinK(link, AnchorText) {
    return <a className="m-2 top-pageLinks" href={link}>{AnchorText}</a>;
  }  

const RelLinksonPageBottom = ({ slug, word, pos}) => {
  return (
    <div className="p-2 m-2">
      <h3>Related Links</h3>
      {displayLinK('/define/'+ word+"/", 'meaning of ' + word)}
      {displayLinK("/syllables/"+word+"/", 'syllables in '+ word)}
      {displayLinK("/synonyms/"+word+"/", 'synonyms for ' + word)}
      {displayLinK("/rhyming-words/"+word+"/", 'rhymes for ' + word)}
      {(pos !== null && pos.n.length > 0) && displayLinK("/adjectives/"+word+"/", 'describing words for ' + word)}
    </div>
  );
};

export default RelLinksonPageBottom;
