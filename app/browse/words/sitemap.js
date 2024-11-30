const BASE_URL = "https://words.englishbix.com";

/**
 * This file is used to generate multiple sitemaps
 */

//Opting out of Full Route Cache, or in other words, dynamically render components for every incoming request, by:
//Using the dynamic = 'force-dynamic' or revalidate = 0 route segment
export const revalidate = 0;

const startPhrases = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "ag", "ai", "ak", "al", "am", "an", "ao", "ap", "app", "aq", "ar", "art", "as", "at", "au", "aw", "ay", "az", "ba", "be", "bel", "blu", "bo", "br", "bu", "by", "ca", "can", "cat", "ce", "ch", "char", "che", "ck", "cl", "clo", "co", "com", "con", "cr", "cri", "cu", "cy", "da", "de", "di", "dis", "dl", "do", "dro", "eb", "ed", "ee", "eg", "ei", "el", "em", "en", "ep", "eq", "es", "et", "ex", "fi", "fl", "flo", "flu", "fo", "foot", "for", "fr", "fro", "ga", "ge", "gh", "gi", "gl", "go", "gr", "gra", "gru", "ha", "he", "hi", "ho", "hu", "id", "iha", "im", "in", "it", "ja", "jo", "ka", "key", "ki", "kno", "la", "le", "li", "ll", "lo", "ma", "me", "mi", "mis", "mo", "multi", "my", "na", "ne", "ng", "ni", "no", "non", "nu", "ny", "oa", "od", "on", "oo", "op", "out", "over", "ow", "pa", "pat", "pe", "pen", "per", "ph", "photo", "pi", "pl", "po", "pr", "pre", "pro", "pu", "qe", "qi", "qu", "ra", "re", "rh", "ri", "ro", "ru", "sa", "sat", "sc", "se", "set", "sh", "sk", "sl", "slu", "sm", "sma", "sn", "so", "sp", "spl", "spu", "squ", "sr", "st", "ste", "str", "su", "sw", "ta", "te", "th", "the", "ti", "to", "tr", "tro", "ts", "tu", "un", "up", "us", "wa", "wat", "we", "wh", "whi", "who", "xe", "xi", "xu", "ya", "za", "zu"];
const endPhrases = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "it", "er", "et", "ed", "at", "ch", "en", "le", "th", "tion", "ing", "al", "que", "re", "ys", "ic", "el", "an", "in", "end", "by", "ad", "de", "st", "am", "ile", "oo", "ap", "ar", "as", "ax", "ay", "be", "ck", "eg", "eh", "ell", "es", "fe", "ff", "ie", "if", "ight", "less", "on", "op", "ot", "ow", "oy", "ph", "sh", "sk", "ug", "un", "up", "us", "ve", "ny", "ox", "ist", "ful", "ous", "ack", "age", "ake", "ane", "ant", "ble", "ct", "een", "ere", "ew", "ex", "ey", "fy", "ick", "ide", "ies", "igh", "ind", "ink", "ip", "ite", "ive", "ix", "lk", "ll", "ment", "ock", "of", "og", "own", "se", "set", "sp", "the", "tic", "ture", "ty", "ut", "ya", "gh", "gry", "im", "ion", "ish", "use", "ag", "all", "ess", "ness", "our", "ship", "ta", "ter", "za", "ze", "lt", "ain", "air", "ame", "art", "ate", "em", "go", "ice", "ig", "ill", "ld", "nd", "od", "old", "ong", "os", "ab", "ail", "ale", "ang", "any", "aw", "nk", "to", "ee", "ub", "ud", "ound", "out", "ng", "pt", "ss", "you", "yo", "book", "we", "con", "day", "eb", "eed", "ib", "ife", "ith", "la", "ood", "ook", "ool", "oon", "ord", "ring", "sure", "ver", "ves", "xi", "aq", "atch", "back", "can", "card", "dent", "esque", "for", "gle", "iot", "key", "les", "lp", "oll", "ology", "ost", "paw", "she", "tory", "ux", "ure", "aa", "ike", "mm", "wh", "az", "ity", "ove", "ry", "alk", "ank", "box", "cious", "cup", "full", "god", "ize", "new", "love", "side", "sion", "thing", "time", "tle", "ob", "om", "um", "ft", "hen", "me", "one", "esty", "etsy", "ght", "ea", "her", "eld", "urn", "ead", "ht", "rd", "rk", "and", "era", "est", "is", "night", "ask", "co", "di", "each", "eck", "ings", "lf", "like", "lly", "mit", "mp", "oom", "ork", "per", "rite", "sm", "ther", "uder", "unk", "ust", "aws", "ither", "kt", "nag", "ocr", "rpa", "seo", "size", "zz", "ance", "ast", "eet", "elf", "ine", "ious", "ne", "ol", "son", "adt", "light", "note", "ky", "rld", "sa", "ted", "ten", "thy", "zy", "ade", "board", "cook", "dog", "eoy", "ers", "heart", "oud", "pen", "ur", "wood", "ert", "id", "il", "ou", "tch", "uck", "ime", "able", "ace", "ao", "are", "cy", "dom", "ence", "ible", "my", "nt", "ti", "mo", "lie", "sal", "udge", "uh", "ly", "ope", "ave", "bel", "date", "eart", "ede", "erp", "fee", "fied", "gen", "ha", "house", "ird", "ko", "line", "long", "nel", "oat", "och", "ory", "pe", "raw", "ssion", "tra", "ung", "ush", "ute", "vac", "zine", "ki", "sck", "alet", "head", "org", "net", "cvc", "y", "eat", "ery", "tal", "aive", "com", "gre", "gru", "hine", "oet", "olg", "orta", "tsy", "uas"];
const lengthPhrases = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
export default async function sitemap() {

    const allPhrasesMap = [];
    startPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/words/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    endPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/words/end/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    lengthPhrases.map((word) => {
        allPhrasesMap.push({
            url: `${BASE_URL}/browse/words/length/${word}`.trim(),
            lastModified: new Date(),
        })
    });

    // console.log("count of all the links", allPhrasesMap.length);

    return allPhrasesMap;
}
