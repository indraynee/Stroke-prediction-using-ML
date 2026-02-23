import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { register } from "../services/api";

const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await register({
                username,
                email,
                password,
            });

            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem("username", response.data.username || username);
                localStorage.setItem("user_id", response.data.user_id);
                localStorage.setItem("isLoggedIn", "true");
                navigate("/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.username?.[0] ||
                err.response?.data?.email?.[0] ||
                err.response?.data?.password?.[0] ||
                "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="w-full px-4 md:px-10 py-10">
                <div className="max-w-6xl mx-auto bg-[#8e9ce2] rounded-[50px] flex flex-col md:flex-row overflow-hidden shadow-2xl">
                    {/* Left Side */}
                    <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-[#030616]">
                        <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
                            Join Us! 👋
                        </h1>
                        <p className="text-xl opacity-90 font-serif max-w-xs">
                            Create an account to track your heart & stroke risk prediction history.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="w-full md:w-1/2 p-6 md:p-12 flex justify-center items-center">
                        <form
                            onSubmit={handleSignup}
                            className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold mb-2 text-center">Create Account</h2>
                            <p className="text-gray-400 text-sm mb-8 text-center">
                                Start your journey towards a healthier you.
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
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 rounded-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#6366f1] text-white py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500">
                                    Already have an account?{" "}
                                    <span
                                        onClick={() => navigate("/login")}
                                        className="text-indigo-600 font-bold cursor-pointer"
                                    >
                                        Login
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

export default Signup;
