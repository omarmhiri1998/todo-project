
const http = require("http");

const todoRoutes =
  require("./routes/todoRoutes");

const authRoutes =
  require("./routes/authRoutes");

const authenticate =
  require("./middleware/authMiddleware");

const { connectMongoDB } =
  require("./mongoDb");

const server = http.createServer(
  async (req, res) => {

    const allowedOrigins = [
      "http://localhost:5173",
      "https://to-do-list-opal-six-60.vercel.app",
      "https://omar-todolist.vercel.app"
    ];

    const origin =
      req.headers.origin;

    if (
      allowedOrigins.includes(origin)
    ) {
      res.setHeader(
        "Access-Control-Allow-Origin",
        origin
      );
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (
      req.method === "GET" &&
      req.url === "/"
    ) {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });

      res.end(
        "Todo Backend is running"
      );

      return;
    }

    const authHandled =
      await authRoutes(req, res);

    if (authHandled) {
      return;
    }

    if (
      req.url.startsWith("/todos")
    ) {
      const authenticated =
        authenticate(req, res);

      if (!authenticated) {
        return;
      }
    }

    const handled =
      todoRoutes(req, res);

    if (!handled) {
      res.writeHead(404, {
        "Content-Type": "text/plain"
      });

      res.end("Route not found");
    }
  }
);

const PORT =
  process.env.PORT || 3070;

connectMongoDB()
  .then(() => {

    server.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error
    );

  });
