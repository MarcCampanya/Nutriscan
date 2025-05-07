const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

// Login de usuario
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ correo });
      if (!usuario) {
        return res.status(400).json({ mensaje: 'Correo no encontrado' });
      }
      // Comparar contraseñas sin encriptar (solo temporalmente — ver nota)
      if (usuario.contraseña !== contraseña) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );      
  
      res.json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  });
  
// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña });
    await nuevoUsuario.save();

    // Crear el token
    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
