/**
 * wordClues.js
 *
 * Micro-narratives and real-world cloze clues for WordPapa Hangman.
 * If a word does not have an explicit scenario, a context-rich fallback
 * is synthesized using its hint/definition.
 */

export const CURATED_SCENARIOS = {
  // Elementary / Nature / Objects
  SUN: "Early in the morning, the golden ________ rose over the hills and warmed the chilled earth.",
  SKY: "Looking up through the telescope, we saw distant stars scattered across the dark night ________.",
  CLOUD: "A sudden gray ________ drifted across the afternoon sun, casting a cool shadow over the park.",
  RAIN: "The dry soil thirstily absorbed the gentle evening ________ after weeks of summer heat.",
  WIND: "A brisk mountain ________ rustled the pine needles and carried the scent of fresh snow.",
  MOON: "Casting a pale silver glow on the ocean waves, the full ________ guided the sailors home.",
  STAR: "Sailors before compasses steered their ships by following the brightest North ________.",
  AIR: "Taking a deep breath of crisp morning ________, the hiker felt instantly energized.",
  CAT: "Curled up in a warm patch of sunlight on the rug, the sleepy ________ began to purr softly.",
  DOG: "Wagging its tail enthusiastically at the front door, the loyal ________ welcomed the family home.",

  // Intermediate / Actions / Concepts
  PRAYER: "In the quiet temple hall before dawn, she bowed her head in a silent ________ for peace.",
  CHANT: "The rhythmic ________ of the monks echoed through the stone courtyard, filling the air with stillness.",
  RITUAL: "Every Sunday morning, making fresh filter coffee was a cherished family ________ that nobody rushed.",
  KING: "Wearing the ancient gold crown, the wise ________ ruled the territory with fairness and calm patience.",
  ADVISOR: "Before declaring a new trade policy, the minister consulted his most trusted economic ________.",
  SOLDIER: "Trained to protect the frontier through harsh winters, the disciplined ________ stood vigilant watch.",
  ORATOR: "Captivating hundreds in the town square, the eloquent ________ spoke with fiery conviction and grace.",
  FOREST: "Sunlight filtered through the thick canopy of leaves as we hiked deeper into the quiet evergreen ________.",
  STREAM: "Fresh cold water cascaded over polished pebbles in the babbling mountain ________.",
  VALLEY: "Nestled between two towering mountain ridges lay a lush green ________ dotted with wildflowers.",
  WILDERNESS: "Far beyond city roads and phone reception, they camped under the stars in the untamed ________.",
  SILENCE: "When the orchestra finished the symphony, a profound second of awe-filled ________ preceded the applause.",
  JUSTICE: "The courtroom was packed as citizens gathered hoping that true ________ would finally be served.",
  FREEDOM: "After months of unjust confinement, stepping outside into open air meant precious, hard-won ________.",
  HONOR: "He chose to tell the difficult truth because personal ________ mattered more than an easy escape.",
  COURAGE: "It took immense moral ________ for the young scientist to challenge decades of accepted dogmas.",
  SUCCESS: "Working late every night for three years, her startup finally achieved international ________.",
  FLOWING: "Melting glacier ice kept the mighty river ________ swiftly toward the distant sea.",
  SAILING: "Catching the western trade winds, their yacht was ________ gracefully toward the tropical harbor.",
  CURRENT: "Swimmers were warned to stay close to shore because of a powerful underwater ________.",
  RIPPLES: "Dropping a small stone into the mirror-calm pond created widening circular ________ across the surface.",

  // Advanced / Academic / SAT
  EPHEMERAL: "Morning dew on a spider's web is exquisitely beautiful but entirely ________, vanishing with the first sun.",
  SERENDIPITY: "Discovering penicillin by accident when a petri dish was left open is one of medicine's greatest acts of ________.",
  METICULOUS: "The watchmaker spent three hours adjusting a single microscopic spring with ________ precision.",
  PRAGMATIC: "Rather than chasing idealistic theories, the engineer took a strictly ________ approach to solve the outage.",
  UBIQUITOUS: "Within just two decades, smartphones went from luxury novelties to ________ tools used everywhere.",
  ELOQUENT: "Her ________ defense of civil liberties moved several jury members to tears.",
  RESILIENT: "Despite losing their crops to the frost, the ________ farming community rebuilt before spring.",
  AMBIGUOUS: "The instructions were frustratingly ________, leaving the students confused about how to begin.",
  ANOMALY: "Finding sub-zero ice readings in the Sahara desert would be a baffling geological ________.",
  BENEVOLENT: "The retired doctor spent her weekends offering free care as a ________ service to the village.",
  CANDID: "In a refreshingly ________ interview, the CEO admitted mistakes and detailed plans for improvement.",
  DILIGENT: "Through months of ________ library research, the historian uncovered long-lost letters from the revolution.",
  ENIGMA: "The sudden disappearance of the ancient civilization remains an unsolved historical ________.",
  FORTITUDE: "Facing harsh criticism from peers, Galileo displayed extraordinary intellectual ________.",
  GREGARIOUS: "Always the life of the party, her ________ personality ensured she made friends wherever she traveled.",
};

/**
 * Returns a micro-narrative sentence for a word with a cloze blank.
 * If no curated scenario exists, synthesizes a high-quality contextual sentence from hint and category.
 */
export function getContextScenario(word, hint = "", category = "") {
  if (!word) return null;
  const upperWord = word.toUpperCase().trim();

  // 1. Direct curated scenario
  if (CURATED_SCENARIOS[upperWord]) {
    return CURATED_SCENARIOS[upperWord];
  }

  // 2. Synthesize using category & hint
  const blank = "__________";
  if (hint && hint.length > 5) {
    const cleanHint = hint.replace(/\.$/, "").toLowerCase();
    if (category) {
      return `Context (${category}): Think of something that is ${cleanHint} — can you complete the puzzle: ${blank}?`;
    }
    return `In this context: "${cleanHint}" — the missing word is ${blank}.`;
  }

  if (category) {
    return `In the world of ${category}, the missing concept is ${blank}.`;
  }

  return `Solve the puzzle to reveal the word: ${blank}.`;
}
