const WordValidator = async () => {
    const handleCheckValidity = async (checkWord) => {
        let isValid = false;
        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${checkWord}&qe=sp&md=d&max=1&v=enwiki`);
            const data = await response.json();
            console.log("logging data");
            console.log(data[0].defs.length);
            isValid = data[0].defs.length > 0;
        } catch (error) {
            console.error('Error fetching data:', error);
            isValid = false; // Assume word is not valid if there's an error
        } 

        return isValid;
    };


    return (<>  
        {await handleCheckValidity("curator") ? 'Word is Valid' : 'word is inValid'}
       </>);
};

export default WordValidator;
