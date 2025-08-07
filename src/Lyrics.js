// src/Lyrics.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLayout } from './GameLayout';
import styles from './Lyrics.module.css';

const stanzas = [
  [
    "Papaku pulang dari Jakarta",
    "Singgah sebentar di Melaka",
    "Papa belikan jam G-shock berharga",
    "Jumpa cikgu bernama Fatimah",
    "Mengajar di Sekolah Sri Indah",
    "Nama khas janganlah dilupa",
    "Huruf besar mesti ada"
  ],
  [
    "Hari Ahad pergi ke Sungai Klang",
    "Naik kereta dengan Si Komeng",
    "Jumpa kawan bernama Arif",
    "Dia tinggal di Kampung Cerah",
    "Nama orang, tempat dan, benda",
    "Itulah nama khas semua"
  ],
  [
    "Ibu belikan Milo dan Kitkat",
    "Di pasar raya Tesco terdekat",
    "Kereta Proton buatan negara",
    "Jenama juga nama khas ya!",
    "Gunakan huruf besar sentiasa"
  ]
];

const lineTimings = [
  7.0, 12.2, 16.0, 19.0, 23.0, 27.0, 31.0,
  35.0, 39.0, 43.0, 46.0, 51.0, 55.0, 59.0,
  62.0, 67.0, 71.0, 74.6
];

const properNouns = [
  'Jakarta', 'Melaka', 'G-shock', 'Fatimah', 'Sekolah Sri Indah', 'Ahad',
  'Sungai Klang', 'Si Komeng', 'Arif', 'Kampung Cerah',
  'Milo', 'Kitkat', 'Tesco', 'Proton'
];

export function Lyrics() {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [stanzaVisible, setStanzaVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = audioRef.current?.currentTime || 0;

      for (let i = 0; i < lineTimings.length; i++) {
        if (time >= lineTimings[i] && (i === lineTimings.length - 1 || time < lineTimings[i + 1])) {
          if (i !== currentLineIndex) {
            setCurrentLineIndex(i);
            const stanzaIndex = getStanzaIndex(i);

            if (stanzaIndex !== currentStanzaIndex) {
              setStanzaVisible(false);
              setTimeout(() => {
                setCurrentStanzaIndex(stanzaIndex);
                setVisibleLines([0]);
                setStanzaVisible(true);
              }, 800);
            } else {
              setVisibleLines(prev => [...prev, prev.length]);
            }
          }
          return;
        }
      }

      if (time > lineTimings[lineTimings.length - 1] && !hasEnded) {
        setHasEnded(true);
        setTimeout(() => navigate('/levelPage'), 3000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentLineIndex, currentStanzaIndex, navigate, hasEnded]);

  const getStanzaIndex = (lineIndex) => {
    let count = 0;
    for (let i = 0; i < stanzas.length; i++) {
      count += stanzas[i].length;
      if (lineIndex < count) return i;
    }
    return stanzas.length - 1;
  };

  const highlightProperNouns = (line) => {
    const parts = [];
    let remaining = line;

    properNouns.forEach((noun) => {
      const regex = new RegExp(`\\b${noun}\\b`, 'i');
      const match = regex.exec(remaining);
      if (match) {
        const [before, matchText, after] = [
          remaining.slice(0, match.index),
          match[0],
          remaining.slice(match.index + match[0].length)
        ];
        if (before) parts.push(<span key={`before-${noun}`}>{before}</span>);
        parts.push(
          <motion.span
            key={noun + match.index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
            className={styles.highlight}
          >
            {matchText}
          </motion.span>
        );
        remaining = after;
      }
    });

    if (remaining) parts.push(<span key="rest">{remaining}</span>);
    return parts;
  };

  return (
    <GameLayout title="🎶 Papaku Pulang dari Jakarta 🎶">
      <audio ref={audioRef} src="/audio/lyrics.mp3" preload="auto" />

      <div className={styles.lyricsBackground}>
        <div className={styles.lyricsContainer}>
          <div className={`${styles.corner} ${styles.tl}`} />
          <div className={`${styles.corner} ${styles.tr}`} />
          <div className={`${styles.corner} ${styles.bl}`} />
          <div className={`${styles.corner} ${styles.br}`} />

          <AnimatePresence mode="wait">
            {stanzaVisible && (
              <motion.div
                key={currentStanzaIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className={styles.stanzaBlock}
              >
                {stanzas[currentStanzaIndex]
                  .slice(0, visibleLines.length)
                  .map((line, idx) => (
                    <motion.div
                      key={idx}
                      className={styles.line}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {highlightProperNouns(line)}
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.buttonGroup}>
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.button}
            >
              {isPlaying ? '⏸ Berhenti' : '▶️ Mainkan'}
            </motion.button>

            <motion.button
              onClick={() => navigate('/levelPage')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.button}
            >
              Langkau Lagu 🎮
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={styles.statusText}
          >
            {currentLineIndex < lineTimings.length
              ? 'Sedang bermain lagu... 🎤'
              : 'Mengalih ke permainan... 🕹️'}
          </motion.div>
        </div>
      </div>
    </GameLayout>
  );
}
