// backend/routes/recetaRoutes.js

const express = require('express');
const router  = express.Router();
const Receta  = require('../models/receta');
const jwt     = require('jsonwebtoken');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Middleware opcional para extraer usuario si llega token válido
function extractUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, correo, rol, iat, exp }
    } catch (err) {
      // Token inválido o expirado → no seteamos req.user, pero no interrumpimos
    }
  }
  next();
}

// GET /api/receta
// Lista todas las recetas, incluyendo averageRating y userRating si hay token
router.get('/', extractUser, async (req, res) => {
  try {
    const recetas = await Receta.find().select('-__v');

    const response = recetas.map(receta => {
      // Cálculo de la media de ratings
      let averageRating = 0;
      if (Array.isArray(receta.ratings) && receta.ratings.length > 0) {
        const total = receta.ratings.reduce((acc, r) => acc + r.value, 0);
        averageRating = total / receta.ratings.length;
      }

      // Cálculo de la valoración personal (userRating) si hay usuario logueado
      let userRating = 0;
      if (req.user) {
        const personal = receta.ratings.find(r => r.user.toString() === req.user.id);
        if (personal) userRating = personal.value;
      }

      return {
        _id: receta._id,
        name: receta.name,
        description: receta.description,
        image: receta.image,
        ingredients: receta.ingredients,
        preparation: receta.preparation,
        averageRating,
        userRating
      };
    });

    res.json(response);
  } catch (err) {
    console.error('Error al obtener recetas:', err);
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

// GET /api/receta/:id
// Detalle de una sola receta, con averageRating y userRating si hay token
router.get('/:id', extractUser, async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id).select('-__v');
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });

    // Calcular media de ratings
    let averageRating = 0;
    if (Array.isArray(receta.ratings) && receta.ratings.length > 0) {
      const total = receta.ratings.reduce((acc, r) => acc + r.value, 0);
      averageRating = total / receta.ratings.length;
    }

    // Obtener valoración personal
    let userRating = 0;
    if (req.user) {
      const personal = receta.ratings.find(r => r.user.toString() === req.user.id);
      if (personal) userRating = personal.value;
    }

    res.json({
      _id: receta._id,
      name: receta.name,
      description: receta.description,
      image: receta.image,
      ingredients: receta.ingredients,
      preparation: receta.preparation,
      averageRating,
      userRating
    });
  } catch (err) {
    console.error('Error al obtener la receta:', err);
    res.status(500).json({ error: 'Error al obtener la receta' });
  }
});

// POST /api/receta/:id/rating
// Guarda o actualiza la valoración del usuario autenticado
router.post('/:id/rating', verifyToken, async (req, res) => {
  const recetaId = req.params.id;
  const userId   = req.user.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating inválido. Debe estar entre 1 y 5.' });
  }

  try {
    const receta = await Receta.findById(recetaId);
    if (!receta) return res.status(404).send('Receta no encontrada');

    // Si el usuario ya había valorado, actualizamos el valor
    const existingIndex = receta.ratings.findIndex(r => r.user.toString() === userId);
    if (existingIndex !== -1) {
      receta.ratings[existingIndex].value = rating;
    } else {
      // Si no había valorado, agregamos un nuevo subdocumento
      receta.ratings.push({ user: userId, value: rating });
    }

    await receta.save();
    res.status(200).send('Rating guardado correctamente');
  } catch (err) {
    console.error('Error al guardar rating:', err);
    res.status(500).send('Error al guardar rating');
  }
});

// Eliminar receta (solo admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const receta = await Receta.findByIdAndDelete(req.params.id);
    if (!receta) {
      return res.status(404).json({ msg: 'Receta no encontrada.' });
    }
    res.json({ msg: 'Receta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la receta.' });
  }
});

// Actualizar receta (solo admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const receta = await Receta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receta) return res.status(404).json({ msg: 'Receta no encontrada.' });
    res.json(receta);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar la receta.' });
  }
});

module.exports = router;
