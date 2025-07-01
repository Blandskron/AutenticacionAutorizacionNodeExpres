// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connect() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    console.log(`✅ Conectado a MongoDB: ${process.env.MONGO_DB_NAME}`);
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
  }
}

function getDb() {
  if (!db) throw new Error('❌ Base de datos no conectada');
  return db;
}

module.exports = { connect, getDb };
