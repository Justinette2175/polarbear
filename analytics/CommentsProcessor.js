const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const VIA_FOURA_URL = 'https://api.viafoura.co/v2/radio-canada.ca';
const MICROSOFT_SENTIMENT_URL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
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

function loadCommentsForPageWithOffset(accumulator, pageId, offset) {
  console.log("Now querying with offset", offset);
  const qs = {
    show: 'recent'
  };
  if (offset) {
    qs['offset'] = offset;
  }

  return RequestPromise({
    uri: `${VIA_FOURA_URL}/pages/${pageId}/comments`,
    qs,
    json: true,
    timeout: 10000
  })
  .then((response) => {
    accumulator.count = response.result.total_count;

    const results = response.result.results;
    let itemCount = response.result.total_count - response.result.before_count - response.result.after_count;
    let newOffset = (offset || 0) + itemCount;
    newOffset = Math.min(newOffset, response.result.total_count);

    accumulator.phrases.push(...results);
    if (response.result.after_count) {
      return loadCommentsForPageWithOffset(accumulator, pageId, newOffset);
    }
    return accumulator;
  }).catch((e) => {
    return accumulator;
  });
}

function listCommentsForPage(pageId) {
  console.log("Now listing comments for page with id", pageId);
  return loadCommentsForPageWithOffset({
    phrases: [],
    count: 0
  }, pageId)
  .then((data) => {
    const totalHash = data.phrases.reduce((acc, response) => {
      if (!acc[response.id]) {
        acc[response.id] = response;
      }
      return acc;
    }, {});

    return {
      pageId,
      count: data.count,
      read: data.phrases.length,
      lastRead: data.phrases.length ? data.phrases[data.phrases.length-1].id : null,
      phrases: Object.keys(totalHash).map((key) => totalHash[key].content)
    };
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
    uri: MICROSOFT_SENTIMENT_URL,
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

function retrieveViaFouraPage(path) {
  return RequestPromise({
    uri: `${VIA_FOURA_URL}/pages/${encodeURIComponent(path)}`,
    json: true,
    timeout: 10000
  });
}

module.exports = function(articlePath) {
  return retrieveViaFouraPage(articlePath)
    .then((articleData) => listCommentsForPage(String(articleData.result.id)))
    .then((comments) => {
      return listSentiment(comments.phrases)
        .then((sentiment) => {
          const sentimentScores = sentiment.map((doc) => doc.score);
          return {
            rcUrl: articlePath,
            viaFouraPageId: comments.pageId,
            count: comments.count,
            read: comments.read,
            mean: mean(sentimentScores),
            standardDeviation: standardDeviation(sentimentScores)
          }
        });
    });
};
