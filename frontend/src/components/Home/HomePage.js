import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import './HomePage.css';
import bgvid from '../../assets/img/background.mp4';
import history from '../../assets/img/history.mp4';
import learn from '../../assets/img/learn.mp4';
import mainbg from '../../assets/img/deepblue2.jpg';
import cnnImage from '../../assets/img/cnn.png';

const HomePage = ({ menuSelected, selectMenu }) => {
  const [hovered, setHovered] = useState(null);
  const [displayedVideo, setDisplayedVideo] = useState('');
  const [isBlurred, setisBlurred] = useState(false);
  const hoverRef = useRef(null);
  const finalMarginTop = '30px';
  const [animateLines, setAnimateLines] = useState(false);

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

  const GradientLine = ({ isHalf, marginTop }) => {
    const lineAnimation = useSpring({
      to: {
        width: isHalf ? '50%' : '100%',
        marginTop: marginTop
      },
      from: { width: '0%', marginTop: '0px' },
      config: { duration: 500 },
      reset: animateLines,
      immediate: !animateLines
    });

    useEffect(() => {
      if (animateLines) {
        const timeout = setTimeout(() => {
          setAnimateLines(false);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }, []);  // Only run on mount and unmount
        
    const lineStyle = {
      height: '2px',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0), #FCFCFC, rgba(255, 255, 255, 0))',
      margin: 'auto',
    };

    return <animated.div style={{ ...lineStyle, ...lineAnimation }} />;
  };

  useEffect(() => {
    setAnimateLines(true);

    if (menuSelected) {
      setisBlurred(true);
    } else {
      setisBlurred(false);
    }

    if (menuSelected === 'Play against AI') {
      setDisplayedVideo('bgvid');
    } else if (menuSelected === 'Learn from AI') {
      setDisplayedVideo('learn');
    } else if (menuSelected === 'History') {
      setDisplayedVideo('history');
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
        <div className="title">{menuSelected ? `${menuSelected}` : "Master Chess with AI"}</div>
        <GradientLine isHalf={false} marginTop={finalMarginTop} />
        {!menuSelected ? (
          <>
            <div className={`menu-item ${hovered === 'bgvid' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('bgvid')}
              onMouseLeave={handleMouseLeave}
              onClick={() => selectMenu('Play against AI')}>
              Play against AI
            </div>
            <div className={`menu-item ${hovered === 'learn' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('learn')}
              onMouseLeave={handleMouseLeave}
              onClick={() => selectMenu('Learn from AI')}>
              Learn from AI
            </div>
            <div className={`menu-item ${hovered === 'history' ? 'menu-item-hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter('history')}
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
        <GradientLine isHalf={true} marginTop={finalMarginTop} />
      </div>
    </div>
  );
};

export default HomePage;