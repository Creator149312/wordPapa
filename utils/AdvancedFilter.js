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
      <div className="accordion">
      <div className={`accordion-item ${isActive ? 'active' : ''}`}>
      <div className="accordion-header text-center" onClick={toggleAccordion}>Filter Results</div>
      <div className="m-2 p-2 accordion-content">
        <div className="row m-2">
          <div className="col-6">
            <input
             className="form-control"
              label="Starts With"
              type="text"
              value={startsWith}
              onChange={(e) => handleStartsWith(e.target.value.toLowerCase())}
              placeholder="Starts With Eg. A...."
            />
          </div>
          <div className="col-6">
            <input
              label="Ends With"
              className="form-control"
              type="text"
              value={endsWith}
              onChange={(e) => handleEndsWith(e.target.value.toLowerCase())}
              placeholder="Ends With Eg. ....A"
            />
          </div>
        </div>
        <div className="row m-2">
          <div className="col-6">
            <input
              label="Contains"
              className="form-control"
              type="text"
              value={contains}
              onChange={(e) => handleContains(e.target.value.toLowerCase())}
              placeholder="Contains: A....Z"
            />
          </div>
          <div className="col-6">
            <input
              label="Length"
              type="number"
              className="form-control"
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
  