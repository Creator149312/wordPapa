'use client'
import React, { useState, useEffect } from 'react';

const WordChecker = () => {
    // Example usage:
    const wordsToCheck = ['apple', 'xyzz', 'banana', 'orange', 'lady'];

    const [inputWord, setInputWord] = useState('');
    const [isValid, setIsValid] = useState(null);

    const handleInputChange = (e) => {
        setInputWord(e.target.value);
    };

    const checkWordValidity = async () => {
        setIsValid(null); // Reset validity status
        // Trim input word and convert to lowercase before checking
        const trimmedWord = inputWord.trim().toLowerCase();
        if (trimmedWord !== '') {
            try {
                const response = await fetch(`https://api.datamuse.com/words?sp=${trimmedWord}&qe=sp&md=d&max=1&v=enwiki`);
                const data = await response.json();
                console.log(data[0].defs.length);
                setIsValid(data.length > 0);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsValid(false); // Assume word is not valid if there's an error
            }
        } else {
            setIsValid(false); // Empty string is not considered valid
        }
    };

    useEffect(() => {
        getValidWords();
    }, [inputWord]); // Run the validity check whenever the input word changes

    async function isWordValid(word) {
        // Trim input word and convert to lowercase before checking
        const trimmedWord = word.trim().toLowerCase();
        if (trimmedWord === '') {
            return false; // Empty string is not considered valid
        }

        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${trimmedWord}&qe=sp&md=d&max=1&v=enwiki`);
            const data = await response.json();
            if (data[0].hasOwnProperty("defs")) {
                return data[0].defs.length;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return false; // Assume word is not valid if there's an error
        }
    }

    async function filterValidWords(words) {
        const validWords = await Promise.all(words.map(async (word) => {
            const isValid = await isWordValid(word);
            return isValid ? word : null;
        }));
        return validWords.filter(Boolean);
    }

    async function getValidWords() {
        return filterValidWords(wordsToCheck)
            .then(validWords => {
                console.log('Valid words:', validWords);
                return validWords;
            })
            .catch(error => {
                console.error('Error:', error);
                return [];
            });
    }

    return (
        <div>
            <div>{getValidWords().then(validWords => {
                return validWords;
            })}</div>
        </div>
    );
};

export default WordChecker;
