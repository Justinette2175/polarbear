const DUMMY_TONE_WEIGHTS = {
  'trump': -20,
  'terrorisme': -15,
  'politique': -10,
  'trudeau': -5,
  'canada': 10,
  'chat': 20,
  'spacex': 15,
  'musk': 10,
  'chaton': 30,
  'mort': -10,
  'décès': -5,
  'armes': -20,
  'guerre': -30
};
const DUMMY_POLARISATION_WEIGHTS = {
  'trump': 50,
  'terrorisme': 50,
  'politique': -10,
  'trudeau': 50,
  'canada': 10,
  'chat': 20,
  'chaton': 30,
  'mort': -10,
  'décès': -5
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
      });
  }, {});
};

const computeScore = function(wordCount, weights) {
  return Object.keys(wordCount).reduce((acc, word) => {
    return acc += (weights[word] || 0) * wordCount[word];
  });
};

const logistic = function (value) {
  return 1 / (1 + Math.exp(-1 * value));
};

const analyseText = function (text, summary, text) {
  const words = createWordCounts(text, summary, text);

  return Promise.resolve({
    engagements: {
      reactions: 0,
      shares: 0,
      comments: 0
    },
    tone: {
      average: logistic(computeScore(words, DUMMY_TONE_WEIGHTS)),
      stdDev: logistic(computeScore(words, DUMMY_POLARISATION_WEIGHTS)),
    }
  })
};