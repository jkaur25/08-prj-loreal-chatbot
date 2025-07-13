const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// ✅ Your actual deployed Cloudflare Worker URL
const WORKER_URL = "https://ai-chatbot.jkaur5.workers.dev/";

// Initialize message history with system prompt
const messages = [
  {
    role: "system",
    content:
      "You are L’Oréal’s AI Beauty Assistant. You only answer questions about L’Oréal products, skincare, makeup, haircare, and beauty routines. Politely decline unrelated topics."
  }
];

// Display a message in the chat window
function appendMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = content;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show animated typing dots
function showTyping() {
  const typing = document.createElement("div");
  typing.className = "msg ai typing";
  typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  // Show user message
  appendMessage("user", `You: ${input}`);
  messages.push({ role: "user", content: input });
  userInput.value = "";

  // Show typing animation
  const loading = showTyping();

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();
    loading.remove();

    const reply = data.choices?.[0]?.message?.content?.trim() || "Hmm, no reply.";
    appendMessage("ai", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    loading.remove();
    appendMessage("ai", "⚠️ There was an error. Please try again later.");
  }
});

// Greet the user on load
appendMessage("ai", "👋 Hello! How can I help you today?");