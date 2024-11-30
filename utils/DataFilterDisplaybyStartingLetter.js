'use client'
import AdvancedFilter from "@utils/AdvancedFilter";
import { displayWordsByStartingLetter } from "@utils/HelperFunctions";
import { useState } from "react";

const DataFilterDisplaybyStartingLetter = ({words}) => {
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [length, setLength] = useState("");

  return (
    <div className="mb-6">
        <AdvancedFilter 
          startsWith={startsWith}
          handleStartsWith={setStartsWith}
          endsWith={endsWith}
          handleEndsWith={setEndsWith}
          contains={contains}
          handleContains={setContains}
          length={length}
          handleLength={setLength}
        />
 
      {displayWordsByStartingLetter(words, startsWith, endsWith, contains, length)}
    </div>
  );
};

export default DataFilterDisplaybyStartingLetter;
