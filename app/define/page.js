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
                  Introducing the fantastic Word Dictionary tool designed just
                  for you! Imagine having a magical guide that unravels the
                  mysteries of words, helping you explore their meanings, roles
                  in sentences, and much more. The Word Dictionary is like a
                  friendly wizard for your vocabulary journey.
                </p>

                <p>
                  When you enter a word into the Word Dictionary, it's as if
                  you're whispering a secret incantation, and the wizard opens a
                  treasure trove of linguistic wonders. First and foremost, it
                  reveals the <strong>Definition</strong> of the word, providing
                  a clear and simple explanation. For instance, if you're
                  curious about what "elephant" means, it will say something
                  like, "A mammal having a trunk, and two large ivory tusks jutting from the upper jaw."
                </p>

                <p>
                  But that's not all – our magical tool goes beyond just
                  definitions. It's your go-to guide for understanding a word's
                  role in sentences. The Word Dictionary unveils the <strong>Parts of Speech</strong>, helping you discover whether
                  a word is a noun (like "dinosaur"), a verb (like "run"), an adjective (like "brown") or
                  something else entirely. Understanding this magical code
                  unlocks the secrets of how words dance together in the
                  language ballet.
                </p>

                <p>
                  And just when you thought the magic couldn't get any better,
                  the Word Dictionary presents <strong>Sentence Examples</strong>.
                  It conjures up real-life sentences where the word plays a
                  starring role. If you were investigating "rocket," you might
                  see sentences like "The rocket was shooted in the sky." letting
                  you visualize how the word 'rocket' is put into action.
                </p>

                <p>
                  In essence, the Word Dictionary is your linguistic companion, a
                  trusty wizard that transforms the ordinary act of looking up a
                  word into a magical journey of discovery. With its help, the
                  vast realm of words becomes an enchanting landscape where
                  understanding and imagination intertwine. So, let your
                  curiosity soar as you embark on a language adventure with the
                  Word Dictionary – your key to unlocking the secrets of the
                  written world!
                </p>
                <p>
                  The user interface is clean and easy to navigate, making it
                  suitable for students, writers, or anyone looking to enhance
                  their vocabulary and language comprehension. 
                </p>
              </div>
              <div className="m-3 p3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordsPage;
