import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import './HomePage.css';
import playBackgroundVideo from '../../assets/img/playBackground.mp4';
import historyBackgroundVideo from '../../assets/img/historyBackground.mp4';
import learnBackgroundVideo from '../../assets/img/learnBackground.mp4';
import mainbg from '../../assets/img/background.jpg';
import cnnImage from '../../assets/img/cnn.png';

const HomePage = ({ menuSelected, selectMenu }) => {
  const [hovered, setHovered] = useState(null);
  const [displayedVideo, setDisplayedVideo] = useState('');
  const [isBlurred, setisBlurred] = useState(false);
  const hoverRef = useRef(null);
  const finalMarginTop = '30px';
  const [animationKey, setAnimationKey] = useState(0);

  const videoStyles = useSpring({
    opacity: displayedVideo ? 1 : 0,
    filter: isBlurred ? 'blur(8px)' : 'blur(0px)',
    config: { duration: 500 }
  });

  const handleMouseEnter = (item) => {
    setHovered(item);

    if (hoverRef.current) {
      clearTimeout(hoverRef.current);
    }
    if (hovered) {
      hoverRef.current = setTimeout(() => {
        setDisplayedVideo(item);
      }, 300);
    } else {
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

  const handleMenuClick = (menu) => {
    selectMenu(menu);
    setAnimationKey(prevKey => prevKey + 1); // change the key to force re-render and restart animation
  };

  useEffect(() => {
    if (menuSelected) {
      setisBlurred(true);
    } else {
      setisBlurred(false);
    }

    if (menuSelected === 'Play against AI') {
      setDisplayedVideo('playBackgroundVideo');
    } else if (menuSelected === 'Learn from AI') {
      setDisplayedVideo('learnBackgroundVideo');
    } else if (menuSelected === 'History') {
      setDisplayedVideo('historyBackgroundVideo');
    } else {
      setDisplayedVideo('');
    }
  }, [menuSelected]);

  const algorithms = [
    { name: "Reinforcement Learning", image: cnnImage },
    { name: "MinMax with Alpha Beta Pruning", image: cnnImage },
    { name: "Other algo", image: cnnImage }
  ];

  return (
    <div className="home-page">
      <div className="video-container" style={{ backgroundColor: 'black' }}>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'playBackgroundVideo' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={playBackgroundVideo} type="video/mp4" />
        </animated.video>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'learnBackgroundVideo' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={learnBackgroundVideo} type="video/mp4" />
        </animated.video>
        <animated.video style={{ ...videoStyles, display: displayedVideo === 'historyBackgroundVideo' ? 'block' : 'none' }}
          autoPlay loop muted className="video-background">
          <source src={historyBackgroundVideo} type="video/mp4" />
        </animated.video>
        <animated.img
          src={mainbg}
          alt="Static background"
          className="video-background background-image"
          style={{ opacity: displayedVideo ? 0 : 1 }}
        />
      </div>
      <div className="content">
        <div className="title">{menuSelected ? `${menuSelected}` : "Master Chess with AI"}</div>
        <ExpandingLine key={animationKey} isHalf={false} marginTop={finalMarginTop} />
        {!menuSelected ? (
          <>
            <div className={`menu-item ${hovered === 'playBackgroundVideo' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('playBackgroundVideo')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMenuClick('Play against AI')}>
              Play against AI
            </div>
            <div className={`menu-item ${hovered === 'learnBackgroundVideo' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('learnBackgroundVideo')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMenuClick('Learn from AI')}>
              Learn from AI
            </div>
            <div className={`menu-item ${hovered === 'historyBackgroundVideo' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('historyBackgroundVideo')}
              onMouseLeave={handleMouseLeave}>
              History
            </div>
          </>
        ) : (
          <div className="algorithm-menu" style={{ display: 'flex', overflowX: 'auto' }}>
            {algorithms.map((algo, index) => (
              <div key={index} className="algorithm-card" onMouseEnter={() => setHovered(algo.name)} onMouseLeave={() => setHovered('')}>
                <img src={algo.image} alt={algo.name} style={{ filter: hovered === algo.name ? 'none' : 'grayscale(100%) blur(2px)' }} />
                <div className="overlay"></div>
                <div className="title-bar">{algo.name}</div>
              </div>
            ))}
          </div>
        )}
        <ExpandingLine key={`${animationKey}-half`} isHalf={true} marginTop={finalMarginTop} />
      </div>
    </div>
  );
};

const ExpandingLine = ({ isHalf, marginTop }) => {
  return (
    <div className={`expanding-line ${isHalf ? 'half' : 'full'}`} style={{ marginTop: marginTop }} />
  );
};

export default HomePage;