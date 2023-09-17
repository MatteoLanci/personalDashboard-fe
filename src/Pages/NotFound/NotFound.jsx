import React, { useEffect, useState, useCallback } from "react";

const NotFound = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [position, setPosition] = useState(0);

  const jump = useCallback(() => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 1000);
    }
  }, [isJumping]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [jump]);

  useEffect(() => {
    let gameInterval;

    const startGame = () => {
      gameInterval = setInterval(() => {
        // Sposta il dinosauro in base allo stato di salto
        if (isJumping) {
          setPosition(1);
        } else {
          setPosition(0);
        }
      }, 16);
    };

    startGame();

    return () => {
      clearInterval(gameInterval);
    };
  }, [isJumping]);

  return (
    <section style={{ width: "90vh", marginTop: "10rem" }}>
      <h1>Not Found Page</h1>
      <div>
        <div
          className={`dinosaur ${isJumping ? "jump" : ""}`}
          style={{ bottom: `${position * 100}px` }}
        >
          🦖
        </div>
        <p>Press the spacebar to jump!</p>
      </div>
    </section>
  );
};

export default NotFound;
