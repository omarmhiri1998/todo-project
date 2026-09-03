const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");

const todoRoutes =
  require("../routes/todoRoutes");

  const todoModel = require("../models/todoModel");

const controller =
  require("../controllers/todoController");

test("GET /todos should call getTodos", (t) => {

 
  const getTodosMock =
    t.mock.method(
      controller,
      "getTodos",
      () => {}
    );


  const req = {
    method: "GET",
    url: "/todos",
    headers: {
      host: "localhost:3000"
    }
  };


  const res = {};

  const result =
    todoRoutes(req, res);


  assert.strictEqual(
    result,
    true
  );

 
  assert.strictEqual(
    getTodosMock.mock.callCount(),
    1
  );
});
// 1. getAllTodos
test("getAllTodos should return todos", (t) => {

  t.mock.method(
    fs,
    "readFileSync",
    () =>
      JSON.stringify([
        {
          id: "1",
          contain: "Learn Node"
        }
      ])
  );

  const todos =
    todoModel.getAllTodos();

  assert.strictEqual(
    todos.length,
    1
  );

  assert.strictEqual(
    todos[0].contain,
    "Learn Node"
  );
});


// 2. createTodo
test("createTodo should create a new todo", (t) => {

  t.mock.method(
    fs,
    "readFileSync",
    () => "[]"
  );

  t.mock.method(
    fs,
    "writeFileSync",
    () => {}
  );

  const newTodo =
    todoModel.createTodo({
      category: "study",
      contain: "Learn TDD",
      datum: "",
      important: false
    });

  assert.strictEqual(
    newTodo.contain,
    "Learn TDD"
  );
});


// 3. updateTodo
test("updateTodo should update a todo", (t) => {

  t.mock.method(
    fs,
    "readFileSync",
    () =>
      JSON.stringify([
        {
          id: "1",
          category: "study",
          contain: "Learn Node",
          datum: "",
          important: false
        }
      ])
  );

  t.mock.method(
    fs,
    "writeFileSync",
    () => {}
  );

  const updatedTodo =
    todoModel.updateTodo(
      "1",
      {
        category: "study",
        contain: "Learn TDD",
        datum: "",
        important: true
      }
    );

  assert.strictEqual(
    updatedTodo.contain,
    "Learn TDD"
  );
});


// 4. deleteTodo
test("deleteTodo should delete a todo", (t) => {

  t.mock.method(
    fs,
    "readFileSync",
    () =>
      JSON.stringify([
        {
          id: "1",
          contain: "Learn Node"
        }
      ])
  );

  t.mock.method(
    fs,
    "writeFileSync",
    () => {}
  );

  const result =
    todoModel.deleteTodo("1");

  assert.strictEqual(
    result,
    true
  );
});