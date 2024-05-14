import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import HamburgerMenu from './components/HamburgerMenu/HamburgerMenu';
import AudioControls from './components/AudioControls/AudioControls';

const App = () => {
  return (
    <Router>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', zIndex: 1000 }}>
        <HamburgerMenu />
        <AudioControls />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
