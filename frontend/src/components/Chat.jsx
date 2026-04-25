import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import { getAuthToken } from "../lib/getToken";

function Chat({ fileMeta }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [timestamps, setTimestamps] = useState([]);
  const [activeTimestamp, setActiveTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!fileMeta?.file_id) return;

    setStatus("processing");

    let interval;

    const startPolling = async () => {
      const token = await getAuthToken();

      interval = setInterval(async () => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/status/${fileMeta.file_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setStatus(data.status);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      }, 2000);
    };

    startPolling();

    return () => clearInterval(interval);
  }, [fileMeta?.file_id]);

  const sendMessage = async () => {
    if (!query.trim() || !fileMeta?.file_id || status !== "completed") return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const token = await getAuthToken();

    const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_id: fileMeta.file_id,
        query: query,
      }),
    });

    const data = await res.json();

    setLoading(false);

    const words = data.answer.split(" ");

    // Add empty bot message
    setMessages((prev) => [...prev, { role: "bot", content: "" }]);

    let i = 0;

    const interval = setInterval(() => {
      setMessages((prev) => {
        const updated = [...prev];

        const lastIndex = updated.length - 1;
        const lastMsg = updated[lastIndex];

        if (!lastMsg || lastMsg.role !== "bot") return prev;

        updated[lastIndex] = {
          role: "bot",
          content: (lastMsg.content || "") + words[i] + " ",
        };

        return updated;
      });

      i++;

      if (i >= words.length) {
        clearInterval(interval);
      }
    }, 25);

    setTimestamps(data.timestamps || []);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fileUrl = fileMeta?.file_id
    ? `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${fileMeta.file_id}.${fileMeta.file_type}`
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Chat with your file</h2>
        {fileMeta && (
          <p className="text-sm text-gray-500 truncate">{fileMeta.filename}</p>
        )}
      </div>

      {/* STATUS */}
      {fileMeta?.file_id && (
        <div className="text-sm mb-2 px-3 py-2 rounded bg-gray-100">
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

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.content}
            {/* blinking cursor for last bot message */}
            {loading && idx === messages.length - 1 && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">
            AI is thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="border-t p-3 bg-white flex items-end gap-2">
        <textarea
          rows={1}
          placeholder={
            status !== "completed"
              ? "Processing document..."
              : "Ask something..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status !== "completed"}
          className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />

        <button
          onClick={sendMessage}
          disabled={status !== "completed"}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>

      {/* TIMESTAMPS */}
      {timestamps.length > 0 && (
        <div className="mt-3 px-2">
          <p className="font-semibold text-sm">Relevant Moments</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {timestamps.map((t, i) =>
              t !== null ? (
                <button
                  key={i}
                  onClick={() => setActiveTimestamp(t)}
                  className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-600 transition"
                >
                  {t.toFixed(2)}s
                </button>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* PLAYER */}
      {fileUrl && timestamps.some((t) => t !== null) && (
        <div className="mt-4">
          <Player
            fileUrl={fileUrl}
            fileType={fileMeta.file_type}
            activeTimestamp={activeTimestamp}
          />
        </div>
      )}
    </div>
  );
}

export default Chat;
