import React, { useState, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import './HomePage.css';
import bgvid from '../../assets/img/background.mp4';
import history from '../../assets/img/history.mp4';
import learn from '../../assets/img/learn.mp4';
import mainbg from '../../assets/img/deepblue.jpg';

// TODO: Style the menus
// TODO: Make it smoother
// TODO: Right now im using a whole bunch of delays to give time for stuff to load, maybe there is a better approach?

const HomePage = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const hoverRef = useRef(null); // Reference for hover timeout
  const leaveTimeoutRef = useRef(null); // Reference for leave timeout to avoid flickering

  // useTransition for the fade in fade out animations
  const transitions = useTransition(videoSrc, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
    leave: { opacity: 0, delay: 500 }
  });

  const handleMouseEnter = (src) => {
    // Clear any leave timeout to prevent clearing the video when moving between menus
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (hoverRef.current) clearTimeout(hoverRef.current);
    hoverRef.current = setTimeout(() => {
      setVideoSrc(src); // Set source after a delay
    }, 200); // Delay to check if the hover is intentional
  };

  const handleMouseLeave = () => {
    // Set a timeout on leave, which will be cleared if another hover starts
    if (hoverRef.current) clearTimeout(hoverRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setVideoSrc(''); // Clear source only if no other hover has started
    }, 300); // Longer delay to check if moving to another option
  };

  return (
    <div className="home-page">
      <div className="video-container">
        {transitions((style, item) =>
          item ? (
            <animated.video
              style={style}
              autoPlay
              loop
              muted
              className="video-background"
              key={item}
              onLoadedMetadata={(e) => e.currentTarget.currentTime = 0}  // Reset video to start when loaded
            >
              <source src={item} type="video/mp4" />
            </animated.video>
          ) : (
            <animated.img src={mainbg} alt="Static background" className="video-background" style={style} />
          )
        )}
      </div>

      <div className="content">
        <h1>Master Chess with AI</h1>
        <p onMouseEnter={() => handleMouseEnter(bgvid)} onMouseLeave={handleMouseLeave}>Play against AI</p>
        <p onMouseEnter={() => handleMouseEnter(learn)} onMouseLeave={handleMouseLeave}>Learn from AI</p>
        <p onMouseEnter={() => handleMouseEnter(history)} onMouseLeave={handleMouseLeave}>History</p>
      </div>
    </div>
  );
};

export default HomePage;
