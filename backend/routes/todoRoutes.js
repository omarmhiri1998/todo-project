const controller =
  require(
    "../controllers/todoController"
  );

function todoRoutes(req, res) {
  const url =
    new URL(
      req.url,
      `http://${req.headers.host}`
    );

  const pathname =
    url.pathname;

  // GET /todos
  if (
    req.method === "GET" &&
    pathname === "/todos"
  ) {
    controller.getTodos(
      req,
      res
    );

    return true;
  }

  // POST /todos
  if (
    req.method === "POST" &&
    pathname === "/todos"
  ) {
    controller.createTodo(
      req,
      res
    );

    return true;
  }

  const match =
    pathname.match(
      /^\/todos\/([^/]+)$/
    );

  if (match) {
    const id =
      decodeURIComponent(
        match[1]
      );

    // PUT /todos/:id
    if (
      req.method === "PUT"
    ) {
      controller.updateTodo(
        req,
        res,
        id
      );

      return true;
    }

    // DELETE /todos/:id
    if (
      req.method === "DELETE"
    ) {
      controller.deleteTodo(
        req,
        res,
        id
      );

      return true;
    }
  }

  return false;
}

module.exports =
  todoRoutes;