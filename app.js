// Create a WebSocket connection to the server
const socket = new WebSocket("ws://localhost:8080");

// DOM elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const usernameRadioButtons = document.getElementsByName("username");
const cursor = document.querySelector("#cursor");

// Function to get the selected username from the radio buttons
function getSelectedUsername() {
  for (let radio of usernameRadioButtons) {
    if (radio.checked) return radio.value;
  }
  return "Omochi"; // Default username
}

// When a message is received from the server
socket.onmessage = (event) => {
  let message = event.data;

  // Ensure the message is a string
  if (message instanceof Blob) {
    const reader = new FileReader();
    reader.onload = () => displayMessage(reader.result);
    reader.readAsText(message);
  } else {
    displayMessage(message);
  }
};

// Function to display the message
function displayMessage(message) {
  if (!chatBox) return;

  const messageElement = document.createElement("div");

  // Extract sender name and content
  const [sender, ...msgParts] = message.split(":");
  const msgContent = msgParts.join(":").trim();

  // Format sender's name
  const senderNameElement = document.createElement("span");
  senderNameElement.textContent = `${sender}: `;
  senderNameElement.classList.add("sender-name");

  // Create message content element
  const messageTextElement = document.createElement("span");
  messageTextElement.textContent = msgContent;

  // Append elements to chatBox
  messageElement.appendChild(senderNameElement);
  messageElement.appendChild(messageTextElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Send a message when the send button is clicked
sendButton?.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.send(`${getSelectedUsername()}: ${message}`);
    messageInput.value = "";
  }
});

// Allow sending messages with Enter key
messageInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendButton?.click();
});

// Cursor animations
if (cursor) {
  const cursorFollower = (event) => {
    cursor.style.top = `${event.pageY}px`;
    cursor.style.left = `${event.pageX}px`;
  };

  const cursorClickTrue = () => {
    cursor.style.width = "22px";
    cursor.style.height = "22px";
  };

  const cursorClickFalse = () => {
    cursor.style.width = "12px";
    cursor.style.height = "12px";
  };

  const cursorEnter = () => (cursor.style.opacity = 1);
  const cursorLeave = () => (cursor.style.opacity = 0);

  document.addEventListener("mousemove", cursorFollower);
  document.addEventListener("mousedown", cursorClickTrue);
  document.addEventListener("mouseup", cursorClickFalse);
  document.addEventListener("mouseleave", cursorLeave);
  document.addEventListener("mouseenter", cursorEnter);
}
