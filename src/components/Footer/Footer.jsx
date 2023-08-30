import React from "react";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="text-center text-white"
      style={{ backgroundColor: " #f1f1f1", marginTop: "4rem" }}
    >
      <div className="container pt-4">
        <section className="mb-4">
          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaFacebook />
          </a>

          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaTwitter />
          </a>

          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaGoogle />
          </a>

          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaInstagram />
          </a>

          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaLinkedin />
          </a>
          <a
            className="btn btn-link btn-floating btn-lg text-dark m-1"
            href="#!"
            role="button"
            data-mdb-ripple-color="dark"
          >
            <FaGithub />
          </a>
        </section>
      </div>

      <div className="text-center text-dark p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        © 2023 Copyright:
        <a className="text-dark" href="#!">
          Matteo Lanci
        </a>
      </div>
    </footer>
  );
};

export default Footer;
