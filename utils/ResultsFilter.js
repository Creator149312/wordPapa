function ResultsFilter({
    startsWith,
    handleStartsWith,
    endsWith,
    handleEndsWith,
    contains,
    handleContains,
    length,
    handleLength,
  }) {
    return (
      <div className="m-2 p-2">
        <div className="row m-2">
          <div className="col-6">
            <input
             className="form-control"
              type="text"
              value={startsWith}
              onChange={(e) => handleStartsWith(e.target.value.toLowerCase())}
              placeholder="Starts With"
            />
          </div>
          <div className="col-6">
            <input
              label="Ends With"
              className="form-control"
              type="text"
              value={endsWith}
              onChange={(e) => handleEndsWith(e.target.value.toLowerCase())}
              placeholder="....A"
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
              placeholder="A....Z"
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
    );
  }
  
  export default ResultsFilter;
  