import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth({ setUser }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupPending, setIsSignupPending] = useState(false);
  const [error, setError] = useState("");

  const signUp = async () => {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      setIsSignupPending(true);
    } else {
      setError(error.message);
    }
  };

  const signIn = async () => {
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      setUser(data.user);
    } else {
      setError(error.message);
    }
  };

  // 📩 EMAIL VERIFICATION SCREEN
  if (isSignupPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md text-center w-96">
          <h1 className="text-lg font-semibold">Check your email 📩</h1>
          <p className="text-gray-500 mt-2 text-sm">
            A verification link has been sent to:
          </p>
          <p className="font-medium mt-1">{email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col gap-4">
      {/* 🔄 TOGGLE */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-md text-sm ${
            mode === "login" ? "bg-white shadow" : "text-gray-500"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 rounded-md text-sm ${
            mode === "signup" ? "bg-white shadow" : "text-gray-500"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">
          {mode === "login" ? "Welcome back 👋" : "Create an account 🚀"}
        </h2>
        <p className="text-sm text-gray-500">
          {mode === "login" ? "Login to continue" : "Start your AI journey"}
        </p>
      </div>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <div className="flex flex-col gap-1">
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 PASSWORD INSTRUCTION */}
        {mode === "signup" && (
          <p className="text-xs text-gray-500">
            Password must be at least <strong>6 characters</strong>
          </p>
        )}
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* ACTION BUTTON */}
      <button
        onClick={mode === "login" ? signIn : signUp}
        className={`text-white p-2 rounded transition ${
          mode === "login"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {mode === "login" ? "Login" : "Create Account"}
      </button>

      {/* SWITCH TEXT */}
      <p className="text-sm text-center text-gray-500">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setMode("signup")}
            >
              Sign up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setMode("login")}
            >
              Login
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default Auth;
