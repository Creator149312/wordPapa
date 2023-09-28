
import RhymingWords from './RhymingWords';

export const metadata = {
  title: "Rhyming Words - Get Pefect Rhymes For Kids",
  description: "Use our Rhyming Words to find delightful array of words and phrases that rhyme with it. Use it craft engaging poems, songs, and activities that inspire kids to discover the beauty of language."
}

function RhymingWordsPage() {
  return (
    <div>
    <div className="row">
      {/* Left side: 9-column scrollable content */}
      <div>
        <div>
          <div >
              {/* Replace with your scrollable content */}
                    {/* Your content here */}
                    <RhymingWords />
                    {/* Continue adding content */}
                   <div className='m-3 p-3'>
                   <p>Introducing the Rhyming Words Generator, an easy to use tool designed to make learning fun and engaging for kids. </p>
                   <p>Users input a word, and the tool provides a list of words that share similar end sounds or phonetic patterns, aiding in the composition of engaging and rhythmically pleasing content.</p>
                   <p>This digital wizard is every teacher's secret weapon in the quest to nurture a love for language and rhyme in young minds.</p>
<p>With our Rhymes Generator, teaching becomes an enchanting journey. You simply input a word, and like magic, it produces a delightful array of words and phrases that rhyme with it. From short, snappy rhymes to longer, lyrical ones, it offers a treasure trove of possibilities, all at your fingertips.</p>
<p>Imagine the joy on a child's face as they explore words that dance to the same rhythmic beat. </p>
<p>This tool transforms ordinary lessons into captivating adventures, helping teachers instill the magic of language in their students. It's not just about learning words; it's about nurturing creativity, building vocabulary, and fostering a lifelong love for reading and writing.</p>
<p>It is more than a tool; it's a bridge to imagination. It unlocks the doors to a world of wordplay, where learning feels like a game. Parents can use it to craft engaging poems, songs, and activities that inspire kids to discover the beauty of language, one rhyme at a time.</p>
<p>In a classroom It's a tool that empowers educators to plant the seeds of literacy, imagination, and self-expression in the hearts of their students, one rhyming word at a time.</p>
                    </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default RhymingWordsPage;
