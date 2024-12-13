import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { FaRegFilePowerpoint } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";

const UserFilesPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);

  const convertToEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);

      // Handle YouTube links (including Shorts)
      if (urlObj.hostname.includes("youtube.com")) {
        if (urlObj.pathname.startsWith("/shorts/")) {
          const shortId = urlObj.pathname.split("/shorts/")[1];
          return `https://www.youtube.com/embed/${shortId}`;
        } else {
          const videoId = urlObj.searchParams.get("v");
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
      } else if (urlObj.hostname.includes("youtu.be")) {
        const videoId = urlObj.pathname.slice(1); // Extract the path after "/"
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Handle Facebook links
      if (urlObj.hostname.includes("facebook.com") && url.includes("/watch")) {
        const videoId = urlObj.searchParams.get("v");
        return videoId
          ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              `https://www.facebook.com/watch?v=${videoId}`
            )}`
          : null;
      }

      return null; // Unsupported URL
    } catch (error) {
      console.error("Invalid URL:", url, error);
      return null;
    }
  };

  const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url); // Check if URL ends with a valid image extension
  };

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await axios.get(`${GLOBALS.SERVER}/api/users/${id}`);
        setUser(response.data);

        if (response.data.uploadedFilePath) {
          if (isImageUrl(response.data.uploadedFilePath)) {
            setIsImage(true);
          } else {
            setEmbedUrl(convertToEmbedUrl(response.data.uploadedFilePath));
          }
        }
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };
    fetchUserFiles();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        {user?.username || "User Files"}
      </h2>

      <ul className="space-y-4">
        <li className="flex flex-col bg-white justify-center items-center shadow-md p-4 rounded-lg">
          {/* Display uploaded image or embed YouTube/Facebook video */}
          <div className="media-container">
            {isImage ? (
              <img
                src={GLOBALS.SERVER + "/api/upload/" + user.uploadedFilePath}
                alt="Uploaded"
                className="max-w-full max-h-96 rounded-lg"
              />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title="Video"
                frameBorder="0"
                className="md:h-[480px] md:w-[720px] h-[200px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-red-500 text-center">
                Uploaded file is not a valid video or image link.
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
