const http = require("http");
const fs = require("fs");

const todoRoutes =
  require("../routes/todoRoutes");

afterEach(() => {
  jest.restoreAllMocks();
});

test("GET /todos should return todos", async () => {

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

  const server = http.createServer(
    (req, res) => {

      const handled =
        todoRoutes(req, res);

      if (!handled) {
        res.writeHead(404);
        res.end("Not Found");
      }
    }
  );

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const port =
    server.address().port;

  const response =
    await fetch(
      `http://localhost:${port}/todos`
    );

  const body =
    await response.text();

  expect(response.status)
    .toBe(200);

  expect(body)
    .toContain("Learn Node");

  await new Promise((resolve) => {
    server.close(resolve);
  });
});