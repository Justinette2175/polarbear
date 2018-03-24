import numpy as np
import pickle as pkl

with open('words.pkl', 'rb') as f:
  words = pkl.load(f)

vecs = np.load('vecs.npy')

def embed(word):
  try:
    return vecs[words[word]]
  except KeyError:
    return np.zeros(vecs.shape[1])
