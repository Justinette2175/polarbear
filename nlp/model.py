from bagofwords import BagOfWords
import json
import gzip

def get_trained_model():
  with gzip.open("../data/lapresse.json.gz", "r") as f:
      data = json.load(f)

  b = BagOfWords()
  b.train({ d['title']: d['engagement']['share_count'] for d in data if d['engagement']['share_count'] > 0 })
  return b
