from bottle import post, run, HTTPError, request

from model import get_trained_model

model = get_trained_model()

def assert_in(val):
  if not val:
    raise HTTPError(status=400)

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

run(host='0.0.0.0', port=8081, debug=True)
