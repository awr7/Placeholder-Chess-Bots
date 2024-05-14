import React, { useState, useRef, useEffect } from 'react';
import music from '../../assets/audio/MCWAI.wav'; 
import MutedIcon from '../../assets/icons/muted.svg';
import LowVolumeIcon from '../../assets/icons/low.svg';
import MediumVolumeIcon from '../../assets/icons/medium.svg';
import HighVolumeIcon from '../../assets/icons/high.svg';

const AudioControls = () => {
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const hideVolumeTimeout = useRef(null);
  const audioRef = useRef(new Audio(music));

  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.play().catch(error => console.log('Auto-play was prevented: ', error));
  }, [volume]);

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
    setLastVolume(parseFloat(event.target.value));
  };

  const handleMouseEnter = () => {
    clearTimeout(hideVolumeTimeout.current);
    setShowVolumeControl(true);
  };

  const handleMouseLeave = () => {
    hideVolumeTimeout.current = setTimeout(() => {
      setShowVolumeControl(false);
    }, 2000); // Hide after 2 seconds of inactivity
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.5);
    }
  };

  const getVolumeIcon = () => {
    if (volume <= 0.01) {
      return <img src={MutedIcon} alt="Muted" className="volume-icon" onClick={toggleMute} />;
    } else if (volume < 0.3) {
      return <img src={LowVolumeIcon} alt="Low Volume" className="volume-icon" onClick={toggleMute} />;
    } else if (volume < 0.6) {
      return <img src={MediumVolumeIcon} alt="Medium Volume" className="volume-icon" onClick={toggleMute} />;
    } else {
      return <img src={HighVolumeIcon} alt="High Volume" className="volume-icon" onClick={toggleMute} />;
    }
  };

  return (
    <div className="audio-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {getVolumeIcon()}
      </div>
      {showVolumeControl && (
          <input 
              type="range"
              style={{ position: 'absolute', width: '100px', zIndex: 9, transform: 'translateY(40px) translateX(-100%)', left: '100%' }} 
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
          />
      )}
    </div>
);
};

export default AudioControls;