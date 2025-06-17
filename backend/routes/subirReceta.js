const express = require('express');
const Recipe = require('../models/receta');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const classifier = require('../utils/clasificador');
const { ObjectId } = require('mongoose').Types;

// Crear receta
router.post('/', verifyToken, async (req, res) => { // <-- Añade verifyToken aquí
    try {
        const { name, description, image, ingredients, preparation } = req.body;

        if (!name || !description || !image || !ingredients || !preparation) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // ingredients ya es un array
        console.log('Ingredientes recibidos:', ingredients);

        // Clasificación automática usando la clase RecipeClassifier
        const { type, difficulty, preparationTime, tags, category } = classifier.clasificarReceta({
            titulo: name,
            descripcion: description + ' ' + preparation,
            ingredientes: ingredients // Si el clasificador espera 'ingredientes', déjalo así
        });

        const newRecipe = new Recipe({
            name,
            description,
            image,
            ingredients,
            preparation,
            category,
            type,
            difficulty,
            preparationTime,
            tags,
            user: req.user.id // <-- ¡AQUÍ!
        });

        await newRecipe.save();
        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la receta' });
    }
});

// Obtener todas las recetas
router.get('/', async (req, res) => {
    try {
        const recetas = await Recipe.find();
        res.json(recetas);
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        res.status(500).json({ message: 'Error al obtener las recetas' });
    }
});

// Actualizar receta
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const receta = await Recipe.findById(req.params.id);
        if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });

        // Permitir solo si eres admin o el creador
        if (receta.user.toString() !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permiso para editar esta receta' });
        }

        Object.assign(receta, req.body);
        const recetaActualizada = await receta.save();

        res.json(recetaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar la receta' });
    }
});

// Eliminar receta
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const receta = await Recipe.findById(req.params.id);
        if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });

        // Permitir solo si eres admin o el creador
        if (receta.user.toString() !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta receta' });
        }

        await receta.deleteOne();
        res.json({ mensaje: 'Receta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la receta' });
    }
});

// Obtener una receta por ID
router.get('/:id', async (req, res) => {
    const recetaId = req.params.id;
    if (!ObjectId.isValid(recetaId)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const receta = await Recipe.findById(recetaId);
        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }
        res.json(receta);
    } catch (error) {
        console.error('Error al obtener la receta:', error);
        res.status(500).json({ message: 'Error al obtener la receta' });
    }
});

module.exports = router;
