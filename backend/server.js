const http = require("http");

const todoRoutes = require("./routes/todoRoutes");

const server = http.createServer((req, res) => {

  // Frontends allowed to use this backend
  const allowedOrigins = [
    "http://localhost:5173",
    "https://to-do-list-opal-six-60.vercel.app"
  ];

  const origin = req.headers.origin;

  // CORS
  if (allowedOrigins.includes(origin)) {
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
    "Content-Type"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Home route
  if (
    req.method === "GET" &&
    req.url === "/"
  ) {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end("Todo Backend is running");

    return;
  }

  // Todo routes
  const handled = todoRoutes(req, res);

  if (!handled) {
    res.writeHead(404, {
      "Content-Type": "text/plain"
    });

    res.end("Route not found");
  }
});


const PORT =
  process.env.PORT || 3070;

server.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);