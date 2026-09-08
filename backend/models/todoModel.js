const { ObjectId } = require("mongodb");
const { getDb } = require("../mongoDb");

async function getAllTodos() {
  const db = getDb();

  const todos = await db
    .collection("todos")
    .find()
    .toArray();

  return todos.map((todo) => ({
    id: todo._id.toString(),
    category: todo.category,
    contain: todo.contain,
    datum: todo.datum || "",
    important: todo.important,
  }));
}

async function createTodo(data) {
  const db = getDb();

  const newTodo = {
    category: data.category,
    contain: data.contain,
    datum: data.datum || "",
    important: data.important,
  };

  const result = await db
    .collection("todos")
    .insertOne(newTodo);

  return {
    id: result.insertedId.toString(),
    ...newTodo,
  };
}

async function updateTodo(id, newData) {
  const db = getDb();

  const result = await db
    .collection("todos")
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          category: newData.category,
          contain: newData.contain,
          datum: newData.datum || "",
          important: newData.important,
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

async function deleteTodo(id) {
  const db = getDb();

  const result = await db
    .collection("todos")
    .deleteOne({
      _id: new ObjectId(id),
    });

  return result.deletedCount > 0;
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};