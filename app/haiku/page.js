import HaikuChecker from "./HaikuChecker";

export const metadata = {
  title: "Haiku Syllable Counter for Japense Poems",
  description: "Use our Haiku Syllable Checker is used validate a text based on traditional structure of a syllable pattern of 5-7-5 a Haiku poems and count syllables in them."
}

function HaikuPage() {
  return (
    <div>
      <div className="row">
        <div>
          <div>
            <div>
              <HaikuChecker />
              <div className="m-3 p-3">
                <p>
                  <strong>HaikuChecker</strong> is a tool used to validate
                  whether a given piece of text adheres to the traditional
                  structure of a Haiku poem. Haiku is a form of Japanese poetry
                  characterized by its three-line structure with a syllable
                  pattern of 5-7-5, where the first line has 5 syllables, the
                  second line has 7 syllables, and the third line has 5
                  syllables.
                </p>
                <h2>Why HaikuChecker is Used?</h2>
                <ul>
                  <li>
                    <strong>Validation:</strong> It verifies if a given text
                    follows the strict syllable pattern of a Haiku. This is
                    particularly helpful for poets and writers who want to
                    ensure that their poems conform to the traditional Haiku
                    structure.
                  </li>
                  <li>
                    <strong>Learning Tool:</strong> HaikuChecker can be used as
                    an educational tool for those learning about Haiku poetry.
                    It helps students and enthusiasts understand the importance
                    of syllable count in creating Haikus.
                  </li>
                  <li>
                    <strong>Creative Writing:</strong> Writers and poets seeking
                    to create Haikus can use HaikuChecker to check and refine
                    their compositions, ensuring that they meet the syllable
                    requirements.
                  </li>
                  <li>
                    <strong>Feedback:</strong> It provides instant feedback on
                    whether a given piece of text qualifies as a Haiku, helping
                    users refine their poetic skills and achieve the desired
                    structure in their work.
                  </li>
                  <li>
                    <strong>Inspiration:</strong> HaikuChecker can inspire
                    creativity by encouraging users to experiment with Haiku
                    poetry and discover the beauty of concise, evocative
                    expression.
                  </li>
                </ul>
                <p>
                  Overall, HaikuChecker is a simple yet valuable tool for both
                  beginners and experienced poets, aiding in the creation and
                  validation of Haiku poems, a beloved and enduring form of
                  poetic expression.
                </p>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HaikuPage;
