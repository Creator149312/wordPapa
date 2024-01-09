import Link from "next/link";

const ListDisplay = ({ title, description, words }) => {
  return (
    <div className="card">
      <div><h1 className="card-title">{title}</h1><Link href="" className="custom-button">Practice</Link></div> 
      <p>{description}</p>
      <ul className="card-content m-3">
        {words.map((word, index) => (
          <li key={index}><h3><Link href={`/define/${word}`}>{word}</Link></h3></li>
        ))}
      </ul>
    </div>
  );
};

export default ListDisplay;
 