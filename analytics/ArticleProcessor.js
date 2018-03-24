const Promise = require('bluebird');
const RequestPromise = require('request-promise');
const striptags = require('striptags');

const processComments = require('./CommentsProcessor');

const ACCESS_KEY = 'bf9ac6d8-9ad8-4124-a63c-7b7bdf22a2ee';
const RC_NEURO_URL = 'https://services.radio-canada.ca/hackathon/neuro/v1';
const RC_SITESEARCH_URL = 'https://services.radio-canada.ca/hackathon/sitesearch/v1';
const RC_VALIDATION_URL = 'http://api.radio-canada.ca/validationMedia/v1/Validation.html';

const BASE_RC_URL = 'http://ici.radio-canada.ca';

const TIMEOUT = 10000;

const loadArticleMetadata = function (id) {
  return RequestPromise({
    url: `${RC_NEURO_URL}/news-stories/${id}`,
    headers: {
      Authorization: `Client-Key ${ACCESS_KEY}`
    },
    json: true,
    timeout: TIMEOUT
  });
};

const processArticleMetadata = function (metadata) {
  return processComments(metadata.canonicalWebLink.href.replace(BASE_RC_URL, ''))
    .then((commentData) => {
      console.log("Done processing comments for article", metadata.id);

      if (!commentData.count) {
        return null;
      }
      const topics = [];
      try {
        topics.push(metadata.themeTag.name);
        const subthemes = metadata.subThemeTags.map((t) => t.name);
        topics.push(...subthemes);
        const regions = metadata.regionTags.map((t) => t.name);
        topics.push(...regions);
      } catch (e) {}

      const finalData = Object.assign({id: metadata.id}, {
        title: metadata.title,
        summary: striptags(metadata.summary),
        text: striptags(metadata.body.html),
        topics
      }, commentData);

      console.log("...data constructed");
      console.log("   ");

      return finalData;
    });
};

const processArticle = function (id) {
  return loadArticleMetadata(id)
    .then((metadata) => processArticleMetadata(metadata))
    .catch((e) => null);
};

exports.processArticle = processArticle;
exports.processArticleMetadata = processArticleMetadata;
