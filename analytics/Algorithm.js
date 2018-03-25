const Promise = require('bluebird');

const LOGICTIC_STEEPNESS = 0.3;
const LOGICTIC_CENTER = 0;

const DUMMY_TONE_WEIGHTS = {
  'trump': -20,
  'terrorisme': -30,
  'politique': -10,
  'néo-nazi': -50,
  'trudeau': -5,
  'couillard': -10,
  'canada': 10,
  'charte': 20,
  'chat': 40,
  'poutine': -10,
  'xi': -5,
  'syrie': -10,
  'corée': -10,
  'iran': -10,
  'russie': -5,
  'irak': -5,
  'afghanistan': -5,
  'spacex': 15,
  'musk': 10,
  'chaton': 50,
  'mort': -10,
  'décès': -5,
  'arme': -20,
  'guerre': -30,
  'hydro-québec': -20,
  'média': -10,
  'tramway': 5,
  'aime': 40,
  'adore': 60,
  'déteste': -30,
  'hais': -30,
  'magnifique': 50,
  'terrible': -20,
  'conflit': -20,
  'beau': 20,
  'belle': 20,
  'bon': 10,
  'bonne': 10,
  'café': 10,
  'thé': 5,
  'vin': 10,
  'bière': 20,
  'pizza': 20,
  'marijuana': 5,
  'festival': 5,
  'subvention': -10,
  'mauvais': -10,
  'riche': -20,
  'pauvre': -10,
  'libéral': -10,
  'conservateur': -10,
  'péquiste': -10,
  'caquiste': -10,
  'caq': -10,
  'solidaire': -10,
  'npd': -10,
  'qs': -10,
  'pq': -10,
  'montréal': 5,
  'québec': 5,
  'ottawa': 5,
  'toronto': 5,
  'vancouver': 20,
  'taxe': -10,
  'impôt': -20
};
const DUMMY_POLARISATION_WEIGHTS = {
  'trump': 50,
  'terrorisme': 60,
  'néo-nazi': 60,
  'islam': 50,
  'chrétien': 50,
  'poutine': 50,
  'syrie': 10,
  'corée': 10,
  'iran': 10,
  'russie': 30,
  'irak': 20,
  'afghanistan': 20,
  'chine': 30,
  'xi': 5,
  'politique': 50,
  'trudeau': 50,
  'couillard': 10,
  'canada': 10,
  'charte': 40,
  'chat': -20,
  'spacex': 30,
  'musk': 30,
  'chaton': -30,
  'mort': 10,
  'décès': -10,
  'arme': 20,
  'guerre': 15,
  'hydro-québec': 10,
  'média': 40,
  'tramway': 40,
  'aime': -10,
  'adore': -20,
  'déteste': 5,
  'hais': 10,
  'café': 5,
  'thé': -2,
  'vin': 2,
  'bière': 2,
  'conflit': 50,
  'marijuana': 20,
  'magnifique': -10,
  'terrible': 5,
  'festival': 5,
  'subvention': 10,
  'beau': -5,
  'belle': -5,
  'riche': 5,
  'pauvre': 5,
  'libéral': 40,
  'conservateur': 40,
  'péquiste': 40,
  'caquiste': 40,
  'caq': 40,
  'solidaire': 40,
  'npd': 40,
  'qs': 40,
  'pq': 40,
  'montréal': 10,
  'québec': 15,
  'ottawa': 5,
  'toronto': 10,
  'vancouver': -5,
  'taxe': 60,
  'impôt': 60
};

const wordify = function (word) {
  return word.replace(/[^a-zA-Z0-9 àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\-]/, '').toLowerCase();
};

const enumerateWords = function(sentence) {
  return (sentence || "").split(" ").map((word) => wordify(word)).filter((x) => !!x);
};

const createWordCounts = function (title, summary, text) {
  const titleWords = enumerateWords(title);
  const summaryWords = enumerateWords(summary);
  const textWords = enumerateWords(text);

  return [titleWords, summaryWords, textWords].reduce((acc, list, index) => {
      const listWeight = 3 - index;
      const listWordCount = list.length;

      return list.reduce((internalAcc, word, wordIndex) => {
        const value = listWeight * ((listWordCount - (wordIndex / 4)) / listWordCount)
        if (!internalAcc[word]) {
          internalAcc[word] = 0;
        }
        internalAcc[word] += value;

        return internalAcc;
      }, acc);
  }, {});
};

const findWordWeight = function (word, weights) {
  const keys = Object.keys(weights);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(word) === 0) {
      return weights[keys[i]];
    }
  }
  return 0;
};

const computeScore = function(wordCount, weights) {
  const wordsUsed = Object.keys(wordCount);
  let wordsUsedCount = 0;
  return wordsUsed.length ? (wordsUsed.reduce((acc, word) => {
    wordsUsedCount += wordCount[word];
    return acc += (findWordWeight(word, weights) * wordCount[word]);
  }, 0) / Math.pow(wordsUsedCount, 0.9)) : 0;
};

const logistic = function (value) {
  return 1 / (1 + Math.exp(-1 * LOGICTIC_STEEPNESS * (value - LOGICTIC_CENTER)));
};

const analyseText = function (title, summary, text) {

  return Promise.try(() => {
    const wordCounts = createWordCounts(title, summary, text);

    const tone = logistic(computeScore(wordCounts, DUMMY_TONE_WEIGHTS));
    const toneDistFromExtrema = 1 - (Math.abs(tone - 0.5) + 0.5);

    return {
      engagement: {
        reactions: 0,
        shares: 0,
        comments: 0
      },
      tone: {
        average: tone,
        stdDev: logistic(computeScore(wordCounts, DUMMY_POLARISATION_WEIGHTS)) * Math.sqrt(toneDistFromExtrema) * 0.8,
      }
    };
  })
  .catch((e) => {
    console.log(e.message);
    return {
      engagement: {
        reactions: 0,
        shares: 0,
        comments: 0
      },
      tone: {
        average: Math.random(),
        stdDev: Math.random(),
        ramdom: true
      }
    };
  });
};

exports.analyseText = analyseText;