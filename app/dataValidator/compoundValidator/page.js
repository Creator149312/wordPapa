import ALLCLEANWORDS from '@app/browse/ALLCLEANWORDS';

//with words containing spaces and -
const findWordsWithSameLetters = (words) => {
    const wordMap = {};
    words.forEach((word) => {
        const key = word.replace(/[ \-]/g, '').toLowerCase(); // Remove spaces and dashes, convert to lowercase
          wordMap[key] = [];
     });

    words.forEach((word) => {
      if (!/\d/.test(word)) { //
        const key = word.replace(/[ \-]/g, '').toLowerCase(); // Remove spaces and dashes, convert to lowercase
        if(wordMap[key])
        wordMap[key].push(word);
      }
    });

    const result = Object.values(wordMap).filter((group) => group.length > 1);
    return result.flat();
  };

const IndexPage = () => {
    // const wordsWithSameLetters = findWordsWithSameLetters(ALLCLEANWORDS);

    // return (
    //     <div>
    //         <h1>Words exactly same without space or '-' : {wordsWithSameLetters.length}</h1>
    //         <ul>
    //             {wordsWithSameLetters.map((word, index) => (
    //                 <li key={index}>{word}</li>
    //             ))}
    //         </ul>
    //     </div>
    // );

    return <></>;
};

export default IndexPage;
