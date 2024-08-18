import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import HamburgerMenu from "./components/HamburgerMenu/HamburgerMenu";
import AudioControls from "./components/AudioControls/AudioControls";
import Play from "./components/Play/Play";
import { useState } from "react";

const App = () => {
  const [menuSelected, setMenuSelected] = useState("");
  const [soundPreferenceSet, setSoundPreferenceSet] = useState(false);

  const selectMenu = (menuName) => {
    setMenuSelected(menuName);
  };

  const handleSoundPreferenceSet = () => {
    setSoundPreferenceSet(true);
  };

  return (
    <Router>
      <div
        className={soundPreferenceSet ? "content-visible" : "content-hidden"}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <HamburgerMenu selectMenu={selectMenu} menuSelected={menuSelected} />
          <AudioControls onSoundPreferenceSet={handleSoundPreferenceSet} />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage menuSelected={menuSelected} selectMenu={selectMenu} />
            }
          />
          <Route path="/play" element={<Play menuSelected={menuSelected} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;