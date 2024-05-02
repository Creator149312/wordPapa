'use client'
import { useState } from 'react';

function AdvancedFilter({
  startsWith,
  handleStartsWith,
  endsWith,
  handleEndsWith,
  contains,
  handleContains,
  length,
  handleLength
}) {

  const [isActive, setIsActive] = useState(false);

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="shadow-lg m-2 border-t">
      <div className="cursor-pointer">
        <div className="text-center text-lg bg-slate-100 dark:bg-slate-900 p-2 font-bold" onClick={toggleAccordion}>Filter Results</div>
        <div className={`m-2 p-2 ${isActive ? '' : 'hidden'}`}>
          <div className="grid grid-cols-12 p-2 m-2">
            <div className="col-span-6 shadow-md">
              <input
                className="w-full p-2 text-lg border-2 rounded-sm"
                label="Starts With"
                type="text"
                value={startsWith}
                onChange={(e) => handleStartsWith(e.target.value.toLowerCase())}
                placeholder="Starts With Eg. A...."
              />
            </div>
            <div className="col-span-6 shadow-md">
              <input
                label="Ends With"
                className="w-full p-2 text-lg border-2 rounded-sm"
                type="text"
                value={endsWith}
                onChange={(e) => handleEndsWith(e.target.value.toLowerCase())}
                placeholder="Ends With Eg. ....A"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 m-2 p-2">
            <div className="col-span-6 shadow-md">
              <input
                label="Contains"
                className="w-full p-2 text-lg border-2 rounded-sm"
                type="text"
                value={contains}
                onChange={(e) => handleContains(e.target.value.toLowerCase())}
                placeholder="Contains: A....Z"
              />
            </div>
            <div className="col-span-6 shadow-md ">
              <input
                label="Length"
                type="number"
                className="w-full p-2 text-lg border-2 rounded-sm"
                value={length}
                onChange={(e) => handleLength(e.target.value)}
                placeholder="4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilter;
