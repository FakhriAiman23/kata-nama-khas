import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from './GameLayout';
import Confetti from 'react-confetti';
import styles from './Level3.module.css';

const RAW_DATA = [
  { word: 'pelajar', type: 'Am' },
  { word: 'Gunung Ledang', type: 'Khas' },
  { word: 'Nescafé', type: 'Khas' },
  { word: 'kampung', type: 'Am' },
  { word: 'Sultan Ibrahim', type: 'Khas' },
  { word: 'lembu', type: 'Am' },
  { word: 'Hari Guru', type: 'Khas' },
  { word: 'bantal', type: 'Am' },
  { word: 'pensel', type: 'Am' },
  { word: 'meja', type: 'Am' },
  { word: 'Kerusi', type: 'Am' },
  { word: 'November', type: 'Khas' },
  { word: 'Kuala Lumpur', type: 'Khas' },
];

const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

export default function Level3() {
  const navigate = useNavigate();
  const sfxAudioRef = useRef({});
  const backgroundAudioRef = useRef(null);

  const [data] = useState(() => shuffle(RAW_DATA));
  const [dragged, setDragged] = useState(null);
  const [answers, setAnswers] = useState({ Khas: [], Am: [] });
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [feedbackBox, setFeedbackBox] = useState({ Khas: '', Am: '' });


  // Effect for initializing sound effects
  useEffect(() => {
    sfxAudioRef.current = {
      correct: new Audio(process.env.PUBLIC_URL + '/audio/correct.mp3'),
      wrong: new Audio(process.env.PUBLIC_URL + '/audio/wrong.mp3'),
      cheer: new Audio(process.env.PUBLIC_URL + '/audio/cheer.mp3'),
    };
  }, []);

  // Effect for updating window bounds for confetti
  useEffect(() => {
    const upd = () => setBounds({ width: window.innerWidth, height: window.innerHeight });
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

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

  const play = useCallback((t) => {
    const a = sfxAudioRef.current[t]; // Use sfxAudioRef for sound effects
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  }, []);

  const handleDrop = useCallback(
    (cat) => {
      if (!dragged) return;
      const ok = dragged.type === cat;

      // Trigger audio
      play(ok ? 'correct' : 'wrong');

      // Temporary visual feedback
      setFeedbackBox((prev) => ({
        ...prev,
        [cat]: ok ? 'correctBox' : 'wrongBox'
      }));

      // Clear highlight after delay
      setTimeout(() => {
        setFeedbackBox((prev) => ({ ...prev, [cat]: '' }));
      }, 600);

      if (ok) {
        setAnswers((a) => ({
          ...a,
          [cat]: [...a[cat], dragged],
        }));
        setScore((s) => s + 1);

        const totalAnswered = answers.Khas.length + answers.Am.length + 1;
        if (totalAnswered === data.length) {
          setTimeout(() => {
            play('cheer');
            setCelebrate(true);
            setShowPopup(true);
          }, 400);
        }
      }

      setDragged(null);
    },
    [answers, data.length, dragged, play]
  );


  const remaining = data.filter(
    (w) => !answers.Khas.some((a) => a.word === w.word) && !answers.Am.some((a) => a.word === w.word)
  );
  const prog = (score / data.length) * 100;

  const actions = {
    home: useCallback(() => navigate('/'), [navigate]),
    next: useCallback(() => navigate('/levelpage'), [navigate]),
    restart: useCallback(() => navigate('/level3'), [navigate]),
  };

  return (
    <GameLayout title="Tahap 3 – Padankan Kata Nama" score={score}>
      {celebrate && <Confetti width={bounds.width} height={bounds.height} recycle={false} numberOfPieces={300} />}

          <div className={styles.level3Container}>
            {/* Audio element for Level 3 background music (same as LevelPage) */}
            <audio ref={backgroundAudioRef} src={process.env.PUBLIC_URL + '/audio/level3Audio.mp3'} preload="auto" loop />
    
            <div className={styles.tip}>
              <strong>Peringatan:</strong> <br/><br/> Padankan perkataan mengikut kategori Kata Nama Am atau Kata Nama Khas <br/><br/>
              <span className={styles.highlight}>Kata Nama Khas</span> – nama khusus bagi orang, tempat, atau benda.<br />
              <span className={styles.highlight}>Kata Nama Am</span> – nama umum kepada benda atau konsep.
            </div>
    
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${prog}%` }} />
            </div>
    
            <div className={styles.responsiveWrapper}>
              <div className={styles.wordsSection}>
                <h3>Perkataan</h3>
                <div className={styles.wordsGrid}>
                  {remaining.map((w) => (
                    <div
                      key={w.word}
                      className={styles.wordCard}
                      draggable
                      onDragStart={() => setDragged(w)}
                    >
                      {w.word}
                    </div>
                  ))}
                </div>
              </div>
    
              <div className={styles.categories}>
                <h3>Kategori</h3>
                <div className={styles.categoryBox}>
                  <div
                    className={`${styles.boxBase} ${styles.properNouns} ${styles[feedbackBox.Khas]}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop('Khas')}
                  >
                    <h4>Kata Nama Khas</h4>
                    <div className={styles.answersContainer}>
                      {answers.Khas.map((w) => (
                        <span key={w.word} className={styles.wordCardSmall}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`${styles.boxBase} ${styles.commonNouns} ${styles[feedbackBox.Am]}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop('Am')}
                  >
                    <h4>Kata Nama Am</h4>
                    <div className={styles.answersContainer}>
                      {answers.Am.map((w) => (
                        <span key={w.word} className={styles.wordCardSmall}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            {showPopup && (
              <motion.div className={styles.popupBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div className={styles.popupBox} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <h2 className={styles.popupTitle}>🎉 Tahniah! 🎉</h2>
                  <p className={styles.popupScore}>
                    Skor anda: <strong>{score}</strong> daripada {data.length}
                  </p>
                  <div className={styles.popupButtons}>
                    <button className={`${styles.popupBtn} ${styles.popupBtnRed}`} onClick={actions.restart}>
                      🔄 Main Semula
                    </button>
                    <button className={`${styles.popupBtn} ${styles.popupBtnBlue}`} onClick={actions.home}>
                      🏠Halaman Utama
                    </button>
                    <button className={`${styles.popupBtn} ${styles.popupBtnPurple}`} onClick={actions.next}>
                      🚀 Halaman Peringkat
                    </button>
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
