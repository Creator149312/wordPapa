const ptitle = "Word Dictionary: Find Definition & Meanings of English Words";

export const metadata = {
  title: ptitle,
  description:
    "This simple word dictionary provides a simple and intuitive interface for users to look up the definitions of words or phrases and access example sentences.",
};

function WordsPage() {
  return (
    <div>
      <div className="row">
        {/* Left side: 9-column scrollable content */}
        <div>
          <div>
            <div>
              {/* Replace with your scrollable content */}
              {/* Your content here */}
              {/* Continue adding content */}
              <div className="m-3 p-3">
                <h1>{ptitle}</h1>
                <p>
                  This web page serves as a user-friendly word dictionary. It
                  provides a simple and intuitive interface for users to look up
                  the definitions of words or phrases and access example
                  sentences. To find the definition and sentence examples for a
                  specific word or phrase, enter the word in the input field and
                  click the "Search" button. The page will then display the
                  word's definition and a list of sentence examples, providing
                  users with a clear understanding of its usage.
                </p>
                <p>
                  This dictionary page can be connected to an external
                  dictionary API service, allowing it to fetch accurate and
                  up-to-date definitions and sentences for a wide range of words
                  and phrases. Users can quickly and conveniently access word
                  information for learning, reference, or writing purposes.
                </p>
                <p>
                  The user interface is clean and easy to navigate, making it
                  suitable for students, writers, or anyone looking to enhance
                  their vocabulary and language comprehension.
                </p>
              </div>
              <div className="m-3 p3">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordsPage;
