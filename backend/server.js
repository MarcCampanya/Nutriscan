// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB utilizando la URI desde el archivo .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
  });

// Definir las rutas (aquí es donde configuras las rutas de autenticación)
app.use('/api/auth', require('./routes/auth'));

app.use('/api/receta', require('./routes/subirReceta'));

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
