const jwt = require("jsonwebtoken");

function authenticate(req, res) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message: "No token provided"
      })
    );

    return false;
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message: "Invalid token"
      })
    );

    return false;
  }

  try {
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    return true;

  } catch {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Invalid or expired token"
      })
    );

    return false;
  }
}

module.exports = authenticate;