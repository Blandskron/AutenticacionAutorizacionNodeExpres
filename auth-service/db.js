const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://admin:admin123@localhost:27017');
let db;

async function connect() {
  await client.connect();
  db = client.db('labinseguro');
}

function getDb() {
  return db;
}

module.exports = { connect, getDb };
