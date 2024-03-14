import synonymWordsArray from '../synonym-words';

let finalArray = [];

const handleCheckValidity = async (checkWord) => {
  let isValid = false;
  try {
    const response = await fetch(`https://api.datamuse.com/words?ml=${checkWord}&max=200`);
    const data = await response.json();

    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (!isValid) {
          if (data[i].tags !== undefined && data[i].tags.includes('syn')) isValid = true;
        }
      }
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    isValid = false; // Assume word is not valid if there's an error
  }

  if(isValid) {
    // console.log(checkWord)
    finalArray.push(checkWord);
  }else{
    console.log(checkWord)
  }
};

const MyComponent = async () => {

//   const hasSpace = (str) => str.includes(' ');
// console.log("Total Words with Spaces = ", synonymWordsArray.length)

//   for (var i = 0; i < synonymWordsArray.length; i++) {
//     if (hasSpace(synonymWordsArray[i])) {
//       await handleCheckValidity(synonymWordsArray[i]);
//     }
//   }


  return (
    <div>
      {/* <h2>Strings with spaces:</h2>
      {finalArray.map((item) => (
        <li key={item}>{item}</li>
      ))} */}
    </div>
  );
};

export default MyComponent;
