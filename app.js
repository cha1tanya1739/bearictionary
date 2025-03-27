// Create a WebSocket connection to the server
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
    // If it's a Blob, convert it to a string
    const reader = new FileReader();
    reader.onloadend = () => {
      message = reader.result; // The Blob is now a string

      // Process the message (split by ":")
      displayMessage(message);
    };
    reader.readAsText(message);
  } else {
    // If it's already a string, process it directly
    displayMessage(message);
  }
};

// Function to display the message
function displayMessage(message) {
  const messageElement = document.createElement("div");

  // Split the message into the sender's name and the message content
  const [sender, ...msgParts] = message.split(":");
  const msgContent = msgParts.join(":").trim();

  // Format the sender's name with a different color
  const senderNameElement = document.createElement("span");
  senderNameElement.textContent = `${sender}: `;
  senderNameElement.classList.add("sender-name"); // Add a class to style it

  // Create the message content element
  const messageTextElement = document.createElement("span");
  messageTextElement.textContent = msgContent;

  // Append the sender's name and the message content
  messageElement.appendChild(senderNameElement);
  messageElement.appendChild(messageTextElement);

  // Add the message to the chat
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Send a message to the server when the send button is clicked
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    // Get the selected username
    const username = getSelectedUsername();

    // Format the message with the username as prefix
    const formattedMessage = `${username}: ${message}`;
    socket.send(formattedMessage); // Send the formatted message
    messageInput.value = ""; // Clear the input field
  }
});

// Allow sending message with Enter key
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

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
