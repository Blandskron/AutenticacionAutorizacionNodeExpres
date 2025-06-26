// auth-service/index.js (mejorado con verificación CSRF + credenciales desde user-service)

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { connect, getDb } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const redoc = require('redoc-express');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'keys', 'private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'keys', 'public.key'), 'utf8');

// Swagger y Redoc
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));
app.get('/redoc', redoc({ title: 'Auth Service API - Redoc', specUrl: '/swagger.json' }));

// Conexión a MongoDB
connect().then(() => console.log('✅ Auth service connected to MongoDB'));

// POST /login - Autenticación delegada al user-service con protección CSRF
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtener CSRF token desde user-service
    const csrfResponse = await axios.get('http://localhost:4000/csrf-token', {
      withCredentials: true
    });

    const csrfToken = csrfResponse.data.csrfToken;
    const cookies = csrfResponse.headers['set-cookie'];

    // Consultar credenciales en user-service con CSRF token
    const credentialsResponse = await axios.post(
      'http://localhost:4000/users/credentials',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: cookies
        },
        withCredentials: true
      }
    );

    const { userId, email: userEmail, role } = credentialsResponse.data;

    // Generar JWT y crear sesión
    const payload = { sub: userId, email: userEmail, role: role || 'USER' };
    const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1h' });

    const sessionId = uuidv4();
    const db = getDb();
    await db.collection('sessions').insertOne({
      sessionId,
      userId,
      token,
      createdAt: new Date(),
      active: true
    });

    res.json({ success: true, token, sessionId });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Error interno en login';
    res.status(status).json({ success: false, message });
  }
});

// POST /logout - Revocar sesión (marcar como inactiva)
app.post('/logout', async (req, res) => {
  const { sessionId } = req.body;
  const db = getDb();

  const result = await db.collection('sessions').updateOne(
    { sessionId },
    { $set: { active: false } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, message: 'Sesión no encontrada' });
  }

  res.json({ success: true, message: 'Sesión cerrada exitosamente' });
});

// GET /public-key - Para otros servicios
app.get('/public-key', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(PUBLIC_KEY);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('🚀 Auth service escuchando en http://localhost:3000');
});
