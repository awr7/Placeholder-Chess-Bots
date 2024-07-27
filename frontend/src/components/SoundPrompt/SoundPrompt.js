import React, { useState } from 'react';
import './SoundPrompt.css';

const SoundPrompt = ({ onAccept, onDeny }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="sound-prompt">
      <div className="title">Master Chess with AI</div>
      <div className="gradient-line"></div>
      <div class="prompt-message-container">
        <div class="prompt-message">
          <span class="typing-text">This website is best experienced with music. Would you like the sound on?</span>
        </div>
      </div>
      <div class="prompt-buttons">
        <div
          className={`menu-item ${hovered === 'accept' ? 'menu-item-hovered' : ''}`}
          onMouseEnter={() => setHovered('accept')}
          onMouseLeave={() => setHovered(null)}
          onClick={onAccept}
        >
          Accept
        </div>
        <div
          className={`menu-item ${hovered === 'deny' ? 'menu-item-hovered' : ''}`}
          onMouseEnter={() => setHovered('deny')}
          onMouseLeave={() => setHovered(null)}
          onClick={onDeny}
        >
          Deny
        </div>
      </div>
      <div className="gradient-line-jr"></div>
    </div>
  );
};

export default SoundPrompt;