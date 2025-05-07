const mongoose = require('mongoose');

// Definir el esquema de receta sin referencia al usuario
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

// Crear y exportar el modelo de receta
module.exports = mongoose.model('receta', recipeSchema);
