// src/Home.js
import React, { useEffect, useRef } from 'react';
import './Home.css';

export const Home = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.loop = true;

      // Try autoplay immediately (works if navigated via link)
      audio.play().catch(() => {
        // Autoplay blocked, wait for user gesture
        const handleUserGesture = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', handleUserGesture);
        };
        document.addEventListener('click', handleUserGesture, { once: true });
      });
    }
  }, []);

  const startGame = () => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
    window.location.href = '/lyrics';
  };

  return (
    <div className="minecraft-page">
      {/* 🔊 Background Music */}
      <audio ref={audioRef} src="/audio/HomeAudio.mp3" preload="auto" />
      
      {/* Mountain Section - Hero Area */}
      <div className="mountain-section">
        <div className="title-container">
          <div className="title-box">
            <h1 className="minecraft-title">KƒTƒ NƒMƒ KHƒS</h1>
            <p className="minecraft-subtitle">Belajar Bersama Dunia Digital</p>
            <button className="minecraft-button" onClick={startGame}>
              MULA PERMAINAN
            </button>
          </div>
        </div>
      </div>

      {/* Dirt Section - Rules Area */}
      <div className="dirt-section">
        <div className="rules-container">
          <h2 className="section-title">
            <span className="pixel-emoji">📜</span> PERATURAN PERMAINAN
          </h2>

          <div className="rules-grid">
            <div className="rule-block">
              <div className="rule-number">1</div>
              <div className="rule-content">
                <h3>Kata nama Khas</h3>
                <p>Nama khusu bagi manusia, haiwan, atau benda</p>
              </div>
            </div>

            <div className="rule-block">
              <div className="rule-number">2</div>
              <div className="rule-content">
                <h3>Huruf Besar</h3>
                <p>Setiap kata nama khas bermula denga huruf besar</p>
              </div>
            </div>

            <div className="rule-block">
              <div className="rule-number">3</div>
              <div className="rule-content">
                <h3>Kumpulkan Mata</h3>
                <p>Dapatkan mata dengan jawapan tepat!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

