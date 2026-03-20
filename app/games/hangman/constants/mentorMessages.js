// constants/mentorMessages.js

export const MENTOR_MESSAGES = {
  // Ranks 1-3: Encouraging and Soft
  BEGINNER: [
    "HMM... TOUGH ONE? I'VE GOT A CLUE FOR YOU!",
    "DON'T WORRY, LITTLE ONE. LET'S LOOK AT THIS HINT.",
    "YOU'RE DOING GREAT! NEED A TINY NUDGE?",
    "KEEP GOING! THE WORDS ARE JUST FRIENDS YOU HAVEN'T MET."
  ],
  
  // Ranks 4-7: Academic and Analytical
  SCHOLAR: [
    "A MOMENTARY LAPSE? LET'S REFRESH YOUR MEMORY.",
    "THE VOCABULARY IS VAST, BUT THE HINT IS NEAR.",
    "STAY SHARP, SCHOLAR. HERE IS A POINT OF REFERENCE.",
    "ANALYZING... IT SEEMS A CLUE MIGHT AID YOUR PROGRESS."
  ],
  
  // Ranks 8-10: Respectful and Sage-like
  MASTER: [
    "EVEN THE SAGES SEEK GUIDANCE SOMETIMES.",
    "A CHALLENGE WORTHY OF YOUR SKILL. OBSERVE THIS CLUE.",
    "THE PATH IS WINDING. LET THIS HINT BE YOUR COMPASS.",
    "MASTERY REQUIRES PATIENCE. TAKE A MOMENT WITH THIS HINT."
  ],
  
  // Special Message for when they are on a 10+ streak
  STREAK_PROTECTOR: [
    "DON'T LET THE STREAK BREAK! USE THE CLUE!",
    "YOUR MOMENTUM IS BRAVE. STAY FOCUSED.",
    "PROTECT THE STREAK! HERE IS A HELPING HAND."
  ]
};

/**
 * Helper to get a random message based on user rank name
 */
export const getMentorMessage = (rankName, isHighStreak = false) => {
  if (isHighStreak) {
    return MENTOR_MESSAGES.STREAK_PROTECTOR[
      Math.floor(Math.random() * MENTOR_MESSAGES.STREAK_PROTECTOR.length)
    ];
  }

  // Grouping the ranks into the three tiers
  const beginnerRanks = ["Infant", "Toddler", "Student"];
  const scholarRanks = ["Scholar", "Explorer", "Wordsmith", "Adept"];
  
  if (beginnerRanks.includes(rankName)) {
    return MENTOR_MESSAGES.BEGINNER[
      Math.floor(Math.random() * MENTOR_MESSAGES.BEGINNER.length)
    ];
  } else if (scholarRanks.includes(rankName)) {
    return MENTOR_MESSAGES.SCHOLAR[
      Math.floor(Math.random() * MENTOR_MESSAGES.SCHOLAR.length)
    ];
  } else {
    return MENTOR_MESSAGES.MASTER[
      Math.floor(Math.random() * MENTOR_MESSAGES.MASTER.length)
    ];
  }
};