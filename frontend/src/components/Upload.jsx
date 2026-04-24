import { useState } from "react";
import { getAuthToken } from "../lib/getToken";

function Upload({ setFileMeta }) {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = await getAuthToken();

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/upload/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await res.json();
    setResponse(data);
    setFileMeta(data);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {response && (
        <div className="mt-4">
          <p>
            <strong>File ID:</strong> {response.file_id}
          </p>
          <p>
            <strong>Type:</strong> {response.file_type}
          </p>
        </div>
      )}
    </div>
  );
}

export default Upload;
