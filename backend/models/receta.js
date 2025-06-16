const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  value: { type: Number, required: true, min: 1, max: 5 }
});

// Esquema para respuestas a comentarios
const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Esquema para comentarios
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
  ratings:     [ratingSchema],
  comments:    [commentSchema] // <-- Añade esta línea
});

// Virtual para obtener el promedio de ratings
recipeSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  return sum / this.ratings.length;
});

// Al serializar a JSON, queremos que aparezcan también los virtuals:
recipeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('receta', recipeSchema);
