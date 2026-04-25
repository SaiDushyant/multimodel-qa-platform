import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import FileSidebar from "./components/FileSidebar";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Auth setUser={setUser} />
      </div>
    );
  }

  return (
    <Layout
      sidebar={
        <FileSidebar
          setFileMeta={setFileMeta} // ✅ FIXED PROP
        />
      }
    >
      <Chat fileMeta={fileMeta} user={user} />
    </Layout>
  );
}

export default App;
