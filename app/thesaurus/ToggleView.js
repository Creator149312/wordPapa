"use client";
import { useState } from "react";
import DataFilterDisplay from "@utils/DataFilterDisplay";
import { Button } from "@components/ui/button";

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
      <div className="flex justify-between items-center m-3">
        <Button onClick={handleAllWordsButtonClick} variant={!allWordsButton ? 'searchcustom' : 'secondary'}>
          Related Words
        </Button>
        {synWords.length > 0 && (
        <Button onClick={handlesynonymButtonClick} variant={!synonymButton ? 'searchcustom' : 'secondary'}>
         Only Synonyms
        </Button>)}
        {antWords.length > 0 && (
          <Button onClick={handleantonymButtonClick} variant={!antonymButton ? 'searchcustom' : 'secondary'}>
         Only Antonyms
          </Button>
        )}
      </div>
      {allWordsButton && <DataFilterDisplay words={allWords} />}
      {synonymButton && <DataFilterDisplay words={synWords} />}
      {antonymButton && <DataFilterDisplay words={antWords} />}
    </>
  );
};

export default ToggleView;
