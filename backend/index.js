// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARES ==========
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true }));

// ========== CONECTAR A MONGODB ==========
connectDB();

// ========== RUTAS ==========
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: '🌲 Forest Clash API funcionando correctamente',
        version: '1.0.0'
    });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal en el servidor',
        message: err.message
    });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});

module.exports = app;