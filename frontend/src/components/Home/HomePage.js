import React, { useState, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import './HomePage.css';
import bgvid from '../../assets/img/background.mp4';
import history from '../../assets/img/history.mp4';
import learn from '../../assets/img/learn.mp4';
import mainbg from '../../assets/img/deepblue2.jpg';
import music from '../../assets/audio/MCWAI.wav'; 

const HomePage = () => {
  const [hovered, setHovered] = useState(null);
  const [displayedVideo, setDisplayedVideo] = useState('');
  const hoverRef = useRef(null);

  const videoStyles = useSpring({
    opacity: displayedVideo ? 1 : 0,
    config: { duration: 500 }
  });

  const handleMouseEnter = (item) => {
    setHovered(item);

    if (hoverRef.current) {
      clearTimeout(hoverRef.current);
    }
    if (hovered) {
      // If there was a previous hover, this is a rapid movement
      hoverRef.current = setTimeout(() => {
        setDisplayedVideo(item);  // Set video to display after a delay to prevent flicker
      }, 300);  // Slight delay for rapid movements
    } else {
      // No rapid movement, display immediately
      setDisplayedVideo(item);
    }
  };

  const handleMouseLeave = () => {
    setHovered(null);
    if (hoverRef.current) {
      clearTimeout(hoverRef.current); 
    }
    hoverRef.current = setTimeout(() => {
      setDisplayedVideo(''); 
    }, 300);
  };

  const GradientLine = ({ isHalf }) => {
    const lineStyle = {
      height: '2px',
      width: isHalf ? '50%' : '100%',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0), #FCFCFC, rgba(255, 255, 255, 0))',
      margin: '30px auto 0',
    };
    return <div style={lineStyle} />;
  };

  const playMusic = () => {
    new Audio(music).play()
  }

  return (
    <div className="home-page">
      <button onClick={playMusic}> </button>
      <div className="video-container" style={{ backgroundColor: 'black' }}>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'bgvid' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={bgvid} type="video/mp4" />
        </animated.video>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'learn' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={learn} type="video/mp4" />
        </animated.video>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'history' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={history} type="video/mp4" />
        </animated.video>
        <animated.img
          src={mainbg}
          alt="Static background"
          className="video-background background-image"
          style={{ opacity: displayedVideo ? 0 : 1 }}
        />
      </div>
      <div className="content">
        <div className="title">Master Chess with AI</div>
        <GradientLine />
        <div className={`menu-item ${hovered === 'bgvid' ? 'menu-item-hovered' : ''}`}
          onMouseEnter={() => handleMouseEnter('bgvid')}
          onMouseLeave={handleMouseLeave}>
          Play against AI
        </div>
        <div className={`menu-item ${hovered === 'learn' ? 'menu-item-hovered' : ''}`}
          onMouseEnter={() => handleMouseEnter('learn')}
          onMouseLeave={handleMouseLeave}>
          Learn from AI
        </div>
        <div className={`menu-item ${hovered === 'history' ? 'menu-item-hovered' : ''}`}
          onMouseEnter={() => handleMouseEnter('history')}
          onMouseLeave={handleMouseLeave}>
          History
        </div>
        <GradientLine isHalf={true} />
      </div>
    </div>
  );
};

export default HomePage;
