require('dotenv').config(); // ⬅️ Agregar al inicio del archivo

const express = require('express');
const cors = require('cors');
const path = require('path');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { connect, getDb } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const redoc = require('redoc-express');
const axios = require('axios');

const app = express();
const csrfProtection = csrf({ cookie: true });

// === CORS seguro desde .env ===
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(cookieParser());
app.use(express.json());
app.options('*', cors());

// Swagger y Redoc
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));
app.get('/redoc', redoc({ title: 'User Service API - Redoc', specUrl: '/swagger.json' }));

// === Middleware de JWT ===
const authenticateJWT = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const publicKey = await axios.get(process.env.JWT_PUBLIC_KEY_URL).then(r => r.data);
    const decoded = require('jsonwebtoken').verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

connect().then(() => {
  const db = getDb();

  app.get('/csrf-token', csrfProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      sameSite: 'Lax',
      secure: false
    });
    res.json({ csrfToken: token });
  });

  app.get('/users', authenticateJWT, async (req, res) => {
    try {
      const users = await db.collection('users')
        .find({}, { projection: { password: 0, _id: 0 } })
        .toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  app.get('/users/:id', authenticateJWT, async (req, res) => {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: 'ID inválido' });
    }
  });

  app.post('/users', csrfProtection, async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const result = await db.collection('users').insertOne({ email, password: hash, role });
      res.status(201).json({ userId: result.insertedId });
    } catch (err) {
      res.status(400).json({ error: 'Error al crear usuario' });
    }
  });

  app.put('/users/:id', authenticateJWT, async (req, res) => {
    try {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error al actualizar usuario' });
    }
  });

  app.delete('/users/:id', authenticateJWT, async (req, res) => {
    try {
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error al eliminar usuario' });
    }
  });

  app.post('/users/credentials', csrfProtection, async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.collection('users').findOne({ email });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

      res.json({ userId: user._id, email: user.email, role: user.role || 'USER' });
    } catch (err) {
      res.status(500).json({ error: 'Error al verificar credenciales' });
    }
  });

  app.use('/swagger-ui', express.static(path.join(__dirname, 'public')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'swagger-ui.html'));
  });

  app.listen(process.env.PORT, () => {
    console.log(`✅ User service escuchando en puerto ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('❌ Error al conectar con MongoDB:', err.message);
});
