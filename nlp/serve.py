from bottle import post, run, HTTPError, request

from model import get_trained_model

model = get_trained_model()

def assert_in(val, err):
  if not val:
    raise HTTPError(status=400, body=err)

@post('/predict')
def predict():
  json = request.json
  assert_in(isinstance(json, dict), 'json is not a dictionnary')
  assert_in('title' in json, 'no attribute title in json')
  title = json['title']
  isstr = isinstance(title, str) | isinstance(title, unicode)
  assert_in(isstr, 'title is not a string')

  return {
      'comments': model.predict(str(title))
    }

run(host='0.0.0.0', port=8081, debug=True)
