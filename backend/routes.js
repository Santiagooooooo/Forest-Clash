// backend/routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Game } = require('./models');

const router = express.Router();

// ========== MIDDLEWARE DE AUTENTICACIÓN ==========
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

// ========== RUTAS DE AUTENTICACIÓN ==========

// REGISTRO
router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validaciones básicas
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario o email ya existe' });
        }

        // Crear nuevo usuario (el password se hashea automáticamente en el modelo)
        const user = new User({ username, email, password });
        await user.save();

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                stats: user.stats
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// LOGIN
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                stats: user.stats
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// OBTENER PERFIL (requiere autenticación)
router.get('/auth/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// ========== CRUD DE PARTIDAS ==========

// CREATE - Guardar nueva partida
router.post('/games', authenticateToken, async (req, res) => {
    try {
        const { playerScore, botScore, winner, duration, moves } = req.body;

        const game = new Game({
            userId: req.user.id,
            playerScore,
            botScore,
            winner,
            duration,
            moves
        });

        await game.save();

        // Actualizar estadísticas del usuario
        const user = await User.findById(req.user.id);
        user.stats.gamesPlayed += 1;
        if (winner === 'player') {
            user.stats.gamesWon += 1;
        } else {
            user.stats.gamesLost += 1;
        }
        if (playerScore > user.stats.highestScore) {
            user.stats.highestScore = playerScore;
        }
        await user.save();

        res.status(201).json({
            message: 'Partida guardada exitosamente',
            game
        });
    } catch (error) {
        console.error('Error al guardar partida:', error);
        res.status(500).json({ error: 'Error al guardar partida' });
    }
});

// READ - Obtener todas las partidas del usuario
router.get('/games', authenticateToken, async (req, res) => {
    try {
        const games = await Game.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20); // Últimas 20 partidas

        res.json(games);
    } catch (error) {
        console.error('Error al obtener partidas:', error);
        res.status(500).json({ error: 'Error al obtener partidas' });
    }
});

// READ - Obtener una partida específica
router.get('/games/:id', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!game) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }

        res.json(game);
    } catch (error) {
        console.error('Error al obtener partida:', error);
        res.status(500).json({ error: 'Error al obtener partida' });
    }
});

// UPDATE - Actualizar una partida
router.put('/games/:id', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!game) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }

        res.json({
            message: 'Partida actualizada',
            game
        });
    } catch (error) {
        console.error('Error al actualizar partida:', error);
        res.status(500).json({ error: 'Error al actualizar partida' });
    }
});

// DELETE - Eliminar una partida
router.delete('/games/:id', authenticateToken, async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!game) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }

        res.json({ message: 'Partida eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar partida:', error);
        res.status(500).json({ error: 'Error al eliminar partida' });
    }
});

// ========== ESTADÍSTICAS ==========

// Obtener ranking de jugadores
router.get('/leaderboard', async (req, res) => {
    try {
        const topPlayers = await User.find()
            .select('username stats')
            .sort({ 'stats.gamesWon': -1 })
            .limit(10);

        res.json(topPlayers);
    } catch (error) {
        console.error('Error al obtener ranking:', error);
        res.status(500).json({ error: 'Error al obtener ranking' });
    }
});

module.exports = router;