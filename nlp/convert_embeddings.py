import numpy as np

words = {}
vecs = []
i = 0

with open('./wiki.fr.vec', 'r') as f:
  while True:
    i += 1
    if i % 10000 == 0:
      print(i)
    line = f.readline()
    if line == '':
      break
    spl = line.strip().split(' ')
    word = spl[0]
    if word in words:
      continue
    vec = [ float(s) for s in spl[1:] ]
    if len(vec) != 300:
      continue
    words[word] = len(words)
    vecs.append(np.array(vec, dtype=np.float32))

import pickle as pkl

with open('words.pkl', 'wb') as f:
  pkl.dump(words, f)

vecs = np.array(vecs, dtype=np.float32)
np.save('vecs', vecs)
