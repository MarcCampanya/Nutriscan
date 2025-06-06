// routes/comments.js

const express = require('express');
const router = express.Router();
const Comment = require('../models/comentarios'); // Asegúrate de que el modelo esté en ../models/Comment.js
const Receta = require('../models/receta');   // Modelo de receta para validar existencia
const { verifyToken } = require('../middleware/authMiddleware'); // Middleware para verificar JWT

/**
 * GET /api/receta/:recetaId/comments
 * Obtiene todos los comentarios (y respuestas) de la receta cuyo _id = recetaId.
 * Devuelve un array plano de comentarios con { _id, text, username, parentId, createdAt }.
 */
router.get('/receta/:recetaId/comments', async (req, res) => {
  try {
    const { recetaId } = req.params;

    // Validar que la receta exista
    const recetaExists = await Receta.findById(recetaId);
    if (!recetaExists) {
      return res.status(404).json({ msg: 'Receta no encontrada.' });
    }

    // Buscar comentarios de esta receta y popular solo el campo "username" del usuario
    const comments = await Comment.find({ receta: recetaId })
      .sort({ createdAt: 1 })
      .populate('user', 'username');

    // Transformar en payload plano
    const result = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      username: c.user.username,
      parentId: c.parentId,
      createdAt: c.createdAt,
    }));

    return res.json(result);
  } catch (error) {
    console.error('[GET /comments] ', error);
    return res.status(500).json({ msg: 'Error al obtener comentarios.' });
  }
});

/**
 * POST /api/receta/:recetaId/comments
 * Crea un nuevo comentario o respuesta en la receta indicada.
 * Body: { text: string, parentId?: string }
 * Requiere que el usuario esté autenticado (middleware authMiddleware).
 */
router.post(
  '/receta/:recetaId/comments',
  verifyToken,
  async (req, res) => {
    try {
      const { recetaId } = req.params;
      const { text, parentId } = req.body;

      // Validar texto
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ msg: 'El texto del comentario es obligatorio.' });
      }

      // Validar existencia de receta
      const recetaExists = await Receta.findById(recetaId);
      if (!recetaExists) {
        return res.status(404).json({ msg: 'Receta no encontrada.' });
      }

      // Si parentId viene, validar que ese comentario existe
      if (parentId) {
        const parentComment = await Comment.findById(parentId);
        if (!parentComment) {
          return res.status(400).json({ msg: 'ParentId inválido.' });
        }
      }

      // Crear nuevo comentario
      const nuevoComment = new Comment({
        text: text.trim(),
        user: req.user.id,      // authMiddleware inyecta req.user
        receta: recetaId,
        parentId: parentId || null,
      });
      await nuevoComment.save();

      // Devolver el comentario con username para que el frontend actualice inmediatamente
      const populated = await Comment.findById(nuevoComment._id).populate('user', 'username');
      return res.status(201).json({
        _id: populated._id,
        text: populated.text,
        username: populated.user.username,
        parentId: populated.parentId,
        createdAt: populated.createdAt,
      });
    } catch (error) {
      console.error('[POST /comments] ', error);
      return res.status(500).json({ msg: 'Error al crear comentario.' });
    }
  }
);

module.exports = router;
