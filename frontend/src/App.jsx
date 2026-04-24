import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Auth setUser={setUser} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 p-4">
      <Upload setFileMeta={setFileMeta} user={user} />
      <Chat fileMeta={fileMeta} user={user} />
    </div>
  );
}

export default App;
