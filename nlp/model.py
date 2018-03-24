from bagofwords import BagOfWords
import json

def get_trained_model():
  with open("../notebook/data-1521907207506.json", "r") as f:
      data = json.load(f)

  b = BagOfWords()
  b.train({ d['title']: d['count'] for d in data })
  return b
