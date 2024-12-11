import React, { useEffect, useState } from "react";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [fileUrl, setFileUrl] = useState(""); // New state for the file URL
  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      setMessage("Data is already being submitted, please wait.");
      return;
    }

    try {
      setIsSubmitting(true); // Prevent further submissions
      setMessage(""); // Clear previous messages

      // Send the data to the server
      await axios.post(
        GLOBALS.SERVER + "/api/upload/uploadproject",
        {
          fileUrl, // File URL instead of file upload
          externalFileUrl1: link1,
          externalFileUrl2: link2,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Data submitted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Allow new submissions
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-96 m-4 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          Submit Your Project
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 text-center rounded-lg ${
              message.includes("successfully")
                ? "text-green-700 bg-green-100 border border-green-300"
                : "text-red-700 bg-red-100 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleUpload}
          className="space-y-6 bg-white p-4 rounded-lg"
        >
          <div className="space-y-2">
            <label
              className="block text-gray-600 font-medium"
              htmlFor="fileUrlInput"
            >
              Youtube Video Link
            </label>
            <input
              id="fileUrlInput"
              type="url"
              placeholder="Enter the file link (video)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-gray-600 font-medium"
              htmlFor="pptLink"
            >
              PowerPoint File Link
            </label>
            <input
              id="pptLink"
              type="url"
              placeholder="Enter the PowerPoint file link"
              value={link1}
              onChange={(e) => setLink1(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-gray-600 font-medium"
              htmlFor="wordLink"
            >
              Word File Link
            </label>
            <input
              id="wordLink"
              type="url"
              placeholder="Enter the Word file link"
              value={link2}
              onChange={(e) => setLink2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
