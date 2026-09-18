const userModel =
  require("../models/userModel");

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
          resolve(
            body
              ? JSON.parse(body)
              : {}
          );
        } catch {
          reject(
            new Error("Invalid JSON")
          );
        }
      });

      req.on(
        "error",
        reject
      );
    }
  );
}

async function getUsers(
  req,
  res
) {
  try {
    const users =
      await userModel.getAllUsers();

    res.writeHead(200, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify(users)
    );

  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Database error"
      })
    );
  }
}

async function updateRole(
  req,
  res,
  id
) {
  try {
    const data =
      await readBody(req);

    if (
      data.role !== "user" &&
      data.role !== "admin"
    ) {
      res.writeHead(400, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "Invalid role"
        })
      );

      return;
    }

    if (
      id === req.user.userId &&
      data.role !== "admin"
    ) {
      res.writeHead(400, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "You cannot remove your own admin role"
        })
      );

      return;
    }

    const updated =
      await userModel.updateUserRole(
        id,
        data.role
      );

    if (!updated) {
      res.writeHead(404, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "User not found"
        })
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Role updated"
      })
    );

  } catch (error) {
    console.error(error);

    res.writeHead(400, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Invalid request"
      })
    );
  }
}

async function deleteUser(
  req,
  res,
  id
) {
  try {
    if (
      id === req.user.userId
    ) {
      res.writeHead(400, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "You cannot delete your own account"
        })
      );

      return;
    }

    const deleted =
      await userModel.deleteUser(
        id
      );

    if (!deleted) {
      res.writeHead(404, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "User not found"
        })
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "User deleted"
      })
    );

  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Database error"
      })
    );
  }
}

module.exports = {
  getUsers,
  updateRole,
  deleteUser
};