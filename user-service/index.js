const express = require('express');
const cors = require('cors');
const { connect, getDb } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { ObjectId } = require('mongodb');

const app = express();

// ✅ Configuración CORS completa (para Swagger UI y navegadores)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Soporte para JSON y preflight
app.use(express.json());
app.options('*', cors()); // respuesta a OPTIONS automática

// ✅ Swagger UI disponible en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Inicia conexión con MongoDB y define los endpoints
 */
connect().then(() => {
  const db = getDb();

  // GET /users - Lista todos los usuarios
  app.get('/users', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  // GET /users/:id - Devuelve un usuario por ID
  app.get('/users/:id', async (req, res) => {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: 'ID inválido' });
    }
  });

  // POST /users - Crea un nuevo usuario
  app.post('/users', async (req, res) => {
    try {
      const result = await db.collection('users').insertOne(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error al crear usuario' });
    }
  });

  // PUT /users/:id - Actualiza un usuario
  app.put('/users/:id', async (req, res) => {
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

  // DELETE /users/:id - Elimina un usuario
  app.delete('/users/:id', async (req, res) => {
    try {
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error al eliminar usuario' });
    }
  });

  // ✅ Escuchar solicitudes luego de la conexión exitosa
  app.listen(4000, () => {
    console.log('✅ User service escuchando en puerto 4000');
  });
}).catch(err => {
  console.error('❌ Error al conectar con MongoDB:', err.message);
});
