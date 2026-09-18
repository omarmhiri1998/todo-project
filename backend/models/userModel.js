const {
  ObjectId
} = require("mongodb");

const {
  getDb
} = require("../mongoDb");

async function findUserByEmail(
  email
) {
  const db = getDb();

  return await db
    .collection("users")
    .findOne({
      email
    });
}

async function findUserById(
  id
) {
  const db = getDb();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await db
    .collection("users")
    .findOne({
      _id: new ObjectId(id)
    });
}

async function createUser(
  user
) {
  const db = getDb();

  const result = await db
    .collection("users")
    .insertOne(user);

  return {
    ...user,
    _id: result.insertedId
  };
}

async function getAllUsers() {
  const db = getDb();

  const users = await db
    .collection("users")
    .find(
      {},
      {
        projection: {
          password: 0
        }
      }
    )
    .toArray();

  return users.map(
    (user) => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role || "user"
    })
  );
}

async function updateUserRole(
  id,
  role
) {
  const db = getDb();

  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await db
    .collection("users")
    .updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          role
        }
      }
    );

  return result.matchedCount > 0;
}

async function deleteUser(
  id
) {
  const db = getDb();

  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await db
    .collection("users")
    .deleteOne({
      _id: new ObjectId(id)
    });

  return result.deletedCount > 0;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  updateUserRole,
  deleteUser
};