const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel =
  require("../models/userModel");

function readBody(req) {
  return new Promise(
    (resolve, reject) => {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(
            new Error("Invalid JSON")
          );
        }
      });
    }
  );
}

async function register(req, res) {
  try {
    const data =
      await readBody(req);

    const existingUser =
      await userModel.findUserByEmail(
        data.email
      );

    if (existingUser) {
      res.writeHead(400, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "User already exists"
        })
      );

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      );

    const newUser =
      await userModel.createUser({
        email: data.email,
        password: hashedPassword
      });

    res.writeHead(201, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "User created successfully",
        userId: newUser._id
      })
    );

  } catch {
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

async function login(req, res) {
  try {
    const data =
      await readBody(req);

    const user =
      await userModel.findUserByEmail(
        data.email
      );

    if (!user) {
      res.writeHead(401, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "Invalid email or password"
        })
      );

      return;
    }

    const passwordCorrect =
      await bcrypt.compare(
        data.password,
        user.password
      );

    if (!passwordCorrect) {
      res.writeHead(401, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "Invalid email or password"
        })
      );

      return;
    }

    const token =
      jwt.sign(
        {
          userId: user._id,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

    res.writeHead(200, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Login successful",
        token
      })
    );

  } catch {
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

module.exports = {
  register,
  login
};