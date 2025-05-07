const express = require('express');
const Recipe = require('../models/receta'); // Asegúrate de usar 'Recipe' aquí
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { ObjectId } = require('mongoose').Types;

// Crear receta
router.post('/', async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // Validar que todos los campos estén presentes
        if (!name || !description || !image) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Crear la receta
        const newRecipe = new Recipe({
            name,
            description,
            image
        });

        // Guardar la receta en la base de datos
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
        const recetas = await Recipe.find();  // Obtener todas las recetas
        res.json(recetas);  // Enviar las recetas en formato JSON
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        res.status(500).json({ message: 'Error al obtener las recetas' });
    }
});

// Actualizar receta
router.put('/receta/:id', verifyToken, requireAdmin, async (req, res) => {
    const { name, description, image } = req.body;

    try {
        const receta = await Recipe.findByIdAndUpdate(  // Usar 'Recipe' aquí
            req.params.id,
            { name, description, image },
            { new: true }
        );

        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.json(receta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al editar la receta' });
    }
});

//Eliminar receta
router.delete('/receta/:id', verifyToken, requireAdmin, async (req, res) => {
    const recetaId = req.params.id;

    // Verificar si el ID es válido
    if (!ObjectId.isValid(recetaId)) {
        return res.status(400).json({ mensaje: 'ID inválido' });
    }

    try {
        const receta = await Recipe.findByIdAndDelete(recetaId); // Usar ObjectId aquí

        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        res.json({ mensaje: 'Receta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la receta:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la receta' });
    }
});

module.exports = router;
