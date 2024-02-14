'use client'
import AdvancedFilter from "@utils/AdvancedFilter";
import { displayWords } from "@utils/HelperFunctions";
import { useState } from "react";

const DataFilterDisplay = ({words}) => {
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [length, setLength] = useState("");

  return (
    <div>
      <div >
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
      </div>
      {displayWords(words, startsWith, endsWith, contains, length)}
    </div>
  );
};

export default DataFilterDisplay;
