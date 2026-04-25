import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

function FileSidebar({ setFileMeta }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const inputRef = useRef(null);

  const pollStatus = async (fileId, token) => {
    let status = "processing";

    while (status === "processing") {
      await new Promise((r) => setTimeout(r, 2000));

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/status/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      status = data.status;
    }

    return status;
  };

  const uploadFile = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Upload failed");
        setLoading(false);
        return;
      }

      // 2. Process
      await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/process/${data.file_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      // 3. Poll
      await pollStatus(data.file_id, session.access_token);

      // 4. Update UI
      setFiles((prev) => [...prev, data]);
      setFileMeta(data);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // 🔹 Drag handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🔥 DROP ZONE */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => uploadFile(e.target.files[0])}
        />

        <p className="text-sm text-gray-600">
          Drag & drop a file here or{" "}
          <span className="text-blue-600 font-medium">click to upload</span>
        </p>

        <p className="text-xs text-gray-400 mt-1">PDF, MP3, MP4 supported</p>
      </div>

      {/* 🔥 SELECTED FILE PREVIEW */}
      {selectedFile && (
        <div className="p-2 border rounded bg-gray-50 text-sm">
          Uploading: <strong>{selectedFile.name}</strong>
        </div>
      )}

      {/* 🔄 LOADING */}
      {loading && (
        <div className="text-sm text-gray-500">
          Processing file... please wait
        </div>
      )}

      {/* 📂 FILE LIST */}
      <div className="flex flex-col gap-2 mt-2">
        {files.map((f, i) => (
          <button
            key={i}
            onClick={() => setFileMeta(f)}
            className="text-left p-3 rounded-lg border hover:bg-gray-100 transition"
          >
            <p className="font-medium text-sm truncate">{f.filename}</p>
            <p className="text-xs text-gray-500">{f.file_type.toUpperCase()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FileSidebar;
