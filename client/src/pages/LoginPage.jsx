import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(GLOBALS.SERVER + "/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user || {}));
      response.data.user.uploadedFilePath ? navigate("/") : navigate("/upload");
    } catch (error) {
      setErrorMessage("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="min-h-[89vh] flex items-start pt-24 md:p-36 justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg m-4 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500 bg-red-100 border border-red-300 rounded-lg p-3 text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
