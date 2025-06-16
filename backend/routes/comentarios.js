// routes/comments.js

const express = require('express');
const router = express.Router();
const Recipe = require('../models/receta'); // Usa el modelo de receta
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:id/comment', verifyToken, async (req, res) => {
  console.log('Body recibido:', req.body);
  const { message } = req.body;
  const recetaId = req.params.id;
  const userId = req.user.id;
  const username = req.user.username || req.user.nombre;
  console.log('req.user:', req.user);
  console.log('Nombre de usuario para el comentario:', username);

  if (!message) return res.status(400).json({ message: 'Comentario vacío' });

  try {
    const receta = await Recipe.findById(recetaId);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    receta.comments.push({ user: userId, username, message });
    await receta.save();

    res.status(201).json(receta.comments[receta.comments.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir comentario' });
  }
});

router.post('/:id/comment/:commentId/reply', verifyToken, async (req, res) => {
  const { message } = req.body;
  const recetaId = req.params.id;
  const commentId = req.params.commentId;
  const userId = req.user.id;
  const username = req.user.username;

  if (!message) return res.status(400).json({ message: 'Respuesta vacía' });

  try {
    const receta = await Recipe.findById(recetaId);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    const comment = receta.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    comment.replies.push({ user: userId, username, message });
    await receta.save();

    res.status(201).json(comment.replies[comment.replies.length - 1]);
  } catch (error) {
    console.error(error); // <-- Añade esto para ver el error real en consola
    res.status(500).json({ message: 'Error al responder comentario' });
  }
});

module.exports = router;
