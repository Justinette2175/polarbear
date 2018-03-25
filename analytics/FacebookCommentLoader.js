const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const fs = require('fs');

const FACEBOOK_BASE_API = 'https://graph.facebook.com/v2.12';

const TIMEOUT = 2000;

const loadFacebookLink = function (link) {
  return RequestPromise({
    uri: `${FACEBOOK_BASE_API}/${encodeURIComponent(link)}`,
    qs: {
      fields: 'og_object',
      access_token: 'EAACEdEose0cBAJLcLQ2ptXm5rtileIUzd27iZAlQpmzRxak5uANVvq9dZAGfrKZALErjrBeQATIkL360sWvKCrPU0XtN49q3gAtRi5PZCu18QfSejZCd1GeHKlw19NOQp5L0h8fCUiAFs5ZBoJ2V5gwcRiC2ZCAFHai6yHNfk5ZCM7ONipW8XOie1JRvldyLzrO8C0GTJ3TGkgZDZD'
    },
    json: true,
    timeout: TIMEOUT
  })
  .then((ogObject) => {
    return RequestPromise({
      uri: `${FACEBOOK_BASE_API}/${ogObject.og_object.id}/comments`,
      qs: {
        access_token: 'EAACEdEose0cBAJLcLQ2ptXm5rtileIUzd27iZAlQpmzRxak5uANVvq9dZAGfrKZALErjrBeQATIkL360sWvKCrPU0XtN49q3gAtRi5PZCu18QfSejZCd1GeHKlw19NOQp5L0h8fCUiAFs5ZBoJ2V5gwcRiC2ZCAFHai6yHNfk5ZCM7ONipW8XOie1JRvldyLzrO8C0GTJ3TGkgZDZD'
      },
      json: true,
      timeout: TIMEOUT
    })
    .then((commentData) => {
      return {
        url: link,
        postId: ogObject.og_object.id,
        data: commentData.data
      };
    });
  })
  .catch((e) => {
    console.log(e.message);
    return {data: []};
  })
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
        return data;
      } else {
        console.log("Nothing", index, "/", count);
        return null;
      }
    }).catch(() => null));
  })
  .then((data) => {
    fs.writeFileSync(`${__dirname}/data/fb-comments.json`, JSON.stringify(data.filter((x) => !!x)), {encoding: 'utf8'});
    console.log("wrote to file");
  })
  .catch((e) => console.error(e.message));