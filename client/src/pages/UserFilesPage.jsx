import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { FaRegFilePowerpoint } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";

const UserFilesPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await axios.get(`${GLOBALS.SERVER}/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };
    fetchUserFiles();
  }, [id]);

  const convertToEmbedUrl = (url) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v"); // Extract "v" parameter (video ID)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getEmbedUrl = (url) => {
    // Check if the URL already contains "embed"
    if (url.includes("embed")) {
      return url;
    }
    return convertToEmbedUrl(url);
  };

  const embedUrl = user?.uploadedFilePath
    ? getEmbedUrl(user.uploadedFilePath)
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        {user?.username || "User Files"}
      </h2>

      <ul className="space-y-4">
        <li className="flex flex-col bg-white justify-center items-center shadow-md p-4 rounded-lg">
          {/* Embed YouTube video if uploadedFilePath is valid */}
          <div className="video-container ">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="YouTube Video"
                frameBorder="0"
                className="md:h-[480px] md:w-[720px] h-[200px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-red-500 text-center">
                Uploaded file is not a valid YouTube link.
              </p>
            )}
          </div>

          {/* External links */}
          <div className="flex justify-center p-8 space-x-4">
            {user?.externalFileUrl1 ? (
              <a
                href={user.externalFileUrl1}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <FaRegFilePowerpoint className="text-red-500" size={24} />
                <span className="text-sm text-gray-700">PowerPoint</span>
              </a>
            ) : (
              <div className="flex flex-col items-center space-x-2">
                <FaRegFilePowerpoint className="text-red-500" size={24} />
                <span className="text-sm text-red-500">No PowerPoint file</span>
              </div>
            )}
            {user?.externalFileUrl2 ? (
              <a
                href={user.externalFileUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <PiMicrosoftWordLogoFill className="text-blue-500" size={24} />
                <span className="text-sm text-gray-700">Word</span>
              </a>
            ) : (
              <div className="flex flex-col items-center space-x-2">
                <PiMicrosoftWordLogoFill className="text-blue-500" size={24} />
                <span className="text-sm text-red-500">No Word file</span>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UserFilesPage;
