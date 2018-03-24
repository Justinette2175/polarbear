from bottle import post, run, HTTPError, request

from textblob import TextBlob, Blobber
from textblob_fr import PatternTagger, PatternAnalyzer

from model import get_trained_model

model = get_trained_model()

def assert_in(val, err):
  if not val:
    raise HTTPError(status=400, body=err)

def extract_sentiment(phrase):
  tb = Blobber(pos_tagger=PatternTagger(), analyzer=PatternAnalyzer())
  return (tb(phrase).sentiment[0] / 2) + 0.5

@post('/predict')
def predict():
  json = request.json
  assert_in(isinstance(json, dict), 'json is not a dictionnary')
  assert_in('title' in json, 'no attribute title in json')
  title = json['title']
  isstr = isinstance(title, str) or isinstance(title, unicode)
  assert_in(isstr, 'title is not a string')

  return {
      'comments': model.predict(str(title))
    }

@post('/sentiment')
def sentiment():
  json = request.json
  assert_in(isinstance(json, dict))
  assert_in('phrases' in json)
  phrases = json['phrases']
  sentiments = [extract_sentiment(phrase) for phrase in phrases]

  return {
      'sentiments': sentiments
    }    

run(host='0.0.0.0', port=8081, debug=True)
