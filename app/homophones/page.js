
import Homophones from "./Homophones";

export const metadata = {
    title: "Homophones Generator - Find Homophones for English Words",
    description: "Homophones Generator is a linguistic tool designed to produce a list of all the homophones associated with an English word."
  }

function HomophonesPage() {
  return (
    <div>
    <div className="row">
      {/* Left side: 9-column scrollable content */}
      <div>
        <div>
          <div >
             {/* Replace with your scrollable content */}
              {/* Your content here */}
              <Homophones />
              {/* Continue adding content */}
              <div className="m-3 p-3">
                <p>
                  A Homophones Generator is a linguistic tool designed to take
                  an input English word and produce a list of all the homophones
                  associated with that word.
                </p>
                <p>
                  As you all know, Homophones are words that sound the same but
                  have different meanings and spellings. Our tool is valuable
                  for writers, editors, and language enthusiasts as it helps
                  them identify and differentiate between words that share
                  identical or similar pronunciations but have distinct
                  interpretations or uses in written or spoken language.
                </p>
                <p>
                  By generating a comprehensive list of homophones for a given
                  word, It helps us avoid confusion thereby enhancing
                  communication, reducing spelling and usage errors, and
                  improving the overall quality of written and spoken content.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default HomophonesPage;
