import { useState } from "react";

function Upload({ setFileId }) {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/upload/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
    setFileId(data.file_id);
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
