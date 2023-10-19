import React from 'react'

const MostSearchedWordsList = ({wordList, preText, postText, slug}) => {
    const columns = 3;
    const linksPerColumn = Math.ceil(wordList.length / columns);
  
    const linkRows = [];
  
    for (let i = 0; i < linksPerColumn; i++) {
      const rowLinks = [];
      for (let j = 0; j < columns; j++) {
        const index = i + j * linksPerColumn;
        if (index < wordList.length) {
          const word = wordList[index];
          rowLinks.push(
            <div key={index} className='link-box col-4'>
              <a href={`${slug}${word}`}>{preText} {word} {postText}</a>
            </div>
          );
        }
      }
      linkRows.push(
        <div key={i} className='row'>
          {rowLinks}
        </div>
      );
    }
  
    return (<>
        <h3>Links to Commonly Searched Terms</h3>
      <div>
        {linkRows}
      </div>
      </>
    );
}

export default MostSearchedWordsList