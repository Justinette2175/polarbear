import numpy as np
import re
import sklearn.linear_model

class BagOfWords:
  def __init__(self, model_class=sklearn.linear_model.LinearRegression, *args, **kwargs):
    self.model_class = model_class
    self.model_args = args
    self.model_kwargs = kwargs

    self.model = None
    self.words = None

  def normalize(self, word):
    return re.sub("&[a-z]+;|[^a-z]", "", word.lower())

  def word2vec(self, word):
    try:
      idx = self.words.index(word)
    except:
      idx = 0
    v = np.zeros(len(self.words))
    v[idx] = 1
    return v

  def doc2vec(self, doc):
    return np.sum([ self.word2vec(self.normalize(w)) for w in doc.split(" ") ], axis=0)

  def train(self, data):
    self.words = [ '<unk>' ] + [ self.normalize(w) for w in " ".join(data.keys()).split(" ") ]

    self.model = self.model_class(self.model_args, self.model_kwargs)
    self.X = [ self.doc2vec(t) for t in data.keys() ]
    self.y = list(data.values())

    self.model.fit(self.X, self.y)

  def predict(self, doc):
    return self.model.predict([ self.doc2vec(doc) ])[0]
