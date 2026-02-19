import OpenAI from "openai";
import Word from "@models/word";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { WORDMAP } from "../WORDMAP";
import AddToMyListsButton from "@components/AddToMyListsButton";
import { connectMongoDB } from "@lib/mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const revalidate = 3600 * 24 * 60; // revalidate every 2 months

let siteURL =
  process.env.NODE_ENV === "production"
    ? "https://words.englishbix.com"
    : "http://localhost:3000";

export async function generateMetadata({ params }) {
  let slug = decodeURIComponent(params.word);
  let word = slug;

  const ifInWordMap = WORDMAP[word.replace(/[ -]/g, "")];
  if (!ifInWordMap) {
    return {
      title: "Try a new word",
      description:
        "This word is not available in our word map. Please try another.",
      robots: { index: false },
    };
  }

  const wordData = await Word.findOne({ word });

  const titleStr = `${word.toUpperCase()} Definition with Sentence Examples`;
  const descriptionStr = wordData
    ? `Learn the meaning of "${word}" as a ${wordData.entries
        .map((e) => e.pos)
        .join(", ")}. Includes definitions and example sentences.`
    : `Find what does "${word}" mean and see sentence examples using "${word}".`;

  let canonical = `${siteURL}/define/${slug}`;

  return {
    title: titleStr,
    description: descriptionStr,
    alternates: { canonical },
    robots: { index: false },
  };
}

// Utility function to validate single words
function isSingleWord(word) {
  const regex = /^[A-Za-z]+$/; // only alphabetic
  return regex.test(word);
}

// Utility function to validate parsed JSON
function isValidWordData(parsed) {
  if (!parsed || !Array.isArray(parsed.entries)) return false;

  return parsed.entries.every(
    (entry) =>
      entry.definition &&
      typeof entry.definition === "string" &&
      Array.isArray(entry.examples) &&
      entry.examples.length > 0,
  );
}

export default async function DefineWordPage({ params }) {
  await connectMongoDB();
  const decodedWord = decodeURIComponent(params.word);
  const ifInWordMap = WORDMAP[decodedWord.replace(/[ -]/g, "")];

  if (!ifInWordMap) {
    return (
      <Card className="m-2">
        <CardHeader>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">
            {decodedWord}
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-base md:text-lg text-gray-700">
            Word not found — please try another.
          </p>
        </CardContent>
      </Card>
    );
  }

  let wordData = await Word.findOne({ word: decodedWord });

  if (!wordData) {
    const prompt = `
    For the word "${decodedWord}", provide definitions grouped by part of speech (POS).
    For each POS, include:
    - POS (noun, verb, adjective, etc.)
    - A simple definition
    - 3 short example sentences

    Output as JSON:
    {
      "entries": [
        {
          "pos": "noun|verb|adjective|...",
          "definition": "...",
          "examples": ["...", "...", "..."]
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let parsed;
    try {
      parsed = JSON.parse(completion.choices[0].message.content);
    } catch {
      parsed = null;
    }

    // Only store if JSON is valid, has entries, and word is single
    if (isValidWordData(parsed) && isSingleWord(decodedWord)) {
      wordData = await Word.create({
        word: decodedWord,
        entries: parsed.entries,
      });
    } else {
      // fallback: show data but don't store
      wordData = {
        word: decodedWord,
        entries: parsed?.entries || [],
      };
    }
  }

  return (
    <div className="m-2">
      <CardHeader className="list-heading-container justify-between flex-row">
        <h1 className="text-5xl font-extrabold">{decodedWord}</h1>
        {wordData.entries.length > 0 && (
          <AddToMyListsButton
            word={decodedWord}
            definition={wordData.entries[0].definition}
          />
        )}
      </CardHeader>
      <CardContent className="card-body">
        {wordData.entries.length > 0 ? (
          wordData.entries.map((entry, idx) => (
            <div key={idx} className="mb-6">
              <p className="text-lg font-semibold">
                <strong>POS:</strong> {entry.pos}
              </p>
              <p className="text-lg font-normal mb-2">
                <strong>Definition:</strong> {entry.definition}
              </p>
              <div className="mt-4" id={`examples-${idx}`}>
                <h2 className="text-2xl font-bold">Sentence Examples</h2>
                <ul className="m-2 p-2 text-lg list-disc">
                  {entry.examples.map((sent, i) => (
                    <li key={i} className="p-0.5">
                      {sent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500">No valid definitions found.</p>
        )}
      </CardContent>
    </div>
  );
}
