const todoModel =
  require("../models/todoModel");

const todoView =
  require("../views/todoView");

const allowedCategories = [
  "work",
  "studys",
  "sport",
  "health",
  "voyage",
];

function readBody(req) {
  return new Promise(
    (resolve, reject) => {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const data =
            body
              ? JSON.parse(body)
              : {};

          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      req.on("error", reject);
    }
  );
}

function sendHtml(
  res,
  html,
  statusCode = 200
) {
  res.writeHead(
    statusCode,
    {
      "Content-Type":
        "text/html; charset=utf-8",
    }
  );

  res.end(html);
}

function sendError(
  res,
  message,
  statusCode = 400
) {
  res.writeHead(
    statusCode,
    {
      "Content-Type":
        "text/plain; charset=utf-8",
    }
  );

  res.end(message);
}

function validateTodo(data) {
  if (
    !data.contain ||
    !data.contain.trim()
  ) {
    return "Todo text is required";
  }

  if (
    !allowedCategories.includes(
      data.category
    )
  ) {
    return "Invalid category";
  }

  return null;
}

function renderAllTodos(
  res,
  statusCode = 200
) {
  const todos =
    todoModel.getAllTodos();

  const html =
    todoView.renderCards(todos);

  sendHtml(
    res,
    html,
    statusCode
  );
}

// GET /todos
function getTodos(req, res) {
  renderAllTodos(res);
}

// POST /todos
async function createTodo(req, res) {
  try {
    const data =
      await readBody(req);

    const validationError =
      validateTodo(data);

    if (validationError) {
      return sendError(
        res,
        validationError,
        400
      );
    }

    todoModel.createTodo({
      category: data.category,

      contain:
        data.contain.trim(),

      datum:
        data.datum || "",

      important:
        Boolean(data.important),
    });

    renderAllTodos(
      res,
      201
    );
  } catch (error) {
    sendError(
      res,
      "Invalid request",
      400
    );
  }
}

// PUT /todos/:id
async function updateTodo(
  req,
  res,
  id
) {
  try {
    const data =
      await readBody(req);

    const validationError =
      validateTodo(data);

    if (validationError) {
      return sendError(
        res,
        validationError,
        400
      );
    }

    const updatedTodo =
      todoModel.updateTodo(
        id,
        {
          category:
            data.category,

          contain:
            data.contain.trim(),

          datum:
            data.datum || "",

          important:
            Boolean(
              data.important
            ),
        }
      );

    if (!updatedTodo) {
      return sendError(
        res,
        "Todo not found",
        404
      );
    }

    renderAllTodos(res);
  } catch (error) {
    sendError(
      res,
      "Invalid request",
      400
    );
  }
}

// DELETE /todos/:id
function deleteTodo(
  req,
  res,
  id
) {
  const deleted =
    todoModel.deleteTodo(id);

  if (!deleted) {
    return sendError(
      res,
      "Todo not found",
      404
    );
  }

  renderAllTodos(res);
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};