const Promise = require('bluebird');
const RequestPromise = require('request-promise');
const striptags = require('striptags');

const processComments = require('./CommentsProcessor');

const ACCESS_KEY = 'bf9ac6d8-9ad8-4124-a63c-7b7bdf22a2ee';
const RC_NEURO_URL = 'https://services.radio-canada.ca/hackathon/neuro/v1';
const RC_SITESEARCH_URL = 'https://services.radio-canada.ca/hackathon/sitesearch/v1';
const RC_VALIDATION_URL = 'http://api.radio-canada.ca/validationMedia/v1/Validation.html';

const BASE_RC_URL = 'http://ici.radio-canada.ca';

const getValidationParams = function (params) {
  return Object.assign({
    connectionType: "broadband",
    output: "json",
    multibitrate: true,
    appCode: "medianet",
    idMedia: 7869208
  }, params || {});
};

const loadArticleMetadata = function (id) {
  return RequestPromise({
    url: `${RC_NEURO_URL}/news-stories/${id}`,
    headers: {
      Authorization: `Client-Key ${ACCESS_KEY}`
    },
    json: true
  });
};

const processArticle = function (id) {
  return loadArticleMetadata(id)
    .then((metadata) => {
      return processComments(metadata.canonicalWebLink.href.replace(BASE_RC_URL, ''))
        .then((commentData) => {
          return Object.assign({id}, {
            title: metadata.title,
            summary: striptags(metadata.summary),
            text: striptags(metadata.body.html)
          }, commentData);
        })
    });
};

module.exports = processArticle;
