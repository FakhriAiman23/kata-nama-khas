import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
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
      <div className={`App ${isMinecraft ? 'minecraft-mode' : ''}`}>

        {/* ── Navbar ── */}
        <nav className="navbar">

          {/* Brand / Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-brand${isActive ? ' nav-active' : ''}`
            }
          >
            <i className="bi bi-shield-fill brand-icon"></i>
           KATA NAMA KHAS 
          </NavLink>

          {/* Right-side links */}
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'nav-active' : '')}
            >
              <i className="bi bi-house-door-fill nav-icon"></i>
              Utama
            </NavLink>

            <span className="nav-divider" />

            <NavLink
              to="/lyrics"
              className={({ isActive }) => (isActive ? 'nav-active' : '')}
            >
              <i className="bi bi-music-note-beamed nav-icon"></i>
              Lagu
            </NavLink>

            <span className="nav-divider" />

            <NavLink
              to="/levelPage"
              className={({ isActive }) => (isActive ? 'nav-active' : '')}
            >
              <i className="bi bi-controller nav-icon"></i>
              Peringkat
            </NavLink>
          </div>
        </nav>

        {/* ── Routes ── */}
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/lyrics"    element={<Lyrics />} />
          <Route path="/level1"    element={<Level1 />} />
          <Route path="/level2"    element={<Level2 />} />
          <Route path="/level3"    element={<Level3 />} />
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