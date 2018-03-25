const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const FACEBOOK_BASE_API = 'https://graph.facebook.com/v2.12/';

const TIMEOUT = 2000;

const loadFacebookLink = function (link) {
  return RequestPromise({
    uri: `${FACEBOOK_BASE_API}/sharedposts`,
    qs: {
      id: link,
      fields: 'engagement',
      access_token: 'EAACEdEose0cBAO4hvLm7ULpzMBQOBGSAaITkVwmHe8C72bTCQYZCZBYdmkDYEVvaFIvVNWWZCNxCWfhOuAFDChPezjVKDilHMi4dCpl7O2UUGAtpHiaS9fRiZAGblrFEdAKDfyP6Hktnd5sFMjLZCyeXeGl9FQ3ZC5OeqSZA45GblWw8rXNZBXZAl1bQG4rsP6p4ZD'
    },
    json: true,
    timeout: TIMEOUT
  });
}

const loadLaPresseArticles = function () {
  let cachedData;
  try {
    cachedData = require(`${__dirname}/../data/lapresse.json`);
  } catch (e) {}
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  return Promise.resolve([]);
}

loadLaPresseArticles()
  .then((articles) => {
    const count = articles.length;
    console.log(count, "articles to check for comments");
    return Promise.mapSeries(articles, (article, index) => loadFacebookLink(article.url).then((data) => {
      if (data && data.data && data.data.length) {
        console.log("DATA FOR", article.url);
      } else {
        console.log("Nothing", index, "/", count);
      }
    }).catch(() => null));
  })
  .then(() => console.log("DONE"))
  .catch((e) => console.error(e.message));