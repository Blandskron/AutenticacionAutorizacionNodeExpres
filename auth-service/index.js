const express = require('express');
const cors = require('cors');
const { connect, getDb } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const redoc = require('redoc-express');
const path = require('path');

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());

// Swagger UI en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Servir el archivo swagger.json para Redoc
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

// Redoc UI en /redoc
app.get('/redoc', redoc({
  title: 'Auth Service API - Redoc',
  specUrl: '/swagger.json'
}));

// Conexión a MongoDB
connect().then(() => {
  console.log('✅ Auth service connected to MongoDB');
});

// Endpoints
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.collection('users').findOne({ email, password });
  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false });
  }
});

app.get('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada (no real)' });
});

// Iniciar servidor
app.listen(3000, () => console.log('🚀 Auth service escuchando en http://localhost:3000'));
