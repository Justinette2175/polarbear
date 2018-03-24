const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const processComments = require('./CommentsProcessor');
const ArticleProcessor = require('./ArticleProcessor');

const ACCESS_KEY = 'bf9ac6d8-9ad8-4124-a63c-7b7bdf22a2ee';
const RC_NEURO_URL = 'https://services.radio-canada.ca/hackathon/neuro/v1';

const BASE_RC_URL = 'http://ici.radio-canada.ca';

const loadLineupStartingAtPage = function (accumulator, id, page) {
  return RequestPromise({
    url: `${RC_NEURO_URL}/lineups/${id}`,
    headers: {
      Authorization: `Client-Key ${ACCESS_KEY}`
    },
    qs: {
      pageNumber: (page || 1)
    },
    json: true
  })
  .then((data) => {
    const items = data.contentItemSummaries.items;
    accumulator.items.push(...items);
    if (items.length === data.contentItemSummaries.pageSize) {
      return loadLineupStartingAtPage(accumulator, id, page+1);
    }
    return accumulator;
  });
};

const loadLineup = function (id) {
  return loadLineupStartingAtPage({items: []}, id, 1);
};

const parseLineup = function (lineupData) {
  const ids = lineupData.items.map((item) => item.id);

  return Promise.map(ids, (id) => ArticleProcessor.processArticle(id));
};
