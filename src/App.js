import React from 'react'; // Import useRef and useEffect for audio
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import './App.css';

import { Home } from './Home';
import { Lyrics } from './Lyrics';
import Level1 from './Level1';
import Level2 from './Level2';
import Level3 from './Level3';
import LevelPage from './LevelPage';


function AppWrapper() {
  const location = useLocation();
  const isMinecraft = location.pathname === '/';

  return (
    <>
      {/* Apply 'minecraft-mode' class if on the home page for specific theme styling */}
      <div className={`App ${isMinecraft ? 'minecraft-mode' : ''}`}>
        {/* Navigation bar, visible on all routes */}
        <nav className="navbar">
          <Link to="/">🏠 Halaman Utama</Link> {/* Home link with icon */}
          <Link to="/lyrics">🎵 Lagu</Link> {/* Lyrics link with icon */}
          <Link to="/levelPage">🎮 Peringkat</Link> {/* Levels link with icon */}
        </nav>

        {/* Define routes for different pages/levels */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lyrics" element={<Lyrics />} />
          <Route path="/level1" element={<Level1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/level3" element={<Level3 />} />
          <Route path="/levelPage" element={<LevelPage />} />
        </Routes>
      </div>

      <footer className="footer">
        <p>© 2025 Panitia Bahasa Melayu SK Bukit Sentosa</p>
      </footer>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;