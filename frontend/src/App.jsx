import { useState } from "react";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

function App() {
  const [fileId, setFileId] = useState("");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 p-4">
      <Upload setFileId={setFileId} />
      <Chat fileId={fileId} />
    </div>
  );
}

export default App;
