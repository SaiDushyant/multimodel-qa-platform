import { useState } from "react";

function Chat({ fileId }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!query || !fileId) return;

    const userMessage = { role: "user", content: query };

    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("http://127.0.0.1:8000/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_id: fileId,
        query: query,
      }),
    });

    const data = await res.json();

    const botMessage = { role: "bot", content: data.answer };

    setMessages((prev) => [...prev, botMessage]);
    setQuery("");
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      {/* File ID input */}
      <input
        type="text"
        placeholder="Enter File ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Chat messages */}
      <div className="h-80 overflow-y-auto border p-3 rounded flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 self-end"
                : "bg-gray-100 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
