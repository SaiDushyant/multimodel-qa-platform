import { useEffect, useState } from "react";
import Player from "./Player";

function Chat({ fileMeta }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [timestamps, setTimestamps] = useState([]);
  const [activeTimestamp, setActiveTimestamp] = useState(null);

  useEffect(() => {
    if (!fileMeta?.file_id) return;

    setStatus("processing");

    const interval = setInterval(async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/status/${fileMeta.file_id}`,
      );
      const data = await res.json();

      setStatus(data.status);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [fileMeta?.file_id]);

  const sendMessage = async () => {
    if (!query || !fileMeta?.file_id || status !== "completed") return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("http://127.0.0.1:8000/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_id: fileMeta.file_id,
        query: query,
      }),
    });

    const data = await res.json();

    const botMessage = { role: "bot", content: data.answer };
    setMessages((prev) => [...prev, botMessage]);

    setTimestamps(data.timestamps || []);

    setQuery("");
  };

  const fileUrl = fileMeta?.file_id
    ? `http://127.0.0.1:8000/uploads/${fileMeta.file_id}.${fileMeta.file_type}`
    : null;

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      {/* STATUS */}
      {fileMeta?.file_id && (
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

      {/* CHAT */}
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

      {/* INPUT */}
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

      {timestamps.length > 0 && (
        <div className="mt-4">
          <p className="font-bold">Relevant Moments:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {timestamps.map((t, i) =>
              t !== null ? (
                <button
                  key={i}
                  onClick={() => setActiveTimestamp(t)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                >
                  {t.toFixed(2)}s
                </button>
              ) : null,
            )}
          </div>
        </div>
      )}

      {fileUrl && timestamps.some((t) => t !== null) && (
        <Player
          fileUrl={fileUrl}
          fileType={fileMeta.file_type}
          activeTimestamp={activeTimestamp}
        />
      )}
    </div>
  );
}

export default Chat;
