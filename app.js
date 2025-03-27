const WebSocket = require("ws");
const http = require("http");
const path = require("path");
const fs = require("fs");

// Create an HTTP server to serve static files
const server = http.createServer((req, res) => {
  // Serve index.html
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "index.html")).pipe(res);
  }
  // Serve style.css
  else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    fs.createReadStream(path.join(__dirname, "style.css")).pipe(res);
  }
  // Serve app.js
  else if (req.url === "/app.js") {
    res.writeHead(200, { "Content-Type": "application/javascript" });
    fs.createReadStream(path.join(__dirname, "app.js")).pipe(res);
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
        client.send(message);
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

// Client-side script integration
const socket = new WebSocket("ws://localhost:8080");

// DOM elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const usernameRadioButtons = document.getElementsByName("username");

// Function to get the selected username from the radio buttons
function getSelectedUsername() {
  for (let i = 0; i < usernameRadioButtons.length; i++) {
    if (usernameRadioButtons[i].checked) {
      return usernameRadioButtons[i].value;
    }
  }
  return "Omochi"; // Default username
}

// When a message is received from the server
socket.onmessage = (event) => {
  let message = event.data;

  // Ensure the message is a string
  if (message instanceof Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      message = reader.result;
      displayMessage(message);
    };
    reader.readAsText(message);
  } else {
    displayMessage(message);
  }
};

// Function to display the message
function displayMessage(message) {
  const messageElement = document.createElement("div");
  const [sender, ...msgParts] = message.split(":");
  const msgContent = msgParts.join(":").trim();

  const senderNameElement = document.createElement("span");
  senderNameElement.textContent = `${sender}: `;
  senderNameElement.classList.add("sender-name");

  const messageTextElement = document.createElement("span");
  messageTextElement.textContent = msgContent;

  messageElement.appendChild(senderNameElement);
  messageElement.appendChild(messageTextElement);

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a message to the server when the send button is clicked
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    const username = getSelectedUsername();
    const formattedMessage = `${username}: ${message}`;
    socket.send(formattedMessage);
    messageInput.value = "";
  }
});

// Allow sending message with Enter key
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

// Cursor animation
var cursor = document.querySelector("#cursor");

const cursorFollower = (debts) => {
  cursor.style.top = debts.pageY + "px";
  cursor.style.left = debts.pageX + "px";
  cursor.animate(
    {
      left: debts.pageX + "px",
      top: debts.pageY + "px",
    },
    350
  );
};

const cursorClickTrue = () => {
  cursor.style.width = "22px";
  cursor.style.height = "22px";
};

const cursorClickFalse = () => {
  cursor.style.width = "12px";
  cursor.style.height = "12px";
};

const cursorEnter = () => {
  cursor.style.opacity = 1;
};

const cursorLeave = () => {
  cursor.style.opacity = 0;
};

const cursorInitialisation = () => {
  document.addEventListener("mousemove", cursorFollower);
  document.addEventListener("mousedown", cursorClickTrue);
  document.addEventListener("mouseup", cursorClickFalse);
  document.addEventListener("mouseleave", cursorLeave);
  document.addEventListener("mouseenter", cursorEnter);
};

cursorInitialisation();
