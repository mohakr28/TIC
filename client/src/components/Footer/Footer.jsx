import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} TIC DS. All rights reserved.
        </p>
        <p className="text-sm"> Developed By Addar Mohamed Akram</p>
        <div className="mt-2 space-x-4">
          <a
            href="https://www.facebook.com/konor.kinoay.33"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200 transition"
          >
            Facebook
          </a>
          <a
            href="https://wa.me/+213659767871"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200 transition"
          >
            WhatsApp
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-akram-addar-99a352285/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200 transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
