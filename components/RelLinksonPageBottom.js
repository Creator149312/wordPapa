'use client'
import commonLinks from "@utils/commonLinks"; 
import { usePathname } from 'next/navigation';

function displayLinK(link, AnchorText) {
    return <a className="m-2 text-lg p-2 bg-[#75c32c] inline-block text-center shadow-md cursor-pointer" href={link}>{AnchorText}</a>;
  }  

const RelLinksonPageBottom = ({ word, pos, isCompound}) => {
  const slug = usePathname().split('/')[1];
  const wordforhref = word.toLowerCase().replace(/ /g, "-");

  return (
    <div>
      <h3 className="m-2 text-xl font-bold">Related Links</h3>
      { (slug !== 'define' && slug !== 'thesaurus' && slug !== 'rhyming-words')&& displayLinK(commonLinks.definition + wordforhref, 'meaning of ' + word)}
      {slug !== 'syllables' && displayLinK(commonLinks.syllables+ wordforhref, 'syllables in '+ word)}
      {slug !== 'thesaurus' && displayLinK(commonLinks.thesaurus +wordforhref, 'synonyms for ' + word)}
      {(slug !== 'rhyming-words' && slug !== 'thesaurus' && !isCompound ) && displayLinK(commonLinks.rhyming +wordforhref, 'rhymes for ' + word)}
      {(slug !== 'adjectives'&& !isCompound && (pos !== null && pos.n.length > 0)) && displayLinK(commonLinks.adjectives +wordforhref, 'describing words for ' + word)}
      {slug !== 'word-finder' && displayLinK(commonLinks.wordfinder +wordforhref, 'unscramble ' + word)}
    </div>
  );
};

export default RelLinksonPageBottom;
