const jwt = require('jsonwebtoken');

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token del encabezado
  if (!token) return res.status(401).send('Acceso denegado');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded; // Guardar los datos del usuario en el request
    next();
  } catch (error) {
    return res.status(400).send('Token no válido');
  }
}

// Middleware para verificar que el usuario sea admin
function requireAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
}

// Exportar ambos middlewares juntos
module.exports = {
  verifyToken,
  requireAdmin
};
