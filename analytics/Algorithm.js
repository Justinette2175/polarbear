const Promise = require('bluebird');

const DUMMY_TONE_WEIGHTS = {
  'trump': -20,
  'terrorisme': -15,
  'politique': -10,
  'trudeau': -5,
  'couillard': -10,
  'canada': 10,
  'chat': 20,
  'spacex': 15,
  'musk': 10,
  'chaton': 30,
  'mort': -10,
  'décès': -5,
  'arme': -20,
  'guerre': -30,
  'hydro-québec': -20,
  'média': -10,
  'tramway': 5
};
const DUMMY_POLARISATION_WEIGHTS = {
  'trump': 50,
  'terrorisme': 60,
  'politique': 50,
  'trudeau': 50,
  'couillard': 10,
  'canada': 10,
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
  'tramway': 40
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
  return Object.keys(wordCount).reduce((acc, word) => {
    return acc += (findWordWeight(word, weights) * wordCount[word]);
  }, 0);
};

const logistic = function (value) {
  return 1 / (1 + Math.exp(-1 * value));
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
        stdDev: logistic(computeScore(wordCounts, DUMMY_POLARISATION_WEIGHTS)) * toneDistFromExtrema * 2,
      }
    };
  })
  .catch(() => {
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