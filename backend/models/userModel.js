const { getDb } = require("../mongoDb");

async function findUserByEmail(email) {
  const db = getDb();

  return await db
    .collection("users")
    .findOne({ email });
}

async function createUser(user) {
  const db = getDb();

  const result = await db
    .collection("users")
    .insertOne(user);

  return {
    ...user,
    _id: result.insertedId
  };
}

module.exports = {
  findUserByEmail,
  createUser
};