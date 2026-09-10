
const { ObjectId } = require("mongodb");
const { getDb } = require("../mongoDb");

async function getAllTodos(userId) {
  const db = getDb();

  const todos = await db
    .collection("todos")
    .find({
      userId: userId
    })
    .toArray();

  return todos.map((todo) => ({
    id: todo._id.toString(),
    category: todo.category,
    contain: todo.contain,
    datum: todo.datum || "",
    important: todo.important,
  }));
}

async function createTodo(
  data,
  userId
) {
  const db = getDb();

  const newTodo = {
    category: data.category,
    contain: data.contain,
    datum: data.datum || "",
    important: data.important,

    userId: userId
  };

  const result = await db
    .collection("todos")
    .insertOne(newTodo);

  return {
    id: result.insertedId.toString(),
    ...newTodo,
  };
}

async function updateTodo(
  id,
  userId,
  newData
) {
  const db = getDb();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const result = await db
    .collection("todos")
    .updateOne(
      {
        _id: new ObjectId(id),

        userId: userId
      },
      {
        $set: {
          category:
            newData.category,

          contain:
            newData.contain,

          datum:
            newData.datum || "",

          important:
            newData.important,
        },
      }
    );

  if (result.matchedCount === 0) {
    return null;
  }

  return {
    id,
    category: newData.category,
    contain: newData.contain,
    datum: newData.datum || "",
    important: newData.important,
  };
}

async function deleteTodo(
  id,
  userId
) {
  const db = getDb();

  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await db
    .collection("todos")
    .deleteOne({
      _id: new ObjectId(id),

      userId: userId
    });

  return result.deletedCount > 0;
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};

