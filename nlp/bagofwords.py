import numpy as np
import re
import sklearn.linear_model
import random
from embeddings import embed

class BagOfWords:
  def __init__(self, model_class=sklearn.linear_model.LogisticRegression, *args, **kwargs):
    self.model_class = model_class
    self.model_args = args
    self.model_kwargs = kwargs

    self.model = None
    self.words = None

  def normalize(self, word):
    return re.sub("&[a-z]+;|[^a-z]", "", word.lower())

  def word2vec(self, word):
    # XXX
    return embed(word)

    # try:
    #   idx = self.words.index(word)
    # except:
    #   idx = 0
    # v = np.zeros(len(self.words))
    # v[idx] = 1
    # return v

  def doc2vec(self, doc):
    vec = np.sum([ self.word2vec(self.normalize(w)) for w in doc.split(" ") ], axis=0)
    norm = np.linalg.norm(vec)
    return vec / (norm if norm > 0 else 1)

  def train(self, data, N=500, split=0.8):
    words = {}
    for word in " ".join(data.keys()).split(" "):
      word = self.normalize(word)
      if len(word) < 1 or len(word) > 10:
        continue
      if word in words:
        words[word] += 1
      else:
        words[word] = 1

    self.words = [ '<unk>' ] + [ w[0] for w in sorted(list(words.items()), key=lambda w: -w[1])[:N] ]

    self.model = self.model_class(*self.model_args, **self.model_kwargs)

    data_list = list(data.items())
    random.shuffle(data_list)

    self.X = np.array([ self.doc2vec(item[0]) for item in data_list ])
    self.y = np.array([ item[1] for item in data_list ])

    print(f'{np.count_nonzero(self.y)}/{self.y.shape[0]}')
    
    self.train_count = int(len(data) * split)

    self.model.fit(self.X[:self.train_count], self.y[:self.train_count])

  def predict(self, doc):
    return self.model.predict([ self.doc2vec(doc) ])[0]

  def test(self):
    return self.model.score(self.X[self.train_count:], self.y[self.train_count:])
