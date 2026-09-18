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
          resolve(
            JSON.parse(body)
          );
        } catch {
          reject(
            new Error("Invalid JSON")
          );
        }
      });
    }
  );
}

function getCookieOptions(
  maxAge
) {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  if (isProduction) {
    return (
      `HttpOnly; Secure; ` +
      `SameSite=None; Path=/; ` +
      `Max-Age=${maxAge}`
    );
  }

  return (
    `HttpOnly; SameSite=Lax; ` +
    `Path=/; Max-Age=${maxAge}`
  );
}

function getCookie(
  req,
  name
) {
  const cookieHeader =
    req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies =
    cookieHeader.split(";");

  for (const cookie of cookies) {
    const [
      cookieName,
      ...cookieValue
    ] =
      cookie
        .trim()
        .split("=");

    if (cookieName === name) {
      return decodeURIComponent(
        cookieValue.join("=")
      );
    }
  }

  return null;
}

async function register(
  req,
  res
) {
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
        password: hashedPassword,
        role: "user"
      });

    res.writeHead(201, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "User created successfully",

        userId:
          newUser._id.toString()
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

async function login(
  req,
  res
) {
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

    const accessToken =
      jwt.sign(
        {
          userId:
            user._id.toString(),

          email:
            user.email,

          role:
            user.role || "user"
        },
        process.env
          .ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m"
        }
      );

    const refreshToken =
      jwt.sign(
        {
          userId:
            user._id.toString()
        },
        process.env
          .REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.writeHead(200, {
      "Content-Type":
        "application/json",

      "Set-Cookie": [
        `accessToken=${accessToken}; ` +
          getCookieOptions(900),

        `refreshToken=${refreshToken}; ` +
          getCookieOptions(604800),

        `token=; ` +
          getCookieOptions(0)
      ]
    });

    res.end(
      JSON.stringify({
        message:
          "Login successful"
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

async function refresh(
  req,
  res
) {
  const refreshToken =
    getCookie(
      req,
      "refreshToken"
    );

  if (!refreshToken) {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Refresh token required"
      })
    );

    return;
  }

  try {
    const decoded =
      jwt.verify(
        refreshToken,
        process.env
          .REFRESH_TOKEN_SECRET
      );

    const user =
      await userModel.findUserById(
        decoded.userId
      );

    if (!user) {
      res.writeHead(401, {
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

    const newAccessToken =
      jwt.sign(
        {
          userId:
            user._id.toString(),

          email:
            user.email,

          role:
            user.role || "user"
        },
        process.env
          .ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m"
        }
      );

    res.writeHead(200, {
      "Content-Type":
        "application/json",

      "Set-Cookie":
        `accessToken=${newAccessToken}; ` +
        getCookieOptions(900)
    });

    res.end(
      JSON.stringify({
        message:
          "Access token refreshed"
      })
    );

  } catch {
    res.writeHead(401, {
      "Content-Type":
        "application/json",

      "Set-Cookie": [
        `accessToken=; ` +
          getCookieOptions(0),

        `refreshToken=; ` +
          getCookieOptions(0)
      ]
    });

    res.end(
      JSON.stringify({
        message:
          "Invalid or expired refresh token"
      })
    );
  }
}

function logout(
  req,
  res
) {
  res.writeHead(200, {
    "Content-Type":
      "application/json",

    "Set-Cookie": [
      `accessToken=; ` +
        getCookieOptions(0),

      `refreshToken=; ` +
        getCookieOptions(0),

      `token=; ` +
        getCookieOptions(0)
    ]
  });

  res.end(
    JSON.stringify({
      message:
        "Logout successful"
    })
  );
}

function session(
  req,
  res
) {
  res.writeHead(200, {
    "Content-Type":
      "application/json"
  });

  res.end(
    JSON.stringify({
      authenticated: true,

      user: {
        userId:
          req.user.userId,

        email:
          req.user.email,

        role:
          req.user.role
      }
    })
  );
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  session
};