import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) setUser(data.user);
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) setUser(data.user);
  };

  return (
    <div className="flex flex-col gap-3 w-80">
      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signUp} className="bg-blue-500 text-white p-2">
        Sign Up
      </button>

      <button onClick={signIn} className="bg-green-500 text-white p-2">
        Login
      </button>
    </div>
  );
}

export default Auth;
