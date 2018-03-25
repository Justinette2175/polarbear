from bagofwords import BagOfWords
import json
import gzip
import sklearn.linear_model
import sklearn.ensemble

_classifier = sklearn.linear_model.LogisticRegression
_regressor  = sklearn.ensemble.GradientBoostingRegressor

def get_trained_model(engagement_key='share_count', cutoff=100, is_logistic=False):
  with gzip.open("../data/lapresse.json.gz", "rb") as f:
      data = json.loads(f.read().decode('utf-8'))

  def _map(x):
    if is_logistic:
      if x > 1 and x < 5:
        return 0
      if x > 45:
        return 1
    else:
      if x > 0 and x < cutoff:
        return x

  b = BagOfWords(_classifier if is_logistic else _regressor)
  b.train({ d['title']: _map(d['engagement'][engagement_key]) for d in data if _map(d['engagement'][engagement_key]) is not None })
  return b
