import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";
import { useSelector } from "react-redux";

import "./Footer.css";

const Footer = () => {
  const location = useLocation();
  const theme = useSelector((state) => state.theme);

  const isHidden = location.pathname === "/" || location.pathname === "/register";

  if (isHidden) {
    return null;
  }

  return (
    <footer className={`${theme === "light" ? "footerWrapper" : "footerWrapperDark"}`}>
      <div className="container pt-4">
        <section className="mb-4">
          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaFacebook />
          </a>

          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaTwitter />
          </a>

          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaGoogle />
          </a>

          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaInstagram />
          </a>

          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaLinkedin />
          </a>
          <a
            className={`btn btn-link btn-floating btn-lg ${
              theme === "light" ? "text-dark" : "text-light"
            }`}
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaGithub />
          </a>
        </section>
      </div>

      <div
        className={`footerCopyright p-3 ${theme === "light" ? "text-dark" : "text-light"}`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2023 Copyright:
        <a
          className={`footerCopyrightName ${theme === "light" ? "text-dark" : "text-light"}`}
          href="https://www.linkedin.com/in/matteolanci/"
          target="_blank"
          rel="noreferrer"
        >
          Matteo Lanci
        </a>
        <span className="m-0">-&nbsp; all rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
