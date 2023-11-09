'use client'
import commonLinks from "@utils/commonLinks"; 
import { usePathname } from 'next/navigation';

function displayLinK(link, AnchorText) {
    return <a className="m-2 top-pageLinks" href={link}>{AnchorText}</a>;
  }  

const RelLinksonPageBottom = ({ word, pos}) => {
  const slug = usePathname().split('/')[1];

  return (
    <div className="p-2 m-2">
      <h3>Related Links</h3>
      {slug !== 'define' && displayLinK(commonLinks.definition + word+"/", 'meaning of ' + word)}
      {slug !== 'syllables' && displayLinK(commonLinks.syllables+ word+"/", 'syllables in '+ word)}
      {slug !== 'synonyms' && displayLinK(commonLinks.thesaurus +word+"/", 'synonyms for ' + word)}
      {slug !== 'rhyming-words' && displayLinK(commonLinks.rhyming +word+"/", 'rhymes for ' + word)}
      {(slug !== 'adjectives'&& (pos !== null && pos.n.length > 0)) && displayLinK(commonLinks.adjectives +word+"/", 'describing words for ' + word)}
    </div>
  );
};

export default RelLinksonPageBottom;
