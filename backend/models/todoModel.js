const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const filePath = path.join(
  __dirname,
  "../data/todos.json"
);

function getAllTodos() {
  const data = fs.readFileSync(
    filePath,
    "utf-8"
  );

  if (!data.trim()) {
    return [];
  }

  return JSON.parse(data);
}

function saveTodos(todos) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(todos, null, 2)
  );
}

function createTodo(data) {
  const todos = getAllTodos();

  const newTodo = {
    id: randomUUID(),

    category: data.category,
    contain: data.contain,
    datum: data.datum,
    important: data.important,
  };

  todos.push(newTodo);

  saveTodos(todos);

  return newTodo;
}

function updateTodo(id, newData) {
  const todos = getAllTodos();

  const todo = todos.find(
    (todo) => todo.id === id
  );

  if (!todo) {
    return null;
  }

  todo.category = newData.category;
  todo.contain = newData.contain;
  todo.datum = newData.datum;
  todo.important = newData.important;

  saveTodos(todos);

  return todo;
}

function deleteTodo(id) {
  const todos = getAllTodos();

  const filteredTodos = todos.filter(
    (todo) => todo.id !== id
  );

  if (
    filteredTodos.length === todos.length
  ) {
    return false;
  }

  saveTodos(filteredTodos);

  return true;
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};