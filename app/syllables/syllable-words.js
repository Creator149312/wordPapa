const syllableWordsArray = [
  "abacus",
  "abet",
  "ableism",
  "about",
  "abroad",
  "abstain",
  "academic",
  "academician",
  "accenture",
  "accessibility",
  "accessible",
  "accessories",
  "acclimatized",
  "account",
  "accurately",
  "accused",
  "achievable",
  "ackee",
  "acquaintance",
  "acre",
  "activities",
  "adamant",
  "addition",
  "address",
  "administering",
  "admiration",
  "admit",
  "admonish",
  "adonic",
  "adventurous",
  "aeroplane",
  "aforementioned",
  "again",
  "agree",
  "agriculture",
  "airworthiness",
  "alarm",
  "alas",
  "alert",
  "align",
  "allantoin",
  "allosaurus",
  "almost",
  "alphabet",
  "also",
  "altitude",
  "aluminum-foil",
  "always",
  "amazed",
  "amazing",
  "ambulance",
  "ame",
  "among",
  "anatomically",
  "ancient",
  "ancillary",
  "anemone",
  "anew",
  "animal",
  "anniversary",
  "announcement",
  "anointed",
  "another",
  "anthrax",
  "anymore",
  "apparently",
  "application",
  "architect",
  "arcus",
  "area",
  "arise",
  "arithmetic",
  "arm",
  "armadillo",
  "arrive",
  "arrogant",
  "arroyo",
  "artier",
  "asked",
  "asleep",
  "asparagus",
  "assemblywoman",
  "assistance",
  "assumpsit",
  "astereognosis",
  "asthma",
  "astonish",
  "astrology",
  "astronomy",
  "ataraxy",
  "athenaeum",
  "atlas",
  "attempted",
  "attention",
  "attract",
  "attracted",
  "atypical",
  "audible",
  "auditorium",
  "aunty",
  "auspicious",
  "austere",
  "authority",
  "autobiography",
  "autograph",
  "avoidance",
  "awake",
  "awesome",
  "babbling",
  "backyard",
  "bacon",
  "bacteremia",
  "bad",
  "bad-debt",
  "baffled",
  "bahamas",
  "bakery",
  "balk",
  "balloon",
  "ballot",
  "bamboo",
  "bangalore",
  "bank",
  "bantam",
  "barrier-strip",
  "batch",
  "bathroom",
  "beach",
  "beacon",
  "beat-up",
  "beauty",
  "bedroom",
  "beehive",
  "beekeeper",
  "began",
  "beggar",
  "beginning",
  "belarusian",
  "belief",
  "believe",
  "belize",
  "beth",
  "beware",
  "bin",
  "biological",
  "biology",
  "bitch",
  "blackish",
  "blair",
  "blazing",
  "bloom",
  "blooming",
  "bloomington",
  "blouse",
  "blowing",
  "blurred",
  "board",
  "bonaire",
  "book",
  "bored",
  "bottom",
  "bought",
  "box",
  "bracelet",
  "brainwave",
  "bramble",
  "brawl",
  "breach",
  "breadfruit",
  "breakout",
  "bribe",
  "bride",
  "brightly",
  "brilliance",
  "bronchopneumonia",
  "brought",
  "brown",
  "brownie",
  "buccal-cavity",
  "bulky",
  "bun",
  "bungalow",
  "burglar",
  "butterfly",
  "butyric",
  "cabbage",
  "cactus",
  "calcutta",
  "calendar",
  "calm",
  "camaraderie",
  "camping",
  "candy",
  "cankerworm",
  "canned-foods",
  "cannot",
  "cant",
  "cantankerous",
  "cantonese",
  "capitation",
  "captain",
  "cardboard",
  "carelessly",
  "caring",
  "carnival",
  "carpet",
  "casuistry",
  "cat",
  "catastrophically",
  "causally",
  "cease",
  "ceaseless",
  "celebrate",
  "centripetal-force",
  "cereal",
  "changed",
  "chanting",
  "charity",
  "charming",
  "chasm",
  "cheat",
  "chemistry",
  "chess",
  "chill",
  "chirrup",
  "chlorhexidine",
  "chocolate",
  "cholesterol",
  "chord",
  "christchurch",
  "christian",
  "chronological",
  "chrysanthemum",
  "cicada",
  "cinchona-officinalis",
  "circulate",
  "civil",
  "civilian",
  "claimed",
  "clanking",
  "classmate",
  "classroom",
  "cliff",
  "climate",
  "climatologist",
  "cloak",
  "clothes",
  "clump",
  "cockroach",
  "cocoyam",
  "cold",
  "coleridgean",
  "collection",
  "color",
  "coloured",
  "combustion",
  "commercially",
  "commission",
  "common",
  "community",
  "companion",
  "compensate",
  "complete",
  "completely",
  "composure",
  "computational",
  "computer",
  "conceal",
  "confirmatory",
  "confront",
  "conjunctivitis",
  "conscientious",
  "considerate",
  "consideration",
  "constipation",
  "construction",
  "consultation",
  "contact",
  "container",
  "contempt",
  "contribution",
  "control",
  "cookies",
  "corn",
  "costume",
  "cotton",
  "coumadin",
  "cow",
  "coward",
  "crave",
  "crawlspace",
  "crayon",
  "crazy",
  "creativity",
  "cricketer",
  "criminalisation",
  "crisis",
  "crocodile",
  "crooked",
  "crowded",
  "crucial",
  "crusader",
  "cse",
  "cultism",
  "cultural",
  "culture",
  "cumbersome",
  "cup",
  "cupboard",
  "cupcake",
  "cuprimine",
  "curtains",
  "customer",
  "cybercrime",
  "cylinder",
  "cystoparalysis",
  "deadlocked",
  "decided",
  "deduce",
  "deformed",
  "delicious",
  "delinquency",
  "dementia",
  "dentist",
  "depend",
  "descriptive",
  "despair",
  "destination",
  "detached",
  "determined",
  "detroit",
  "developer",
  "dialogue",
  "difficult",
  "dilemma",
  "dimple",
  "dinosaur",
  "disappointed",
  "disorientation",
  "disturbance",
  "diving",
  "dodge",
  "dog",
  "domestic",
  "donation",
  "drama",
  "dressmaking",
  "dull",
  "duration",
  "dust",
  "dying",
  "ea",
  "eager",
  "eagle",
  "earl",
  "earthing",
  "earthquake",
  "earwig",
  "echography",
  "economics",
  "economy",
  "ecotourism",
  "edge",
  "edible",
  "education",
  "effort",
  "eider",
  "electrician",
  "elephant",
  "eleven",
  "eligibility",
  "embody",
  "embroiled",
  "emerged",
  "emigrant",
  "employer",
  "encourage",
  "encyclopedia",
  "endangered-species",
  "engage",
  "engineer",
  "enjoy",
  "entrance",
  "entrepreneurship",
  "envelope",
  "envious",
  "envy",
  "epitope",
  "equipment",
  "eraser",
  "erinaceidae",
  "eruption",
  "establishment",
  "eternally",
  "ethiopia",
  "eucalyptus",
  "eucharistic",
  "every",
  "exaggerate",
  "excavate",
  "excellence",
  "excellent",
  "exchange",
  "excite",
  "exclaimed",
  "exhilarating",
  "exoskeleton",
  "expectant",
  "explore",
  "extravagant",
  "fabaceae",
  "faithfully",
  "family",
  "family-icteridae",
  "fancy",
  "fantastic",
  "farmer",
  "fart",
  "fascinate",
  "fate",
  "father",
  "feigned",
  "ferdinand-magellan",
  "ferryman",
  "fertilizer",
  "fiberscope",
  "fibreglass",
  "fifth",
  "figured",
  "firefly",
  "fix",
  "fizzy",
  "flamboyant",
  "flat",
  "flower",
  "flower-petal",
  "foolish",
  "forced",
  "foresighted",
  "forest",
  "fortitude",
  "found",
  "foundation",
  "fountain",
  "fox",
  "fragrance",
  "fragrant",
  "frank",
  "free",
  "freight",
  "fresher",
  "frock",
  "from",
  "frontier",
  "fruiterer",
  "ga",
  "galactose",
  "gale",
  "gallina",
  "gambia",
  "gamut",
  "garage",
  "garden",
  "gate",
  "gave",
  "gene",
  "generator",
  "genus-thelypteris",
  "geometry",
  "germ",
  "gift",
  "gigantic",
  "girl",
  "glance",
  "glass",
  "glasses",
  "glistening",
  "gnat",
  "goal",
  "goat",
  "god",
  "gold",
  "gondwanaland",
  "good-manners",
  "goodnight",
  "gorgeous",
  "gorilla",
  "government",
  "grace",
  "gracefully",
  "graduation",
  "graining",
  "grammar",
  "grammatically",
  "grandmother",
  "granola",
  "grapefruit",
  "grasp",
  "grateful-and-thankful",
  "gravitational",
  "great",
  "greedily",
  "greedy",
  "greenery",
  "growth-and-development",
  "grunge",
  "guava",
  "guidance",
  "guide",
  "gymnastics",
  "hadron",
  "haemoproteus",
  "halloween",
  "halo",
  "hammer",
  "hangul",
  "hanover",
  "happy",
  "harmony",
  "hatch",
  "headland",
  "headstrong",
  "health",
  "heard",
  "heart",
  "heavily",
  "heavy",
  "helmet",
  "helping",
  "helpless",
  "hepaticopsida",
  "hero",
  "hew",
  "highly",
  "hightail",
  "hiking",
  "hindi",
  "hiragana",
  "history",
  "hockey",
  "hokkaido",
  "home",
  "hopeless",
  "horrible",
  "hospital",
  "hospitality",
  "host",
  "hovercraft",
  "humber",
  "humble",
  "hungry",
  "hunter",
  "hydrology",
  "hyperthermia",
  "hyponatremia",
  "identity",
  "illegal",
  "illiterate",
  "illuminate",
  "illustration",
  "illustrator",
  "imagination",
  "immediate",
  "immense",
  "impressed",
  "imprint",
  "imprisoned",
  "incident",
  "indian-ocean",
  "indicate",
  "individualisation",
  "individuality",
  "industry",
  "influence",
  "information",
  "informative",
  "insane",
  "inspiration",
  "instantiation",
  "instead",
  "insufferable",
  "integrity",
  "intercontinental",
  "investment",
  "irredeemable",
  "irreplaceable",
  "irula",
  "ishmael",
  "ivory-tower",
  "jackal",
  "jackson",
  "january",
  "jellyfish",
  "june",
  "jurisdiction",
  "justify",
  "kampala",
  "karnataka",
  "katakana",
  "keyboard",
  "kidney",
  "kilogram",
  "kindergarten",
  "knuckle",
  "kuwait",
  "kyoto",
  "labour",
  "ladder",
  "ladybug",
  "lagophthalmos",
  "land-grant",
  "landscaped",
  "laptop",
  "laudable",
  "launched",
  "lawyer",
  "ledge",
  "leer",
  "lego",
  "lemniscus",
  "leopard",
  "lexicographer",
  "liable",
  "life",
  "limited",
  "lion",
  "lioness",
  "lisp",
  "little",
  "liveliness",
  "lively",
  "liver",
  "livingroom",
  "llullaillaco",
  "loneliness",
  "longitude",
  "lonicera",
  "looted",
  "lorry",
  "lousy",
  "lover",
  "loyal",
  "luke",
  "lunch",
  "lunchroom",
  "luxury",
  "machine",
  "machinery",
  "magazine",
  "magnet",
  "mailbox",
  "majestic",
  "major",
  "majority",
  "malayalam",
  "maltreat",
  "management",
  "mane",
  "mangosteen",
  "manometer",
  "marvel",
  "mastery",
  "material",
  "mathematician",
  "matter",
  "mattress",
  "mausoleum",
  "me",
  "medal",
  "median",
  "melanesian",
  "memorable",
  "memories",
  "menorah",
  "mentor",
  "mercy",
  "merrily",
  "message",
  "midnight",
  "mileage",
  "milk",
  "milkshake",
  "mission",
  "misunderstanding",
  "mobile",
  "model",
  "modern",
  "mojo",
  "moment",
  "monday",
  "mongolia",
  "moonlight",
  "morning",
  "mortician",
  "most-valuable",
  "mother",
  "motherland",
  "motorboat",
  "motorised",
  "mountaineering",
  "moved",
  "municipality",
  "muscle-into",
  "music",
  "myocardial-infarction",
  "namibia",
  "nancy",
  "napkin",
  "nature",
  "nearly",
  "nearsighted",
  "necessary",
  "necessity",
  "necklace",
  "neglected",
  "negotiate",
  "nephrosis",
  "neuroanatomical",
  "never",
  "nevertheless",
  "no",
  "noah",
  "nonsense",
  "nonsolid-colour",
  "north-america",
  "note",
  "notebook",
  "novel",
  "nursery",
  "oasis",
  "obediently",
  "obesity",
  "objective",
  "obviously",
  "occupation",
  "ocean",
  "octopus",
  "odious",
  "oeuvre",
  "offering",
  "oft",
  "omnivore",
  "opaque",
  "operate",
  "opinion",
  "opportune",
  "opportunistic",
  "oppression",
  "optimism",
  "or-else",
  "orchard",
  "orderly",
  "ordinary",
  "organization",
  "origin",
  "ornament",
  "oryx",
  "ototoxic",
  "overhead",
  "oxygen",
  "pacemaker",
  "pacesetter",
  "pacify",
  "package",
  "paintbrush",
  "pajamas",
  "palace",
  "pandemic",
  "paper",
  "parasite",
  "parents",
  "parody",
  "parrot",
  "parsnip",
  "particularly",
  "pasta",
  "pastel",
  "pastor",
  "pathetic",
  "patience",
  "patriotism",
  "patronizingly",
  "payable",
  "peanut",
  "pencil",
  "penobscot",
  "perfection",
  "perimeter",
  "peritoneum",
  "persimmon",
  "persuasive",
  "peru",
  "pesticide",
  "phantasm",
  "phenomenon",
  "phoenix",
  "phonology",
  "photosynthesis",
  "phyllo",
  "physical",
  "physiognomy",
  "piano",
  "pigeon",
  "pile",
  "pillow",
  "pine",
  "pinyin",
  "pitanga",
  "planet",
  "platform",
  "playground",
  "playschool",
  "pleasure",
  "plum",
  "plumber",
  "plump",
  "pluto",
  "poem",
  "pointless",
  "pollution",
  "pomegranate",
  "popcorn",
  "popularity",
  "possible",
  "potion",
  "powerful",
  "praise",
  "prayer",
  "preferred",
  "preparation",
  "preposition",
  "preschool",
  "presence",
  "pressure",
  "presto",
  "pretty",
  "priest",
  "primary",
  "principal",
  "probability-theory",
  "procrastination",
  "professionals",
  "program",
  "progressive",
  "prolegomenon",
  "prominent",
  "propanal",
  "pseudepigrapha",
  "psychology",
  "punctuation",
  "pupil",
  "purple",
  "purposeful",
  "quickly",
  "quietly",
  "quite",
  "race",
  "raceme",
  "radiance",
  "radiate",
  "radiation",
  "radiator",
  "radiolaria",
  "radish",
  "rain",
  "raita",
  "rakaposhi",
  "rapid",
  "rascal",
  "rat",
  "ravenous",
  "reached",
  "realise",
  "reception",
  "recitation",
  "rectangle",
  "refreshing",
  "refrigerator",
  "regaining",
  "regarded",
  "remember",
  "replace",
  "reputation",
  "residency",
  "resilience",
  "resister",
  "respect",
  "responsive",
  "rest",
  "restlessly",
  "retreated",
  "revenge",
  "revolution",
  "ribbon",
  "rigorous",
  "roasted",
  "robot",
  "romeo",
  "rondeau",
  "rooster",
  "route",
  "rwanda",
  "sa",
  "sabotage",
  "saboteur",
  "sacagawea",
  "saccharine",
  "sacrament",
  "sacred",
  "sacrifice",
  "sad",
  "saddle",
  "salience",
  "salivary-gland",
  "sample",
  "sardis",
  "satisfactory",
  "scattered",
  "science",
  "sciolist",
  "scissors",
  "sculpture",
  "sea-gooseberry",
  "seagull",
  "secondhand",
  "secret",
  "security",
  "segment",
  "seldom",
  "semicentennial",
  "seminar",
  "semiprofessional",
  "seneschal",
  "senior",
  "sens",
  "sequence",
  "service",
  "setting-hen",
  "several",
  "severe",
  "shade",
  "shaft",
  "shampoo",
  "share",
  "sharpener",
  "shelter",
  "sherpa",
  "shining",
  "shoes",
  "shop-assistant",
  "shopkeeper",
  "shopping",
  "shovel",
  "shows",
  "sight",
  "signal",
  "silhouette",
  "silky",
  "simultaneous",
  "sister",
  "skincare",
  "skulker",
  "sky",
  "sledgehammer",
  "slippers",
  "slower",
  "small",
  "smog",
  "smoke",
  "snack",
  "sneezing",
  "snowflake",
  "society",
  "socket",
  "soda",
  "somersault",
  "sorrow",
  "sour",
  "spacious",
  "spade",
  "spaghetti",
  "special",
  "specimen",
  "speedily",
  "splash",
  "sportive",
  "square",
  "squeeze",
  "squinch",
  "stagnant",
  "standalone",
  "standard",
  "stapler",
  "star",
  "starter",
  "starved",
  "station",
  "stationery",
  "stethoscope",
  "steward",
  "storage",
  "straight",
  "stratocracy",
  "strawberry",
  "stream",
  "streamlet",
  "streptococcus-anhemolyticus",
  "strive",
  "stroke",
  "student",
  "study",
  "subtilize",
  "succession",
  "summer",
  "sunflower",
  "sunglasses",
  "super",
  "superb",
  "superiority",
  "supper",
  "supremely",
  "surge",
  "suspicious",
  "sustainability",
  "sustenance",
  "sweater",
  "sweetish",
  "swift",
  "system-administrator",
  "table",
  "target",
  "tarnish",
  "tartary",
  "tea",
  "teacher",
  "teaspoonful",
  "technician",
  "technology",
  "teeth",
  "teleconference",
  "telemarketing",
  "telephone",
  "television",
  "tempestuous",
  "temple",
  "tennessee",
  "tennis",
  "tent",
  "thane",
  "thatcher",
  "theoretical",
  "thermometer",
  "thoroughly",
  "thought",
  "thrombolysis",
  "throne",
  "through",
  "thunder",
  "thundering",
  "thursday",
  "ticket",
  "tile",
  "togo",
  "toilet",
  "topper",
  "tough",
  "tracy",
  "trait",
  "trance",
  "transient",
  "traumatic",
  "travel",
  "travelogue",
  "treat",
  "treatment",
  "tremendous",
  "trinidad",
  "truly",
  "truthfully",
  "tube",
  "tuesday",
  "tuition",
  "tulip",
  "turned",
  "turnstile",
  "turquoise",
  "tuxedo",
  "twilight",
  "tyson",
  "uakari",
  "ugly",
  "ukraine",
  "ulnar",
  "umpire",
  "unacceptable",
  "unapproachable",
  "understand",
  "understood",
  "undesirability",
  "undoubtedly",
  "unexpected",
  "unripe",
  "unscalable",
  "unselfish",
  "unsettling",
  "upset",
  "urgent",
  "urgently",
  "useful",
  "usurpation",
  "vaccination",
  "vacuum",
  "vaporization",
  "variable",
  "vary",
  "vast",
  "vegetables",
  "venomous",
  "version",
  "very",
  "vessel",
  "veterinarian",
  "videocassette-recorder",
  "view",
  "vigorously",
  "violence",
  "visitor",
  "void",
  "volleyball",
  "wagon",
  "waist",
  "waiter",
  "walking",
  "wardrobe",
  "warm",
  "washing-machine",
  "water",
  "watermelon",
  "watt-hour",
  "wealthy",
  "weightlifter",
  "weir",
  "whirlwind",
  "whisper",
  "whitening",
  "wild",
  "window",
  "wise",
  "wolf",
  "woman",
  "wonderful",
  "worst",
  "wreath",
  "xanthium",
  "xeroderma",
  "xylophone",
  "xyris",
  "yellow",
  "yoko-ono",
  "zest",
  "zipper",
  "zoology",
];

// Export the string array using module.exports
module.exports = syllableWordsArray;
