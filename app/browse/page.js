import React from "react";
import LinkPagination from "./LinkPagination";
import { promises as fs } from 'fs';

async function getWords() {
  const filePath = process.cwd() + '/app/browse/a.txt' // Replace with the actual path to your file.

  try {
    const fileContent =  await fs.readFile(filePath, 'utf8');
    const linksArray = fileContent.split("\n");
    return linksArray;
  } catch (error) {
    throw new Error(`Error reading the file: ${error.message}`);
  }
}

const Page = async () => {
  let words = await getWords();

  return <LinkPagination links={words} linksPerPage={100} />;
};

export default Page;
