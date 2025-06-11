const express = require('express');
const Recipe = require('../models/receta');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const classifier = require('../utils/clasificador');
const { ObjectId } = require('mongoose').Types;

// Crear receta
router.post('/', async (req, res) => {
    try {
        const { name, description, image, ingredientesTexto, preparation } = req.body;

        if (!name || !description || !image || !ingredientesTexto || !preparation) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const ingredientes = ingredientesTexto
            .split(',')
            .map(i => i.trim())
            .filter(i => i !== '');

        console.log('Ingredientes procesados:', ingredientes);

        // Clasificación automática usando la clase RecipeClassifier
        const { type, difficulty, preparationTime, tags, category } = classifier.clasificarReceta({
            titulo: name,
            descripcion: description + ' ' + preparation,
            ingredientes
        });

        const newRecipe = new Recipe({
            name,
            description,
            image,
            ingredientes,
            preparation,
            category,
            type,
            difficulty,
            preparationTime,
            tags
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
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
    const { name, description, image, ingredientesTexto, preparation } = req.body;

    try {
        const ingredientes = ingredientesTexto
            ? ingredientesTexto.split(',').map(i => i.trim()).filter(i => i !== '')
            : undefined;

        const updateFields = { name, description, image, preparation };
        if (ingredientes) updateFields.ingredientes = ingredientes;

        // Recalcular clasificación si hay cambios relevantes
        if (name || description || preparation || ingredientes) {
            const { type, difficulty, preparationTime, tags, category } = classifier.clasificarReceta({
                titulo: name || '',
                descripcion: `${description || ''} ${preparation || ''}`,
                ingredientes: ingredientes || []
            });
            Object.assign(updateFields, { type, difficulty, preparationTime, tags, category });
        }

        const receta = await Recipe.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.json(receta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al editar la receta' });
    }
});

// Eliminar receta
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    const recetaId = req.params.id;
    if (!ObjectId.isValid(recetaId)) {
        return res.status(400).json({ mensaje: 'ID inválido' });
    }

    try {
        const receta = await Recipe.findByIdAndDelete(recetaId);
        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.json({ mensaje: 'Receta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la receta:', error);
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
