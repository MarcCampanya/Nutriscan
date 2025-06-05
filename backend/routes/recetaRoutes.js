const express = require('express');
const router  = express.Router();
const Receta  = require('../models/receta');
const jwt = require('jsonwebtoken'); // Para extraer token sin error
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware opcional para extraer usuario si token existe
function extractUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token inválido, no ponemos user, seguimos sin error
    }
  }
  next();
}

// GET /api/receta
router.get('/', extractUser, async (req, res) => {
  try {
    const recetas = await Receta.find().select('-__v');

    // Mapear para calcular ratings y userRating
    const response = recetas.map(receta => {
      // Calcular media ratings
      let averageRating = 0;
      if (receta.ratings.length > 0) {
        const total = receta.ratings.reduce((acc, r) => acc + r.value, 0);
        averageRating = total / receta.ratings.length;
      }

      // Obtener rating personal si hay usuario logueado
      let userRating = null;
      if (req.user) {
        const personal = receta.ratings.find(r => r.user.toString() === req.user.id);
        if (personal) userRating = personal.value;
      }

      return {
        _id: receta._id,
        titulo: receta.titulo,
        descripcion: receta.descripcion,
        ingredientes: receta.ingredientes,
        pasos: receta.pasos,
        // ... otros campos que necesites
        averageRating,
        userRating,
      };
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

// POST /api/receta/:id/rating (igual que antes)
router.post('/:id/rating', verifyToken, async (req, res) => {
  const recetaId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  try {
    const receta = await Receta.findById(recetaId);
    if (!receta) return res.status(404).send('Receta no encontrada');

    // Verificar si usuario ya valoró
    const existingRatingIndex = receta.ratings.findIndex(r => r.user.toString() === userId);
    if (existingRatingIndex !== -1) {
      // Actualizar valoración existente
      receta.ratings[existingRatingIndex].value = rating;
    } else {
      // Agregar nueva valoración
      receta.ratings.push({ user: userId, value: rating });
    }

    await receta.save();
    res.status(200).send('Rating guardado correctamente');
  } catch (error) {
    console.error('Error al guardar rating:', error);
    res.status(500).send('Error al guardar rating');
  }
});

module.exports = router;
