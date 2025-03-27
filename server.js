const WebSocket = require("ws");
const http = require("http");
const path = require("path");
const fs = require("fs");

// Create an HTTP server to serve static files
const server = http.createServer((req, res) => {
  // Serve index.html
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "public", "index.html")).pipe(res);
  }
  // Serve style.css
  else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    fs.createReadStream(path.join(__dirname, "public", "style.css")).pipe(res);
  }
  // Serve app.js
  else if (req.url === "/app.js") {
    res.writeHead(200, { "Content-Type": "application/javascript" });
    fs.createReadStream(path.join(__dirname, "public", "app.js")).pipe(res);
  }
  // Return a 404 for other requests
  else {
    res.writeHead(404);
    res.end();
  }
});

// Create the WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// When a client connects to the WebSocket server
wss.on("connection", (ws) => {
  console.log("A user connected");

  // Handle incoming messages from clients
  ws.on("message", (message) => {
    console.log("Received message: %s", message);
    // Broadcast the message to all other clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); // Send the message as a string
      }
    });
  });

  // Handle client disconnections
  ws.on("close", () => {
    console.log("A user disconnected");
  });
});

// Start the server on port 8080
server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
