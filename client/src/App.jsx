import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import UserFilesPage from "./pages/UserFilesPage";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col justify-between min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/upload" element={<UploadPage />} />
          <Route path="/user/:id" element={<UserFilesPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
