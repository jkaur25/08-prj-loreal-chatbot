// Grab DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Greet the user on load
appendMessage("ai", "👋 Hello! How can I help you today?");

// Replace with your Cloudflare Worker endpoint
const CLOUDFLARE_URL = "https://ai-chatbot.jkaur5.workers.dev/";

// When the user submits a question
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form refresh

  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input); // Show user message
  userInput.value = ""; // Clear the field

  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that only answers questions about L’Oréal products, skincare, makeup, haircare, and routines. Kindly refuse off-topic questions."
    },
    {
      role: "user",
      content: input
    }
  ];

  try {
    const response = await fetch(CLOUDFLARE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    appendMessage("ai", reply);
  } catch (err) {
    console.error("Error:", err);
    appendMessage("ai", "⚠️ Oops! Something went wrong.");
  }
});

// Show messages in the chat window
function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("msg", role);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
