// src/LevelPage.js
import React, { useEffect, useRef } from 'react';
import styles from './LevelPage.module.css';
import { useNavigate } from 'react-router-dom';

const levels = [
  { id: 1, title: 'Tahap 1: Pilih Kata Nama Khas', description: 'Pilih kata nama khas Berdasarkan gambar' },
  { id: 2, title: 'Tahap 2: Pilih Kedudukan Huruf Besar', description: 'Pilih Kedudukan huruf besar Kata nama khas' },
  { id: 3, title: 'Tahap 3: Padankan Kata Nama', description: 'Pandankan Kata nama Khas dan Kata nama Am' },
];

export default function LevelPage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.loop = true;

      // Attempt to autoplay
      audio.play().catch(() => {
        const resume = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', resume);
        };
        document.addEventListener('click', resume, { once: true });
      });
    }
  }, []);

  const handleStart = (levelId) => {
    navigate(`/level${levelId}`);
  };

  return (
    <div className={styles.container}>
      {/* 🔊 Background Music */}
      <audio ref={audioRef} src="/audio/levelPageAudio.mp3" preload="auto" />

      <h1 className={styles.header}>Pilih Peringkat Permainan</h1>
      <div className={styles.levelGrid}>
        {levels.map((level) => (
          <div key={level.id} className={styles.card}>
            <h2>{level.title}</h2>
            <p>{level.description}</p>
            <button onClick={() => handleStart(level.id)}>Mula</button>
          </div>
        ))}
      </div>
    </div>
  );
}
