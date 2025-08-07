import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from './GameLayout';
import Confetti from 'react-confetti';
import styles from './Level2.module.css';

const GAME_DATA = [
  { image: '/images/jakarta.png',  word: 'JAKARTA' },
  { image: '/images/melaka.png',   word: 'A\nFAMOSA' },
  { image: '/images/casio.png',    word: 'CASIO' },
  { image: '/images/fatimah.png',  word: 'FATIMAH' },
  { image: '/images/sekolah.png',  word: 'SEKOLAH\nSRI\nINDAH' },
  { image: '/images/adam.png',     word: 'ADAM' },
  { image: '/images/kampung.png',  word: 'KAMPUNG\nCERAH' },
  { image: '/images/kitkat.png',   word: 'KITKAT' },
  { image: '/images/proton.png',   word: 'PROTON' },
  { image: '/images/kucing.png',   word: 'SI\nBELANG' },
  { image: '/images/milo.png',     word: 'MILO' },
  { image: '/images/sungai.png',   word: 'SUNGAI\nKLANG' },
  { image: '/images/tesco.png',    word: 'TESCO' }
];

const NUM_QUESTIONS = 5;
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function Level2() {
  const navigate = useNavigate();
  const backgroundAudioRef = useRef(null); // Ref for background music
  const timer = useRef();
  const [data] = useState(() => shuffle(GAME_DATA));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [highlighted, setHighlighted] = useState(null);
  const [correctParts, setCorrectParts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  // musicStarted state is no longer needed as the useEffect handles the logic directly

  const current = data[idx];
  const parts = useMemo(() => current.word.split('\n').flatMap(w => w.split(' ')), [current.word]);
  const progress = useMemo(() => (idx / NUM_QUESTIONS) * 100, [idx]);

  // Effect for updating window bounds for confetti
  useEffect(() => {
    const handleResize = () => setBounds({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to reset state when current question index changes
  useEffect(() => {
    setCorrectParts([]);
    setHighlighted(null);
    setFeedback('');
    setBusy(false);

    window.scrollTo({ top: window.innerHeight / 2 - 200, behavior: 'auto' });
    return () => clearTimeout(timer.current);
  }, [idx]);

  // NEW useEffect for background music playback
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (audio) {
      audio.volume = 0.5; // Set desired volume
      audio.loop = true; // Loop the audio

      // Attempt to play immediately. If blocked, wait for a user gesture.
      audio.play().catch(() => {
        const handleUserGesture = () => {
          audio.play().catch(() => {}); // Try playing again on user gesture
          document.removeEventListener('click', handleUserGesture);
          document.removeEventListener('keydown', handleUserGesture);
        };
        // Add event listeners for common user gestures
        document.addEventListener('click', handleUserGesture, { once: true });
        document.addEventListener('keydown', handleUserGesture, { once: true });
      });
    }

    // Cleanup function: pause and reset audio when component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const playAudio = useCallback(type => {
    new Audio(`${process.env.PUBLIC_URL}/audio/${type}.mp3`).play().catch(() => {});
  }, []);

  const handleClick = useCallback((pIdx, cIdx) => {
    if (busy) return;
    setBusy(true);

    const correct = cIdx === 0 && !correctParts.includes(pIdx);
    setHighlighted({ pIdx, cIdx, ok: correct });
    setFeedback(correct ? 'Bagus! 👍' : 'Cuba lagi! 🤔');
    playAudio(correct ? 'correct' : 'wrong');

    timer.current = setTimeout(() => {
      if (correct) {
        const updated = [...correctParts, pIdx];
        setCorrectParts(updated);

        if (updated.length === parts.length) {
          setScore(s => s + 1);
          if (idx + 1 === NUM_QUESTIONS) {
            playAudio('cheer');
            setCelebrate(true);
            setShowPopup(true);
          } else {
            setIdx(i => i + 1);
          }
        }
      }
      setBusy(false);
      setTimeout(() => setFeedback(''), 400);
    }, correct ? 1200 : 800);
  }, [busy, correctParts, parts.length, idx, playAudio]);

  // Removed the startMusic function and onClick from the div as it's now handled by useEffect

  const actions = {
    restart: () => window.location.reload(),
    home: () => navigate('/'),
    next: () => navigate('/level3'),
  };

  return (
    <GameLayout title="Tahap 2 – Cari Huruf Besar" score={score}>
      <div className={styles.level2Container}> {/* Removed onClick={startMusic} */}
        {/* Audio element for Level 2 background music (same as LevelPage) */}
        <audio
          ref={backgroundAudioRef}
          src={process.env.PUBLIC_URL + '/audio/level2Audio.mp3'}
          preload="auto"
          loop
        />
        <p className={styles.instruction}>
          Pilih kedudukan huruf besar untuk kata nama khas di bawah:
        </p>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.responsiveWrapper}>
          <motion.img
            key={current.image}
            src={process.env.PUBLIC_URL + current.image}
            alt={current.word}
            className={styles.imageClue}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          />

          <div className={styles.letterGrid}>
            {parts.map((part, pIdx) => (
              <div key={pIdx} className={styles.wordLine}>
                {[...part].map((ch, cIdx) => {
                  const done = correctParts.includes(pIdx);
                  const isHl = highlighted?.pIdx === pIdx && highlighted?.cIdx === cIdx;

                  const cls = [
                    styles.letterTile,
                    done || (isHl && highlighted.ok) ? styles.correct : '',
                    isHl && !highlighted.ok ? styles.wrong : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <motion.div
                      key={`${pIdx}-${cIdx}`}
                      className={cls}
                      onClick={() => handleClick(pIdx, cIdx)}
                      disabled={busy || done}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * (pIdx * parts.length + cIdx) }}
                    >
                      {ch}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {feedback && (
          <motion.div
            className={`${styles.feedback} ${feedback.startsWith('Bagus') ? styles.correct : styles.wrong}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            aria-live="assertive"
          >
            {feedback}
          </motion.div>
        )}

        {showPopup && (
          <motion.div className={styles.popupBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {celebrate && (
              <Confetti
                width={bounds.width}
                height={bounds.height}
                recycle={false}
                numberOfPieces={300}
              />
            )}
            <motion.div className={styles.popupBox} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <h2 className={styles.popupTitle}>🎉 Tahniah! 🎉</h2>
              <p className={styles.popupScore}>
                Skor anda: {score} daripada {NUM_QUESTIONS}
              </p>
              <div className={styles.popupButtons}>
                <button className={`${styles.popupBtn} ${styles.popupBtnRed}`} onClick={actions.restart}>🔄 Main Semula</button>
                <button className={`${styles.popupBtn} ${styles.popupBtnBlue}`} onClick={actions.home}>🏠 Utama</button>
                <button className={`${styles.popupBtn} ${styles.popupBtnPurple}`} onClick={actions.next}>🚀 Tahap 3</button>
              </div>
            </motion.div>
            <img
              src={process.env.PUBLIC_URL + '/images/boy.png'}
              alt="Cheering character"
              className={styles.cheerBoy}
            />
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}
