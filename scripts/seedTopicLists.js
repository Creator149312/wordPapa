/**
 * Seed script: Pre-built topic vocabulary lists
 * Run with: node scripts/seedTopicLists.js
 *
 * Creates 6 curated topic lists (Animals, Food, Business, Law, Technology, Sports)
 * tagged so they appear under the /lists?tag= filter.
 *
 * Idempotent: skips lists whose title already exists in the DB.
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Inline schema (mirrors models/list.js) ──────────────────────────────────
const wordDataSchema = new mongoose.Schema({ word: String, wordData: String });
const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    words: { type: [wordDataSchema], default: [] },
    createdBy: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);
const List = mongoose.models.List || mongoose.model("List", listSchema);

// ── Topic list data ──────────────────────────────────────────────────────────
const TOPIC_LISTS = [
  {
    title: "Common Animals",
    description: "Essential vocabulary for animals you'll encounter every day — from household pets to wild creatures.",
    tags: ["animals"],
    words: [
      { word: "predator", wordData: "An animal that hunts and feeds on other animals." },
      { word: "prey", wordData: "An animal that is hunted and eaten by another animal." },
      { word: "habitat", wordData: "The natural environment where an animal lives." },
      { word: "nocturnal", wordData: "Active mainly during the night, like owls and bats." },
      { word: "mammal", wordData: "A warm-blooded animal that feeds its young with milk." },
      { word: "carnivore", wordData: "An animal that eats only meat." },
      { word: "herbivore", wordData: "An animal that eats only plants." },
      { word: "omnivore", wordData: "An animal that eats both plants and meat." },
      { word: "migration", wordData: "The seasonal movement of animals to a different region." },
      { word: "hibernate", wordData: "To spend winter in a dormant, sleep-like state." },
      { word: "domesticated", wordData: "Tamed and kept by humans as a pet or farm animal." },
      { word: "endangered", wordData: "A species at risk of becoming extinct." },
      { word: "amphibian", wordData: "A cold-blooded animal that lives both in water and on land, e.g. frogs." },
      { word: "reptile", wordData: "A cold-blooded, scaly animal such as a snake or lizard." },
      { word: "primate", wordData: "The group of mammals including monkeys, apes, and humans." },
      { word: "venomous", wordData: "Capable of injecting poison through a bite or sting." },
      { word: "flock", wordData: "A group of birds or sheep moving together." },
      { word: "pack", wordData: "A group of wolves or other social mammals." },
    ],
  },
  {
    title: "Food & Drinks Vocabulary",
    description: "Words for describing food, cooking methods, flavours, and dining — useful for everyday conversation and travel.",
    tags: ["food"],
    words: [
      { word: "cuisine", wordData: "A style of cooking associated with a particular country or region." },
      { word: "savoury", wordData: "Food that is salty or spicy in flavour, not sweet." },
      { word: "pungent", wordData: "Having a strong, sharp smell or taste." },
      { word: "fermented", wordData: "Food preserved or flavoured through a chemical breakdown by bacteria, e.g. yoghurt." },
      { word: "garnish", wordData: "A small item of food added to a dish for decoration." },
      { word: "simmer", wordData: "To cook gently just below boiling point." },
      { word: "marinate", wordData: "To soak food in a seasoned liquid before cooking." },
      { word: "gluten", wordData: "A protein found in wheat and other grains." },
      { word: "palate", wordData: "A person's ability to distinguish different flavours." },
      { word: "appetiser", wordData: "A small dish served before the main course." },
      { word: "staple", wordData: "A basic food that forms the main part of a diet, e.g. rice or bread." },
      { word: "delicacy", wordData: "A special food that is considered rare or especially fine." },
      { word: "broth", wordData: "A thin, flavoured liquid made by simmering meat or vegetables." },
      { word: "caramelise", wordData: "To heat sugar until it browns and develops a rich flavour." },
      { word: "portion", wordData: "The amount of food served to one person." },
      { word: "vegan", wordData: "A diet or lifestyle that avoids all animal products." },
      { word: "saturated fat", wordData: "A type of fat found in animal products, associated with heart disease." },
    ],
  },
  {
    title: "Business English Essentials",
    description: "Core vocabulary for the workplace — meetings, negotiations, finance, and professional communication.",
    tags: ["business"],
    words: [
      { word: "stakeholder", wordData: "A person or group with an interest in a company's decisions." },
      { word: "leverage", wordData: "Using borrowed capital or an advantage to increase returns." },
      { word: "pivot", wordData: "To shift a business strategy in response to market changes." },
      { word: "benchmark", wordData: "A standard or point of reference used to evaluate performance." },
      { word: "due diligence", wordData: "A thorough investigation before signing a deal or contract." },
      { word: "ROI", wordData: "Return on Investment — a measure of financial gain relative to cost." },
      { word: "scalable", wordData: "Able to grow in size or volume without proportional increases in cost." },
      { word: "synergy", wordData: "The combined effect of two things working together is greater than each alone." },
      { word: "revenue", wordData: "The total income generated by a business before expenses." },
      { word: "forecast", wordData: "A prediction of future business performance based on data." },
      { word: "agenda", wordData: "A list of topics to be discussed at a meeting." },
      { word: "outsource", wordData: "To hire an external company to do work instead of doing it in-house." },
      { word: "liability", wordData: "A legal or financial responsibility or obligation." },
      { word: "equity", wordData: "Ownership value in a company after liabilities are deducted." },
      { word: "turnaround", wordData: "A successful effort to reverse a failing business situation." },
      { word: "minutes", wordData: "The written record of what was discussed and decided at a meeting." },
      { word: "merger", wordData: "The combination of two companies into a single new entity." },
      { word: "procurement", wordData: "The process of buying goods or services for a business." },
    ],
  },
  {
    title: "Legal & Law Vocabulary",
    description: "Important legal terms to help you understand contracts, court proceedings, and your rights.",
    tags: ["law"],
    words: [
      { word: "statute", wordData: "A written law passed by a legislative body." },
      { word: "plaintiff", wordData: "The person who brings a case against another in a court of law." },
      { word: "defendant", wordData: "A person who is accused or sued in a court of law." },
      { word: "verdict", wordData: "The decision made by a jury or judge at the end of a trial." },
      { word: "acquittal", wordData: "A formal declaration that someone is not guilty of a crime." },
      { word: "affidavit", wordData: "A written statement confirmed by oath, used as evidence in court." },
      { word: "jurisdiction", wordData: "The official power to make legal decisions in a particular area." },
      { word: "precedent", wordData: "An earlier legal decision that guides future cases." },
      { word: "subpoena", wordData: "A legal order requiring someone to attend court or produce evidence." },
      { word: "indictment", wordData: "A formal charge or accusation of a serious crime." },
      { word: "injunction", wordData: "A court order requiring a party to do or stop doing something." },
      { word: "liability", wordData: "Legal responsibility for something, such as damages or debt." },
      { word: "plea", wordData: "A formal statement of guilty or not guilty made by the defendant." },
      { word: "tort", wordData: "A wrongful act leading to civil legal liability." },
      { word: "due process", wordData: "The fair treatment guaranteed by law in judicial proceedings." },
      { word: "habeas corpus", wordData: "A legal right requiring a person to be brought before a judge." },
    ],
  },
  {
    title: "Technology & Digital Life",
    description: "Essential vocabulary for the digital world — from software concepts to internet culture.",
    tags: ["technology"],
    words: [
      { word: "algorithm", wordData: "A step-by-step procedure for solving a problem or making a decision." },
      { word: "bandwidth", wordData: "The maximum rate of data transfer across a network." },
      { word: "cloud computing", wordData: "Storing and accessing data and programs over the internet." },
      { word: "encryption", wordData: "Converting data into a coded format to prevent unauthorised access." },
      { word: "API", wordData: "Application Programming Interface — a way for software programs to communicate." },
      { word: "latency", wordData: "The delay before data begins to transfer, measured in milliseconds." },
      { word: "cache", wordData: "Temporary storage area for frequently accessed data." },
      { word: "open source", wordData: "Software with source code freely available for anyone to view or modify." },
      { word: "machine learning", wordData: "A type of AI that learns from data without being explicitly programmed." },
      { word: "cybersecurity", wordData: "The practice of protecting systems and networks from digital attacks." },
      { word: "phishing", wordData: "A fraudulent attempt to steal sensitive information via fake emails or websites." },
      { word: "scalability", wordData: "A system's ability to handle increased load without degrading performance." },
      { word: "iteration", wordData: "Repeating a process to achieve a desired result, common in software development." },
      { word: "database", wordData: "An organised collection of structured data, typically stored electronically." },
      { word: "UI/UX", wordData: "User Interface / User Experience — design disciplines focused on usability." },
      { word: "debug", wordData: "To find and fix errors in computer code." },
      { word: "protocol", wordData: "A set of rules governing data communication between devices." },
    ],
  },
  {
    title: "Sports & Athletics Vocabulary",
    description: "Words used in sports, competitions, and physical training — from amateur games to professional athletics.",
    tags: ["sports"],
    words: [
      { word: "stamina", wordData: "The ability to sustain prolonged physical or mental effort." },
      { word: "agility", wordData: "The ability to move quickly and easily." },
      { word: "elimination", wordData: "Being knocked out of a tournament or competition." },
      { word: "qualifier", wordData: "A match or event that determines entry to the main competition." },
      { word: "referee", wordData: "An official who enforces the rules during a sports match." },
      { word: "penalty", wordData: "A punishment given to a team or player for breaking the rules." },
      { word: "tactics", wordData: "A plan or strategy employed to achieve success in a sport." },
      { word: "sprint", wordData: "To run at full speed over a short distance." },
      { word: "substitute", wordData: "A player who replaces another during a game." },
      { word: "overtime", wordData: "Extra time played when a match is tied at the end of normal time." },
      { word: "podium", wordData: "The raised platform where medal winners stand at a competition." },
      { word: "momentum", wordData: "The force or speed gained by a team or player during a game." },
      { word: "baton", wordData: "A short stick passed between runners in a relay race." },
      { word: "underdog", wordData: "The competitor expected to lose a contest." },
      { word: "endurance", wordData: "The ability to sustain an activity over a long period." },
      { word: "foul", wordData: "An unfair act by a player that violates the rules." },
      { word: "league", wordData: "A group of sports teams that compete against each other." },
    ],
  },
];

// ── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.\n");

  let created = 0;
  let skipped = 0;

  for (const listData of TOPIC_LISTS) {
    const existing = await List.findOne({ title: listData.title });
    if (existing) {
      console.log(`⏭  Skipped  "${listData.title}" (already exists)`);
      skipped++;
      continue;
    }

    await List.create({
      ...listData,
      createdBy: "system@wordpapa.com",
    });
    console.log(`✅ Created  "${listData.title}" (${listData.words.length} words, tags: [${listData.tags.join(", ")}])`);
    created++;
  }

  console.log(`\n📦 Done — ${created} created, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
