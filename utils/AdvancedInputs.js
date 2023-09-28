function AdvancedInputs({
  inputLetters,
  setInputLetters,
  startsWith,
  handleStartsWith,
  endsWith,
  handleEndsWith,
  contains,
  handleContains,
  length,
  handleLength,
  handleFindWords,
}) {
  return (
    <div className="m-2 p-2">
      <div className="col-12 p-2">
        <input
          label="Enter Your Word"
          className="form-control form-control-lg"
          type="text"
          value={inputLetters}
          onChange={(e) => setInputLetters(e.target.value.toLowerCase())}
          maxLength={50}
          placeholder="YOUR LETTERS"
        />
      </div>
      <div className="row m-2">
        <div className="col-6">
          <input
           className="form-control"
            label="Starts With"
            type="text"
            value={startsWith}
            onChange={(e) => handleStartsWith(e.target.value.toLowerCase())}
            placeholder="A...."
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
      <div className="row m-2">
        <div className="col-12 text-center">
          <button
            onClick={handleFindWords}
            className="custom-button form-control"
            style={{ backgroundColor: "#75c32c" }}
          >
            Search Words
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedInputs;
