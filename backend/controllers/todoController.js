
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

      req.on(
        "data",
        (chunk) => {
          body += chunk;
        }
      );

      req.on("end", () => {
        try {
          const data = body
            ? JSON.parse(body)
            : {};

          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      req.on(
        "error",
        reject
      );
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

async function renderAllTodos(
  res,
  userId,
  statusCode = 200
) {
  const todos =
    await todoModel.getAllTodos(
      userId
    );

  const html =
    todoView.renderCards(
      todos
    );

  sendHtml(
    res,
    html,
    statusCode
  );
}

async function getTodos(
  req,
  res
) {
  try {
    const userId =
      req.user.userId;

    await renderAllTodos(
      res,
      userId
    );

  } catch (error) {
    console.error(error);

    sendError(
      res,
      "Database error",
      500
    );
  }
}

async function createTodo(
  req,
  res
) {
  try {
    const userId =
      req.user.userId;

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

    await todoModel.createTodo(
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
      },
      userId
    );

    await renderAllTodos(
      res,
      userId,
      201
    );

  } catch (error) {
    console.error(error);

    sendError(
      res,
      "Invalid request",
      400
    );
  }
}

async function updateTodo(
  req,
  res,
  id
) {
  try {
    const userId =
      req.user.userId;

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
      await todoModel.updateTodo(
        id,
        userId,
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

    await renderAllTodos(
      res,
      userId
    );

  } catch (error) {
    console.error(error);

    sendError(
      res,
      "Invalid request",
      400
    );
  }
}

async function deleteTodo(
  req,
  res,
  id
) {
  try {
    const userId =
      req.user.userId;

    const deleted =
      await todoModel.deleteTodo(
        id,
        userId
      );

    if (!deleted) {
      return sendError(
        res,
        "Todo not found",
        404
      );
    }

    await renderAllTodos(
      res,
      userId
    );

  } catch (error) {
    console.error(error);

    sendError(
      res,
      "Database error",
      500
    );
  }
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};

