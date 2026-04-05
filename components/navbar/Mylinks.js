// Mylinks.js
export const links = [
  {
    name: "Arena",
    items: [
      { name: "Leaderboard", link: "/leaderboard" },
      { name: "Hangman Game", link: "/games/hangman" },
    ],
  },
  {
    name: "Lab",
    items: [
      {
        name: "Dictionaries",
        submenu: [
          { name: "Word Dictionary", link: "/define" },
          { name: "Rhyming Dictionary", link: "/rhyming-words" },
          { name: "Adjective Dictionary", link: "/browse/adjectives" },
          { name: "Verb Dictionary", link: "/browse/verbs" },
          { name: "Noun Dictionary", link: "/browse/nouns" },
          { name: "Phrasal Verbs", link: "/phrasal-verbs" },
        ],
      },
      {
        name: "Tools",
        submenu: [
          { name: "Word Unscrambler", link: "/word-finder" },
          { name: "Adjectives Finder", link: "/adjectives" },
          { name: "Thesaurus", link: "/thesaurus" },
          { name: "Syllable Counter", link: "/syllables" },
          { name: "Spin Wheel", link: "https://www.spinpapa.com" },
        ],
      },
    ],
  },
  {
    name: "Library",
    items: [
      { name: "Lists", link: "/lists" },
    ],
  },
  // {
  //   name: "Profile",
  //   items: [
  //     { name: "My Profile", link: "/dashboard" },
  //     { name: "Settings", link: "/settings" },
  //   ],
  // },
];
