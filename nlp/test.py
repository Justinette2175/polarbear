from model import get_trained_model

for key in [('share_count', 100), ('comment_count', 50), ('reaction_count', 50)]:
  model = get_trained_model(key[0], key[1], is_logistic=False)
  print(key, model.test())
