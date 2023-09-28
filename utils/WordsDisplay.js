const WordsDisplay = ({length, words}) => {
  return (
    <div className="card text-center p-2 words-container">
    <div className="card-title">
      <h3>{length} Letter Words</h3>
      <div className="card-content">
      {words.map((word, index)=>{
        return <span className='wordSpan' key={index}>{word}</span>
    })}
      </div>
    </div>
  </div>
  )
}

export default WordsDisplay