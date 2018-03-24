const Promise = require('bluebird');
const RequestPromise = require('request-promise');
const fs = require('fs');

const processComments = require('./CommentsProcessor');
const ArticleProcessor = require('./ArticleProcessor');

const ACCESS_KEY = 'bf9ac6d8-9ad8-4124-a63c-7b7bdf22a2ee';
const RC_NEURO_URL = 'https://services.radio-canada.ca/hackathon/neuro/v1';

const BASE_RC_URL = 'http://ici.radio-canada.ca';

const DEFAULT_ARTICLE_COUNT = 1000;

const TIMEOUT = 10000;

const loadLineupStartingAtPage = function (accumulator, id, page) {
  return RequestPromise({
    url: `${RC_NEURO_URL}/lineups/${id}`,
    headers: {
      Authorization: `Client-Key ${ACCESS_KEY}`
    },
    qs: {
      pageNumber: (page || 1)
    },
    json: true,
    timeout: TIMEOUT
  })
  .then((data) => {
    const items = data.contentItemSummaries.items;
    accumulator.items.push(...items);
    if (items.length === data.contentItemSummaries.pageSize) {
      return loadLineupStartingAtPage(accumulator, id, page+1);
    }
    return accumulator;
  })
  .catch(() => accumulator);
};

const loadLineup = function (id) {
  return loadLineupStartingAtPage({items: []}, id, 1);
};

const parseLineup = function (lineupData) {
  return lineupData.items.map((item) => item.id);
};

const loadLineupArticleIds = function (lineupId) {
  return loadLineup(lineupId)
    .then((lineupData) => parseLineup(lineupData));
};

const loadNArticles = function (accumulator, lineupIds, requestedCount) {
  let cachedData;
  try {
    cachedData = require(`${__dirname}/data/articles.json`);
  } catch (e) {}
  if (cachedData) {
    return Promise.resolve({items: cachedData});
  }

  if (lineupIds.length && accumulator.items.length < requestedCount) {
    const lineupId = lineupIds.shift();
    return loadLineupArticleIds(lineupId)
      .catch(() => [])
      .then((articleIds) => {
        articleIds = articleIds.filter((x) => !!parseInt(x));
        accumulator.items.push(...articleIds);
        console.log(`Retrieved ${articleIds.length} articles from lineup ${lineupId}, now ${accumulator.items.length} out of ${requestedCount} loaded`)
        return loadNArticles(accumulator, lineupIds, requestedCount);
      });
  }
  
  return accumulator;
};

const listLineups = function() {
  let cachedData;
  try {
    cachedData = require(`${__dirname}/data/lineups.json`);
  } catch (e) {}
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  return RequestPromise({
    url: `${RC_NEURO_URL}/lineups`,
    headers: {
      Authorization: `Client-Key ${ACCESS_KEY}`
    },
    qs: {
      pageNumber: 1
    },
    json: true
  })
  .then((result) => result.items.map((item) => item.id));
};

const parseNArticles = function (requestedCount, countOnly) {
  console.log("Must load and process", requestedCount, "articles");
  return listLineups()
    .then((lineupIds) => {
      console.log("Done loading lineup ids");
      fs.writeFileSync(`${__dirname}/data/lineups.json`, JSON.stringify(lineupIds), {encoding: 'utf8'});
      return loadNArticles({items: []}, lineupIds, parseInt(requestedCount));
    })
    .then((articleData) => {
      console.log("Done loading article ids");
      fs.writeFileSync(`${__dirname}/data/articles.json`, JSON.stringify(articleData.items), {encoding: 'utf8'});
      console.log("Now processing data");
      return Promise.map(articleData.items, (articleId) => ArticleProcessor.processArticle(articleId, countOnly));
    })
    
};

parseNArticles(process.argv[2] || DEFAULT_ARTICLE_COUNT, process.argv[3] && process.argv[3] === 'count').then((data) => {
  const dataSet = data.filter((x) => !!x);
  console.log("Loaded", dataSet.length, "articles with comment data among", data.length, "articles loaded");
  fs.writeFileSync(`data-${Date.now()}.json`, JSON.stringify(dataSet), {encoding: 'utf8'});
});
