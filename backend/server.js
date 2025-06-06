// server.js

// 1) Cargar variables de entorno
require('dotenv').config();

// 2) Importar dependencias
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const app      = express();

// 3) Middlewares globales
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 4) Conexión a MongoDB (asegúrate de MONGO_URI en .env, p. ej. mongodb://localhost:27017/nombreDB)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(error => console.error('Error al conectar con MongoDB:', error));

// 5) Rutas de autenticación (login, registro, etc.)
app.use('/api/auth', require('./routes/auth'));

// 6) Ruta para subir recetas (separada de /api/receta para evitar conflicto)
app.use('/api/subirReceta', require('./routes/subirReceta'));

// 7) Rutas principales de receta: listado, detalle, rating
app.use('/api/receta', require('./routes/recetaRoutes'));

// 8) Rutas de comentarios (por ejemplo: /api/receta/:id/comentarios)
app.use('/api/receta', require('./routes/comentarios'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
