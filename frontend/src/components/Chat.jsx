import { useEffect, useState } from "react";

function Chat({ fileId }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // 👈 NEW

  // 🔄 Poll backend status
  useEffect(() => {
    if (!fileId) return;

    setStatus("processing");

    const interval = setInterval(async () => {
      const res = await fetch(`http://127.0.0.1:8000/status/${fileId}`);
      const data = await res.json();

      setStatus(data.status);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [fileId]);

  const sendMessage = async () => {
    if (!query || !fileId || status !== "completed") return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("http://127.0.0.1:8000/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      {/* STATUS UI */}
      {fileId && (
        <div className="text-sm p-2 rounded bg-gray-100">
          Status:{" "}
          <span
            className={
              status === "completed"
                ? "text-green-600"
                : status === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
            }
          >
            {status}
          </span>
        </div>
      )}

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
          placeholder={
            status !== "completed"
              ? "Processing document..."
              : "Ask something..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={status !== "completed"}
          className="flex-1 border p-2 rounded disabled:bg-gray-200"
        />

        <button
          onClick={sendMessage}
          disabled={status !== "completed"}
          className="bg-green-500 text-white px-4 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
