const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const VIA_FOURA_URL = 'https://api.viafoura.co/v2/radio-canada.ca/pages';
const MICROSOFT_ACCESS_KEY = '326f1d20496348fbac1f511760a10736';

function mean(x) {
  if (!x || !x.length) {
    return 0;
  }
  return x.reduce((a, b) => a + b, 0) / x.length;
}

function variance(x) {
  if (!x || !x.length) {
    return 0;
  }
  const mu = mean(x);
  return x.reduce((a, b) => {
    const dist = b - mu;
    return a + (dist * dist);
  }, 0) / x.length;
}

function standardDeviation(x) {
  return Math.sqrt(variance(x));
}

function listCommentsForPage(pageId) {
  return Promise.all([
    RequestPromise({
      uri: `${VIA_FOURA_URL}/${pageId}/comments?show=top`,
      json: true
    }),
    RequestPromise({
      uri: `${VIA_FOURA_URL}/${pageId}/comments?show=editor-picks`,
      json: true
    }),
    RequestPromise({
      uri: `${VIA_FOURA_URL}/${pageId}/comments?show=recent`,
      json: true
    })
  ])
  .then((responses) => {
    const totalHash = responses.reduce((lastHash, response) => {
      return response.result.results.reduce((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = item;
        }
        return acc;
      }, lastHash);
    }, {})

    return Object.keys(totalHash).map((key) => totalHash[key].content);
  })
  .catch((e) => {
    console.error(e);
  });
}

function listSentiment(phrases) {
  const documents = phrases.map((phrase, index) => {
    return {
      "language" : "fr",
      "id" : index,
      "text" : phrase
    };
  });

  return RequestPromise({
    uri: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`,
    method : 'POST',
    body: {
      documents
    },
    headers: {
      'Ocp-Apim-Subscription-Key' : MICROSOFT_ACCESS_KEY
    },
    json: true
  })
  .then((response) => {
    return response.documents;
  })
  .catch((e) => console.error(e));
}

module.exports = function(articleId) {
  return listCommentsForPage(String(articleId))
    .then((comments) => {
      return listSentiment(comments)
        .then((sentiment) => {
          const sentimentScores = sentiment.map((doc) => doc.score);
          return {
            count: comments.length,
            mean: mean(sentimentScores),
            standardDeviation: standardDeviation(sentimentScores)
          }
        });
    });
};
