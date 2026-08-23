const http = require("http");
const todoRoutes = require("./routes/todoRoutes");

const server = http.createServer((req, res) => {

  // CORS — يجب أن تكون قبل Router
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  // Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }


  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end("Todo Backend is running");
    return;
  }


  const handled = todoRoutes(req, res);


  if (!handled) {
    res.writeHead(404, {
      "Content-Type": "text/plain"
    });

    res.end("Route not found");
  }
});


server.listen(3070, () => {
  console.log(
    "Server running on http://localhost:3070"
  );
});