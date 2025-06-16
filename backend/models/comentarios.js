const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [replySchema]
});

const recipeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  image:       { type: String, required: true },
  ingredients: { type: [String], required: true },
  preparation: { type: String, required: true },
  ratings:     [/* ... */],
  comments:    [commentSchema] // <-- AÑADE ESTA LÍNEA
});

// ...virtuals y export...

module.exports = mongoose.model('receta', recipeSchema);
