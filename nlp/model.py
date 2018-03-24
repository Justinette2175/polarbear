from bagofwords import BagOfWords
import json
import gzip

def get_trained_model():
  with gzip.open("../data/lapresse.json.gz", "rb") as f:
      data = json.loads(f.read().decode('utf-8'))

  def _map(x):
    if x > 1 and x < 5:
      return 0
    if x > 41:
      return 1

  b = BagOfWords()
  b.train({ d['title']: _map(d['engagement']['share_count']) for d in data if _map(d['engagement']['share_count']) is not None })
  return b
