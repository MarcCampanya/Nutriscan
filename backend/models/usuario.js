const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  rol: {type: String,enum: ['usuario', 'admin'],default: 'usuario'},
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
