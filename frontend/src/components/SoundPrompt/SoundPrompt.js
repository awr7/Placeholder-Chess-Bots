import React, { useState, useEffect } from "react";
import "./SoundPrompt.css";

const SoundPrompt = ({ onAccept, onDeny }) => {
  const [hovered, setHovered] = useState(null);
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const [acceptText, setAcceptText] = useState("Accept");
  const [denyText, setDenyText] = useState("Deny");

  useEffect(() => {
    const animateText = (text, setText) => {
      let interval = null;
      let iteration = 0;

      interval = setInterval(() => {
        setText((prev) =>
          prev
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 5;
      }, 30);

      return () => clearInterval(interval);
    };

    const clearAcceptAnimation = animateText("Accept", setAcceptText);
    const clearDenyAnimation = animateText("Deny", setDenyText);

    return () => {
      clearAcceptAnimation();
      clearDenyAnimation();
    };
  }, [letters]);

  return (
    <div className="sound-prompt">
      <div className="title">Master Chess with AI</div>
      <div className="gradient-line"></div>
      <div className="prompt-message-container">
        <div className="prompt-message">
          <span className="typing-text">
            This website is best experienced with music. Would you like the
            sound on?
          </span>
        </div>
      </div>
      <div className="prompt-buttons">
        <div
          className={`menu-item ${
            hovered === "accept" ? "menu-item-hovered" : ""
          }`}
          onMouseEnter={() => setHovered("accept")}
          onMouseLeave={() => setHovered(null)}
          onClick={onAccept}
        >
          {acceptText}
        </div>
        <div
          className={`menu-item ${
            hovered === "deny" ? "menu-item-hovered" : ""
          }`}
          onMouseEnter={() => setHovered("deny")}
          onMouseLeave={() => setHovered(null)}
          onClick={onDeny}
        >
          {denyText}
        </div>
      </div>
      <div className="gradient-line-jr"></div>
    </div>
  );
};

export default SoundPrompt;