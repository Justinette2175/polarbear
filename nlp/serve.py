from bottle import post, run, HTTPError, request

from textblob import TextBlob, Blobber
from textblob_fr import PatternTagger, PatternAnalyzer

from model import get_trained_model

model = get_trained_model()

def assert_in(val):
  if not val:
    raise HTTPError(status=400)

def extract_sentiment(phrase):
  tb = Blobber(pos_tagger=PatternTagger(), analyzer=PatternAnalyzer())
  return (tb(phrase).sentiment[0] / 2) + 0.5

@post('/predict')
def predict():
  json = request.json
  assert_in(isinstance(json, dict))
  assert_in('title' in json)
  title = json['title']
  assert_in(isinstance(title, str))

  return {
      'comments': model.predict(title)
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
