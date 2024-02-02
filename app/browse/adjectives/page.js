
import ADJECTIVE from '../ADJECTIVE_WORDS';

const Page = async () => {
  let words = await getWords();

  let someWords = [];
  return (<>
    Explore Adjective Dictionary
  </>);
};

export default Page;