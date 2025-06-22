const express = require('express');
const cors = require('cors');
const { connect, getDb } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connect().then(() => {
  console.log('Auth service connected to MongoDB');
});

// POST /login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.collection('users').findOne({ email, password }); // texto plano
  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false });
  }
});

// GET /logout
app.get('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada (no real)' });
});

app.listen(3000, () => console.log('Auth service escuchando en puerto 3000'));
