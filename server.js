const Promise = require('bluebird');
const RequestPromise = require('request-promise');

const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

const Algorithm = require('./analytics/Algorithm');

const loadModel = function(title, summary, text) {
  return RequestPromise({
    method: 'POST',
    uri: 'http://localhost:8081/predict',
    body: {
      title,
      summary,
      text
    },
    json: true,
    timeout: 2000
  });
};

app.post('/analysis', (req, res) => {
  return Algorithm.analyseText(req.body.title, req.body.summary, req.body.text)
    .then((data) => {
      return loadModel(req.body.title, req.body.summary, req.body.text)
        .then((modelData) => {
          data.engagement.comments = modelData.comments;
          data.engagement.shares = modelData.shares;
          data.engagement.reactions = modelData.reactions;

          return data;
        })
        .catch(() => data);
    })
    .then((completeData) => {
      res.status(200);
      return res.json(completeData);
    })
    .catch((e) => {
      console.error(e.message);
      res.status(500);
      res.send();
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))