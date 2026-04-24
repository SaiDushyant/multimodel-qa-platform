import { useState } from "react";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

function App() {
  const [fileMeta, setFileMeta] = useState(null);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 p-4">
      <Upload setFileMeta={setFileMeta} />
      <Chat fileMeta={fileMeta} />
    </div>
  );
}

export default App;
