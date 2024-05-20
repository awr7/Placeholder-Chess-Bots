import React, { useState } from 'react';
import './HamburgerMenu.css';
import { useNavigate } from 'react-router-dom';

const HamburgerMenu = ({ selectMenu }) => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsActive(!isActive);
        document.body.style.overflow = isActive ? 'auto' : 'hidden'; // Disable/enable scrolling
        document.body.classList.toggle('menu-active', !isActive); // Toggle class for hiding content
    };

    const handleMenuItemClick = (menuName) => {
        selectMenu(menuName);
        toggleMenu();
        if (menuName === 'Home') {
            navigate('/');
        } else {
            navigate('/');
        }
    };

    return (
        <div>
            <div className="dimming-overlay"></div>
            <div className="background-pattern"></div>
            <div className="menu-overlay" onClick={toggleMenu}>
                <div className="gradient-line"></div>
                <ul className="hamburger-menu-list" onClick={(e) => e.stopPropagation()}>
                    <li className="hamburger-menu-item" onClick={() => handleMenuItemClick('')}>Home</li>
                    <li className="hamburger-menu-item" onClick={() => handleMenuItemClick('Play against AI')}>Play against AI</li>
                    <li className="hamburger-menu-item" onClick={() => handleMenuItemClick('Learn from AI')}>Learn from AI</li>
                    <li className="hamburger-menu-item">History</li>
                </ul>
                <div className="gradient-line"></div>
            </div>
        <svg className={`ham hamRotate ham4 ${isActive ? 'active' : ''}`}
             viewBox="0 0 100 100" width="60" onClick={toggleMenu}>
            <path className="line top"
                  d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
            <path className="line middle"
                  d="m 70,50 h -40" />
            <path className="line bottom"
                  d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
        </svg>
        </div>
    );
};

export default HamburgerMenu;
