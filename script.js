 // Fetch Medium Articles via RSS2JSON
  fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@kirtikau")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("articles-learning");
    container.innerHTML = "";
    data.items.slice(0,5).forEach(post => {
      const article = document.createElement("div");
      article.classList.add("article-card");
      article.innerHTML = `
        <h3>${post.title}</h3>
        <p>${new Date(post.pubDate).toLocaleDateString()}</p>
        <a href="${post.link}" target="_blank">Read on Medium</a>
      `;
      container.appendChild(article);
    });
  })
  .catch(err => {
    document.getElementById("articles").innerHTML = "<p>Failed to load articles.</p>";
    console.log(err);
  });


const chatBody = document.getElementById("chat-body");
  const userInput = document.getElementById("user-input");
  const chatPopup = document.getElementById("chat-popup");
  const toggleSymbol = document.getElementById("toggle-symbol");

  function toggleChat() {
    chatPopup.classList.toggle("hidden");
    toggleSymbol.textContent = chatPopup.classList.contains("hidden") ? "▼" : "▲";
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    appendMessage(message, "user-msg");
    userInput.value = "";

    try {
      const response = await fetch("https://askai-anywhere.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message })
      });

      if (!response.ok) {
        appendMessage("Error: Could not reach the server.", "bot-msg");
        return;
      }

      const data = await response.json();
      appendMessage(data.answer, "bot-msg");
      chatBody.scrollTop = chatBody.scrollHeight;

    } catch (err) {
      appendMessage("Error: " + err.message, "bot-msg");
    }
  }

  function appendMessage(text, className) {
    const msg = document.createElement("div");
    msg.className = "chat-message " + className;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Send message on Enter key
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
