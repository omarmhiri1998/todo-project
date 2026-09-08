const path = require("path");
const dns = require("dns");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const { MongoClient } = require("mongodb");

const client = new MongoClient(
  process.env.MONGODB_URI
);

let db;

async function connectMongoDB() {
  await client.connect();

  db = client.db(
    process.env.MONGODB_DB
  );

  console.log("MongoDB Atlas connected");

  return db;
}

function getDb() {
  if (!db) {
    throw new Error(
      "MongoDB is not connected"
    );
  }

  return db;
}

module.exports = {
  connectMongoDB,
  getDb
};