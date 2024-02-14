"use client";
import { useState } from "react";
import DataFilterDisplay from "@utils/DataFilterDisplay";

const ToggleView = ({ allWords, synWords, antWords }) => {
  const [allWordsButton, setallWordsButton] = useState(true);
  const [synonymButton, setsynonymButton] = useState(false);
  const [antonymButton, setantonymButton] = useState(false);

  const handleAllWordsButtonClick = () => {
    setsynonymButton(false);
    setantonymButton(false);
    setallWordsButton(true);
    // Perform specific action when button1 is toggled
    // if (!allWordsButton) {
    //   // Action when button1 is turned on
    //   console.log("Button 1 is active.");
    // } else {
    //   // Action when button1 is turned off
    //   console.log("Button 1 is inactive.");
    // }
  };

  const handlesynonymButtonClick = () => {
    setsynonymButton(true);
    setantonymButton(false);
    setallWordsButton(false);
    // Perform specific action when button2 is toggled
    // if (!synonymButton) {
    //   // Action when button2 is turned on
    //   console.log("Button 2 is active.");
    // } else {
    //   // Action when button2 is turned off
    //   console.log("Button 2 is inactive.");
    // }
  };

  const handleantonymButtonClick = () => {
    setsynonymButton(false);
    setantonymButton(true);
    setallWordsButton(false);
  };

  return (
    <>
      <div className="left-right m-3">
        <button onClick={handleAllWordsButtonClick} className={!allWordsButton ? 'custom-button' : 'custom-button custom-button-gray'}>
          Related Words
        </button>
        {synWords.length > 0 && (
        <button onClick={handlesynonymButtonClick} className={!synonymButton ? 'custom-button' : 'custom-button custom-button-gray'}>
         Only Synonyms
        </button>)}
        {antWords.length > 0 && (
          <button onClick={handleantonymButtonClick} className={!antonymButton ? 'custom-button' : 'custom-button custom-button-gray'}>
         Only Antonyms
          </button>
        )}
      </div>
      {allWordsButton && <DataFilterDisplay words={allWords} />}
      {synonymButton && <DataFilterDisplay words={synWords} />}
      {antonymButton && <DataFilterDisplay words={antWords} />}
    </>
  );
};

export default ToggleView;
