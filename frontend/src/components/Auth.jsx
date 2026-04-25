import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupPending, setIsSignupPending] = useState(false);

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      setIsSignupPending(true); // show verification screen
    } else {
      console.log(error.message);
    }
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) setUser(data.user);
    else console.log(error.message);
  };

  if (isSignupPending) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <h1 className="text-xl font-semibold">
          Check your email for verification
        </h1>
        <p className="text-gray-500 mt-2">
          We’ve sent a confirmation link to {email}
        </p>
      </div>
    );
  }

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
