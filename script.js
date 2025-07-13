const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Replace with your deployed Cloudflare Worker URL:
const WORKER_URL = "https://ai-chatbot.jkaur5.workers.dev/";

function appendMessage(role, content) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${role}`;
  msgDiv.textContent = content;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingDots() {
  const typing = document.createElement("div");
  typing.className = "msg ai typing";
  typing.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const typingDots = showTypingDots();

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    typingDots.remove();

    if (data.choices && data.choices[0]) {
      appendMessage("ai", data.choices[0].message.content.trim());
    } else {
      appendMessage("ai", "⚠️ No response from assistant.");
    }
  } catch (error) {
    typingDots.remove();
    appendMessage("ai", `⚠️ Error: ${error.message}`);
  }
});
