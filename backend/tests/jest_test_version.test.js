
const fs = require("fs");

const todoRoutes =
  require("../routes/todoRoutes");

const todoModel =
  require("../models/todoModel");

const controller =
  require("../controllers/todoController");

afterEach(() => {
  jest.restoreAllMocks();
});

test("GET /todos should call getTodos", () => {
  const getTodosMock =
    jest
      .spyOn(controller, "getTodos")
      .mockImplementation(() => {});

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

  expect(result)
    .toBe(true);

  expect(getTodosMock)
    .toHaveBeenCalledTimes(1);
});

test("getAllTodos should return todos", () => {
  jest
    .spyOn(fs, "readFileSync")
    .mockReturnValue(
      JSON.stringify([
        {
          id: "1",
          contain: "Learn Node"
        }
      ])
    );

  const todos =
    todoModel.getAllTodos();

  expect(todos.length)
    .toBe(1);

  expect(todos[0].contain)
    .toBe("Learn Node");
});

test("createTodo should create a new todo", () => {
  jest
    .spyOn(fs, "readFileSync")
    .mockReturnValue("[]");

  jest
    .spyOn(fs, "writeFileSync")
    .mockImplementation(() => {});

  const newTodo =
    todoModel.createTodo({
      category: "study",
      contain: "Learn TDD",
      datum: "",
      important: false
    });

  expect(newTodo.contain)
    .toBe("Learn TDD");
});

test("updateTodo should update a todo", () => {
  jest
    .spyOn(fs, "readFileSync")
    .mockReturnValue(
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

  jest
    .spyOn(fs, "writeFileSync")
    .mockImplementation(() => {});

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

  expect(updatedTodo.contain)
    .toBe("Learn TDD");
});

test("deleteTodo should delete a todo", () => {
  jest
    .spyOn(fs, "readFileSync")
    .mockReturnValue(
      JSON.stringify([
        {
          id: "1",
          contain: "Learn Node"
        }
      ])
    );

  jest
    .spyOn(fs, "writeFileSync")
    .mockImplementation(() => {});

  const result =
    todoModel.deleteTodo("1");

  expect(result)
    .toBe(true);
});
