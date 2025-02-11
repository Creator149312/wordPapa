'use client'
import { useState } from "react";
import NOUN from "../NOUNS";
import FINALCLEANWORDS from "../FINALCLEANWORDS";

export default function Home() {
  const [arrayA, setArrayA] = useState(FINALCLEANWORDS);
  const [arrayB, setArrayB] = useState(NOUN);
  const [result, setResult] = useState([]);

  console.log("Console Array A", arrayA.length);
  console.log("Console Array B", arrayB.length);

  //   remove all the elements from A that are present in B
  const removeElements = (arrA, arrB) => {
    return arrA.filter((item) => !arrB.includes(item));
  };
  
  const filterWords = (arr) => {
    // Regular expression to match words that only contain letters (a-z, A-Z)
    return arr.filter(item => /^[A-Za-z]+$/.test(item));
  };

  const handleRemove = () => {
    const updatedArray = removeElements(arrayA, arrayB);
    const filteredArray = filterWords(updatedArray);
    setResult(filteredArray);
  };

  return (
    <div>
    </div>
  );
}
