import { Card } from "@/components/ui/card";

const MostSearchedWordsList = ({ wordList, preText, postText, slug }) => {
  const columns = 3;
  const linksPerColumn = Math.ceil(wordList.length / columns);

  const linkRows = [];

  for (let i = 0; i < linksPerColumn; i++) {
    const rowLinks = [];
    for (let j = 0; j < columns; j++) {
      const index = i + j * linksPerColumn;
      if (index < wordList.length) {
        const word = wordList[index];
        rowLinks.push(
          <a href={`${slug}${word}`} className="md:col-span-4 text-center">
            <Card key={index} className="m-2 p-2">
              {preText} {word} {postText}
            </Card>
          </a>
        );
      }
    }
    linkRows.push(
      <div key={i} className="grid md:grid-cols-12 m-2">
        {rowLinks}
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-3 mt-5 text-2xl font-semibold">
        Links to Commonly Searched Terms
      </h3>
      <div>{linkRows}</div>
    </>
  );
};

export default MostSearchedWordsList;
