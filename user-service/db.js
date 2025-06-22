// db.js
const { MongoClient } = require('mongodb');

// CAMBIA 'mongo' por 'localhost'
const client = new MongoClient('mongodb://admin:admin123@localhost:27017');
let db;

async function connect() {
  try {
    await client.connect();
    db = client.db('labinseguro');
    console.log('✅ Conectado a MongoDB en localhost');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
  }
}

function getDb() {
  if (!db) throw new Error('❌ Base de datos no conectada');
  return db;
}

module.exports = { connect, getDb };
