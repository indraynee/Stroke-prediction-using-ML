import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Auth = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary fake authentication (replace with backend later)
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true"); // store login state
      navigate("/dashboard"); // redirect to dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    
    <div>
      <Header/>
    <div className="w-full px-4 md:px-10 py-10">
      
      <div className="max-w-6xl mx-auto bg-[#8e9ce2] rounded-[50px] flex flex-col md:flex-row overflow-hidden shadow-2xl">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-[#030616]">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
            Hey, Hello 👋
          </h1>
          <p className="text-xl opacity-90 font-serif max-w-xs">
            Welcome to the AI-Based Heart & Stroke Risk Prediction System
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex justify-center items-center">
          <form
            onSubmit={handleLogin}
            className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Let's get started with your AI health assessment.
            </p>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#6366f1] text-white py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Login
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-indigo-600 font-bold cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Auth;
