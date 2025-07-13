
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Replace with your deployed Cloudflare Worker URL
const WORKER_URL = "ttps://ai-chatbot.jkaur5.workers.dev/";

const messages = [
  {
    role: "system",
    content:
      "You are L’Oréal’s AI Beauty Assistant. Only answer questions about L’Oréal products, beauty routines, skincare, makeup, haircare, fragrances, or beauty tips. Politely decline off-topic questions."
  }
];

function appendMessage(role, content) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = content;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingDots() {
  const typing = document.createElement("div");
  typing.className = "msg ai typing";
  typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  messages.push({ role: "user", content: message });
  userInput.value = "";

  const typingDots = showTypingDots();

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();
    typingDots.remove();

    const reply = data.choices?.[0]?.message?.content?.trim() || "No response.";
    appendMessage("ai", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    typingDots.remove();
    appendMessage("ai", `⚠️ Error: ${err.message}`);
  }
});
