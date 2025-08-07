import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from './GameLayout';
import Confetti from 'react-confetti';
import styles from './Level1.module.css';

const RAW_DATA = [
  { image: '/images/jakarta.png', correctWord: 'Jakarta', options: ['Jakarta','Pekan','Bendera'] },
  { image: '/images/melaka.png', correctWord: 'A Famosa', options: ['A Famosa','Bandar','Meriam'] },
  { image: '/images/casio.png', correctWord: 'Casio', options: ['Casio','KitKat','Jam Tangan'] },
  { image: '/images/fatimah.png', correctWord: 'Fatimah', options: ['Fatimah','Wanita','Guru'] },
  { image: '/images/sekolah.png', correctWord: 'Sekolah Sri Indah', options: ['Sekolah Sri Indah','Sekolah','Bangunan'] },
  { image: '/images/adam.png', correctWord: 'Adam', options: ['Adam','Lelaki','Budak'] },
  { image: '/images/kampung.png', correctWord: 'Kampung Cerah', options: ['Kampung Cerah','Bandar','Rumah'] },
  { image: '/images/kitkat.png', correctWord: 'KitKat', options: ['KitKat','Coklat','Gula-gula'] },
  { image: '/images/kucing.png', correctWord: 'Si Belang', options: ['Si Belang','Harimau','Kucing'] },
  { image: '/images/milo.png', correctWord: 'Milo', options: ['Milo','Kopi','Susu'] },
  { image: '/images/proton.png', correctWord: 'Proton', options: ['Proton','Kereta','Motorsikal'] },
  { image: '/images/sungai.png', correctWord: 'Sungai Klang', options: ['Sungai Klang','Bangunan','Laut'] },
  { image: '/images/tesco.png', correctWord: 'Tesco', options: ['Tesco','Kedai','Pasar raya'] },
];

const NUM_QUESTIONS = 5;
const shuffle = arr => arr.slice().sort(() => Math.random() - 0.5);

export default function Level1() {
  const navigate = useNavigate();
  const backgroundAudioRef = useRef(null);
  const sfxRef = useRef({});
  const timerRef = useRef();
  const [questions, setQuestions] = useState(() => shuffle(RAW_DATA).slice(0, NUM_QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const current = questions[idx];

  // Handle screen resize
  useEffect(() => {
    const update = () => setBounds({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Preload assets & sounds
  useEffect(() => {
    (async () => {
      await Promise.all(questions.map(q =>
        new Promise(r => {
          const img = new Image(); img.src = process.env.PUBLIC_URL + q.image;
          img.onload = img.onerror = r;
        })
      ));
      sfxRef.current = {
        correct: new Audio(process.env.PUBLIC_URL + '/audio/correct.mp3'),
        wrong: new Audio(process.env.PUBLIC_URL + '/audio/wrong.mp3'),
        cheer: new Audio(process.env.PUBLIC_URL + '/audio/cheer.mp3'),
      };
      setLoading(false);
    })();
    return () => clearTimeout(timerRef.current);
  }, [questions]);

  // Setup question options
  useEffect(() => {
    if (!loading) {
      setOptions(shuffle(current.options));
      setSelected(null);
      setBusy(false);
      setFeedback('');
    }
  }, [current, loading]);

  // Background music autoplay
  useEffect(() => {
    if (loading) return;
    const audio = backgroundAudioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.loop = true;
      audio.play().catch(() => {
        const handleUserGesture = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', handleUserGesture);
          document.removeEventListener('keydown', handleUserGesture);
        };
        document.addEventListener('click', handleUserGesture, { once: true });
        document.addEventListener('keydown', handleUserGesture, { once: true });
      });
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [loading]);

  // Play cheer sound when popup appears
  useEffect(() => {
    if (showPopup && sfxRef.current.cheer) {
      sfxRef.current.cheer.currentTime = 0;
      sfxRef.current.cheer.play().catch(() => {});
    }
  }, [showPopup]);

  const play = useCallback(key => {
    const audio = sfxRef.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  const handleSelect = useCallback(word => {
    if (busy) return;
    setBusy(true);
    setSelected(word);
    const ok = word === current.correctWord;
    setFeedback(ok ? 'Betul! 👍' : 'Cuba lagi! 🤔');
    play(ok ? 'correct' : 'wrong');

    timerRef.current = setTimeout(() => {
      if (ok) {
        setScore(s => s + 1);
        if (idx + 1 === NUM_QUESTIONS) {
          setCelebrate(true);
          setShowPopup(true); // Cheer will now play via useEffect
        } else {
          setIdx(i => i + 1);
          window.scrollTo({ top: window.innerHeight / 2 - 200, behavior: 'auto' });
        }
      } else {
        setBusy(false);
      }
      setFeedback('');
    }, ok ? 1000 : 800);
  }, [busy, current, idx, play]);

  const restart = useCallback(() => {
    clearTimeout(timerRef.current);
    setQuestions(shuffle(RAW_DATA).slice(0, NUM_QUESTIONS));
    setIdx(0);
    setScore(0);
    setCelebrate(false);
    setShowPopup(false);
    setLoading(true);
  }, []);

  if (loading) {
    return (
      <GameLayout title="Memuatkan…" score={score}>
        <div className={styles.loader}>Memuatkan permainan</div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Tahap 1 – Pilih Kata Nama Khas" score={score}>
      <div className={styles.level1Container}>
        <audio
          ref={backgroundAudioRef}
          src={process.env.PUBLIC_URL + '/audio/level1Audio.mp3'}
          preload="auto"
          loop
        />
        <p className={styles.instruction}>
          Pilih kata nama khas yang tepat untuk gambar di bawah:
        </p>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(idx / NUM_QUESTIONS) * 100}%` }}
          />
        </div>

        <div className={styles.responsiveWrapper}>
          <motion.img
            key={current.image}
            src={process.env.PUBLIC_URL + current.image}
            alt={current.correctWord}
            loading="lazy"
            className={styles.imagePanel}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          />
          <div className={styles.optionsPanel}>
            {options.map(opt => (
              <motion.button
                key={opt}
                className={`${styles.optionButton} ${
                  selected === opt
                    ? (opt === current.correctWord ? styles.correct : styles.wrong)
                    : ''
                }`}
                onClick={() => handleSelect(opt)}
                disabled={busy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>

        {feedback && (
          <motion.div
            className={`${styles.feedback} ${
              feedback.startsWith('Betul') ? styles.correct : styles.wrong
            }`}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {feedback}
          </motion.div>
        )}
      </div>

      {showPopup && (
        <motion.div className={styles.popupBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {celebrate && (
            <Confetti width={bounds.width} height={bounds.height} recycle={false} numberOfPieces={300} />
          )}

          <motion.div className={styles.popupBox} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h2 className={styles.popupTitle}>Tahniah!</h2>
            <p className={styles.popupText}>
              Skor anda: {score} daripada {NUM_QUESTIONS}
            </p>

            <div className={styles.popupButtons}>
              <button className={`${styles.popupBtn} ${styles.popupBtnRed}`} onClick={restart}>
                🔄 Main Semula
              </button>
              <button className={`${styles.popupBtn} ${styles.popupBtnBlue}`} onClick={() => navigate('/')}>
                🏠 Utama
              </button>
              <button className={`${styles.popupBtn} ${styles.popupBtnPurple}`} onClick={() => navigate('/level2')}>
                🚀 Tahap 2
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
    </GameLayout>
  );
}
