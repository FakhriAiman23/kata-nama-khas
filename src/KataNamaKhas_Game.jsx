// KataNamaKhas Game - Enhanced with Bootstrap 5 + React 18
// A Malay Language Educational Game: Kata Nama Khas (Proper Nouns)
// To use: import this component, ensure Bootstrap 5 CSS + react-confetti + framer-motion are installed.

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

// ─── INLINE BOOTSTRAP 5 CDN + CUSTOM GAME CSS ───────────────────────────────
// In your public/index.html, add:
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;900&display=swap" rel="stylesheet">

// ─── GAME DATA ───────────────────────────────────────────────────────────────
const LEVEL1_DATA = [
  { image: "/images/jakarta.png",   correctWord: "Jakarta",          options: ["Jakarta","Pekan","Bendera"] },
  { image: "/images/melaka.png",    correctWord: "A Famosa",         options: ["A Famosa","Bandar","Meriam"] },
  { image: "/images/casio.png",     correctWord: "Casio",            options: ["Casio","KitKat","Jam Tangan"] },
  { image: "/images/fatimah.png",   correctWord: "Fatimah",          options: ["Fatimah","Wanita","Guru"] },
  { image: "/images/sekolah.png",   correctWord: "Sekolah Sri Indah",options: ["Sekolah Sri Indah","Sekolah","Bangunan"] },
  { image: "/images/adam.png",      correctWord: "Adam",             options: ["Adam","Lelaki","Budak"] },
  { image: "/images/kampung.png",   correctWord: "Kampung Cerah",    options: ["Kampung Cerah","Bandar","Rumah"] },
  { image: "/images/kitkat.png",    correctWord: "KitKat",           options: ["KitKat","Coklat","Gula-gula"] },
  { image: "/images/kucing.png",    correctWord: "Si Belang",        options: ["Si Belang","Harimau","Kucing"] },
  { image: "/images/milo.png",      correctWord: "Milo",             options: ["Milo","Kopi","Susu"] },
  { image: "/images/proton.png",    correctWord: "Proton",           options: ["Proton","Kereta","Motorsikal"] },
  { image: "/images/sungai.png",    correctWord: "Sungai Klang",     options: ["Sungai Klang","Bangunan","Laut"] },
  { image: "/images/tesco.png",     correctWord: "Tesco",            options: ["Tesco","Kedai","Pasar raya"] },
];

const LEVEL2_DATA = [
  { image: "/images/jakarta.png",  word: "JAKARTA" },
  { image: "/images/melaka.png",   word: "A\nFAMOSA" },
  { image: "/images/casio.png",    word: "CASIO" },
  { image: "/images/fatimah.png",  word: "FATIMAH" },
  { image: "/images/sekolah.png",  word: "SEKOLAH\nSRI\nINDAH" },
  { image: "/images/adam.png",     word: "ADAM" },
  { image: "/images/kampung.png",  word: "KAMPUNG\nCERAH" },
  { image: "/images/kitkat.png",   word: "KITKAT" },
  { image: "/images/proton.png",   word: "PROTON" },
  { image: "/images/kucing.png",   word: "SI\nBELANG" },
  { image: "/images/milo.png",     word: "MILO" },
  { image: "/images/sungai.png",   word: "SUNGAI\nKLANG" },
  { image: "/images/tesco.png",    word: "TESCO" },
];

const LEVEL3_DATA = [
  { word: "Pelajar",      type: "Am" },
  { word: "Gunung Ledang",type: "Khas" },
  { word: "Nescafé",      type: "Khas" },
  { word: "Kampung",      type: "Am" },
  { word: "Sultan Ibrahim",type:"Khas" },
  { word: "Lembu",        type: "Am" },
  { word: "Hari Guru",    type: "Khas" },
  { word: "Bantal",       type: "Am" },
  { word: "Pensel",       type: "Am" },
  { word: "Meja",         type: "Am" },
  { word: "Kerusi",       type: "Am" },
  { word: "November",     type: "Khas" },
  { word: "Kuala Lumpur", type: "Khas" },
];

const STANZAS = [
  ["Papaku pulang dari Jakarta","Singgah sebentar di Melaka","Papa belikan jam G-shock berharga","Jumpa cikgu bernama Fatimah","Mengajar di Sekolah Sri Indah","Nama khas janganlah dilupa","Huruf besar mesti ada"],
  ["Hari Ahad pergi ke Sungai Klang","Naik kereta dengan Si Komeng","Jumpa kawan bernama Arif","Dia tinggal di Kampung Cerah","Nama orang, tempat dan, benda","Itulah nama khas semua"],
  ["Ibu belikan Milo dan Kitkat","Di pasar raya Tesco terdekat","Kereta Proton buatan negara","Jenama juga nama khas ya!","Gunakan huruf besar sentiasa"],
];
const PROPER_NOUNS = ["Jakarta","Melaka","G-shock","Fatimah","Sekolah Sri Indah","Ahad","Sungai Klang","Si Komeng","Arif","Kampung Cerah","Milo","Kitkat","Tesco","Proton"];
const LINE_TIMINGS = [7.0,12.2,16.0,19.0,23.0,27.0,31.0,35.0,39.0,43.0,46.0,51.0,55.0,59.0,62.0,67.0,71.0,74.6];
const NUM_QUESTIONS = 5;
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// ─── GLOBAL STYLES (injected once) ──────────────────────────────────────────
const GAME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;900&display=swap');

  :root {
    --pixel: 'Press Start 2P', monospace;
    --body-font: 'Nunito', sans-serif;
    --gold: #FFD700;
    --gold-dark: #B8860B;
    --emerald: #00C853;
    --ruby: #E53935;
    --sapphire: #1E88E5;
    --amethyst: #8E24AA;
    --obsidian: #0D0D0D;
    --stone: #2A2A2A;
    --cobble: #3D3D3D;
    --dirt: #4A3728;
    --wood: #6B4C2A;
    --sky: #4FC3F7;
    --cream: #FFF8E7;
    --shadow: 0 4px 0 rgba(0,0,0,0.6);
    --glow-gold: 0 0 20px rgba(255,215,0,0.4);
    --glow-green: 0 0 20px rgba(0,200,83,0.5);
    --glow-red: 0 0 20px rgba(229,57,53,0.5);
    --border-pixel: 4px solid var(--wood);
  }

  * { box-sizing: border-box; }

  body {
    font-family: var(--body-font);
    background-color: var(--obsidian);
    color: var(--cream);
    margin: 0;
    overflow-x: hidden;
  }

  /* ── PIXEL BACKGROUND TEXTURE ── */
  .pixel-bg {
    background-color: var(--obsidian);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.03) 31px, rgba(255,255,255,0.03) 32px),
      repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.03) 31px, rgba(255,255,255,0.03) 32px);
    min-height: 100vh;
  }

  /* ── GAME NAVBAR ── */
  .game-nav {
    background: linear-gradient(180deg, #111 0%, #1c1c1c 60%, #141414 100%);
    border-bottom: 3px solid var(--wood);
    box-shadow: 0 4px 0 rgba(0,0,0,0.9), 0 5px 20px rgba(0,0,0,0.5);
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 999;
    height: 60px;
    display: flex;
    align-items: center;
  }
  .game-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,215,0,0.35), transparent);
    pointer-events: none;
  }
  .game-nav .brand {
    font-family: var(--pixel);
    font-size: 0.58rem;
    color: var(--gold);
    text-shadow: 2px 2px 0 #000, 0 0 18px rgba(255,215,0,0.35);
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    border: none;
    background: none;
    padding: 0;
  }
  .game-nav .brand-icon {
    display: inline-block;
    font-size: 1.1rem;
    animation: brandSpin 4s ease-in-out infinite;
  }
  @keyframes brandSpin {
    0%,100% { transform: rotate(-8deg) scale(1); }
    50% { transform: rotate(8deg) scale(1.15) translateY(-2px); }
  }
  .game-nav .brand:hover {
    text-shadow: 2px 2px 0 #000, 0 0 28px rgba(255,215,0,0.65);
    transform: translateY(-1px);
  }
  .game-nav .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .game-nav .nav-divider {
    width: 1px; height: 22px;
    background: linear-gradient(to bottom, transparent, rgba(107,76,42,0.5), transparent);
    margin: 0 4px;
  }
  .game-nav .nav-btn {
    font-family: var(--pixel);
    font-size: 0.4rem;
    background: transparent;
    color: rgba(255,255,255,0.55);
    border: 2px solid transparent;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    letter-spacing: 0.5px;
    position: relative;
    border-radius: 2px;
  }
  .game-nav .nav-btn .nav-icon {
    font-size: 0.95rem;
    transition: transform 0.2s;
  }
  .game-nav .nav-btn:hover {
    color: var(--gold);
    border-color: rgba(107,76,42,0.6);
    background: rgba(255,215,0,0.05);
    transform: translateY(-3px);
    box-shadow: 0 5px 0 rgba(0,0,0,0.6), 0 0 10px rgba(255,215,0,0.1);
    text-shadow: 0 0 8px rgba(255,215,0,0.4);
  }
  .game-nav .nav-btn:hover .nav-icon { transform: scale(1.25) rotate(-8deg); }
  .game-nav .nav-btn:active { transform: translateY(1px); box-shadow: 0 1px 0 rgba(0,0,0,0.5); }
  .game-nav .nav-btn.nav-active {
    color: var(--gold);
    border-color: var(--wood);
    background: rgba(255,215,0,0.07);
    box-shadow: 0 4px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,215,0,0.08);
    text-shadow: 0 0 10px rgba(255,215,0,0.35);
  }
  .game-nav .nav-btn.nav-active .nav-icon { animation: navIconPulse 2s ease-in-out infinite; }
  @keyframes navIconPulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.2) rotate(-5deg); }
  }

  /* ── PIXEL CARD ── */
  .pixel-card {
    background: linear-gradient(160deg, var(--stone) 0%, var(--cobble) 100%);
    border: var(--border-pixel);
    box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.05);
    position: relative;
    overflow: hidden;
  }
  .pixel-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.4;
  }

  /* ── HERO SECTION ── */
  .hero-section {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.08) 0%, transparent 60%),
      linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%),
      url('/images/mountain.png') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .hero-title {
    font-family: var(--pixel);
    font-size: clamp(1.2rem, 4vw, 2.5rem);
    color: var(--gold);
    text-shadow: 4px 4px 0 #000, 0 0 40px rgba(255,215,0,0.3);
    line-height: 1.6;
  }
  .hero-subtitle {
    font-family: var(--body-font);
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    color: rgba(255,255,255,0.85);
    font-weight: 600;
  }

  /* ── PIXEL BUTTON (main) ── */
  .btn-pixel {
    font-family: var(--pixel);
    font-size: 0.62rem;
    background: linear-gradient(180deg, #4f4f4f 0%, var(--cobble) 50%, #222 100%);
    color: var(--cream);
    border: 3px solid var(--wood);
    box-shadow: 0 6px 0 #000, 0 7px 0 rgba(107,76,42,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s, color 0.15s, border-color 0.15s, text-shadow 0.15s;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
  }
  .btn-pixel::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
    transition: left 0.5s ease;
    pointer-events: none;
  }
  .btn-pixel:hover {
    background: linear-gradient(180deg, #5e5e5e 0%, var(--dirt) 50%, #2a2a2a 100%);
    color: var(--gold);
    transform: translateY(-4px);
    box-shadow: 0 8px 0 #000, 0 9px 0 rgba(107,76,42,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px rgba(255,215,0,0.1);
    text-shadow: 0 0 8px rgba(255,215,0,0.45);
    border-color: var(--gold-dark);
  }
  .btn-pixel:hover::after { left: 150%; }
  .btn-pixel:active { transform: translateY(3px); box-shadow: 0 2px 0 #000, inset 0 2px 0 rgba(0,0,0,0.35); }
  .btn-pixel-gold {
    background: linear-gradient(180deg, #ffe566 0%, var(--gold) 50%, #a07000 100%);
    color: #1a0e00;
    border-color: #7a5500;
    box-shadow: 0 6px 0 #3a2800, 0 7px 0 rgba(255,215,0,0.12), inset 0 1px 0 rgba(255,255,255,0.45);
    text-shadow: 0 1px 0 rgba(255,255,255,0.25);
  }
  .btn-pixel-gold:hover {
    background: linear-gradient(180deg, #ffee88 0%, #ffe033 50%, #c08800 100%);
    color: #1a0e00;
    box-shadow: 0 8px 0 #3a2800, 0 0 22px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45);
    border-color: #996600;
    text-shadow: 0 0 8px rgba(255,215,0,0.4);
  }
  .btn-pixel-green {
    background: linear-gradient(180deg, #44dd77 0%, #00C853 50%, #004d1a 100%);
    border-color: #003d14;
    box-shadow: 0 6px 0 #002810, inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn-pixel-green:hover { color: #fff; box-shadow: 0 8px 0 #002810, 0 0 14px rgba(0,200,83,0.35); }
  .btn-pixel-red {
    background: linear-gradient(180deg, #ff6e6e 0%, #E53935 50%, #7f0000 100%);
    border-color: #580000;
    box-shadow: 0 6px 0 #3d0000, inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn-pixel-red:hover { color: #fff; box-shadow: 0 8px 0 #3d0000, 0 0 14px rgba(229,57,53,0.35); }
  .btn-pixel-blue {
    background: linear-gradient(180deg, #64b8f8 0%, #1E88E5 50%, #0d47a1 100%);
    border-color: #093882;
    box-shadow: 0 6px 0 #052260, inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn-pixel-blue:hover { color: #fff; box-shadow: 0 8px 0 #052260, 0 0 14px rgba(30,136,229,0.35); }
  .btn-pixel-purple {
    background: linear-gradient(180deg, #d08ce0 0%, #8E24AA 50%, #4a148c 100%);
    border-color: #2c006a;
    box-shadow: 0 6px 0 #1a0044, inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .btn-pixel-purple:hover { color: #fff; box-shadow: 0 8px 0 #1a0044, 0 0 14px rgba(142,36,170,0.35); }

  /* ── SCORE BADGE ── */
  .score-badge {
    font-family: var(--pixel);
    font-size: 0.55rem;
    background: var(--obsidian);
    border: 3px solid var(--gold);
    color: var(--gold);
    padding: 0.5rem 1rem;
    box-shadow: 3px 3px 0 #000, var(--glow-gold);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* ── PROGRESS BAR ── */
  .pixel-progress {
    height: 18px;
    background: var(--obsidian);
    border: 3px solid var(--wood);
    overflow: hidden;
    box-shadow: inset 0 2px 0 rgba(0,0,0,0.5);
  }
  .pixel-progress-fill {
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      var(--emerald),
      var(--emerald) 10px,
      #00a844 10px,
      #00a844 20px
    );
    transition: width 0.4s ease;
    position: relative;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  }

  /* ── OPTION BUTTONS ── */
  .option-btn {
    font-family: var(--pixel);
    font-size: 0.55rem;
    background: linear-gradient(180deg, #50422f 0%, var(--dirt) 50%, #2a1e10 100%);
    color: var(--cream);
    border: 3px solid var(--wood);
    box-shadow: 0 5px 0 #000, inset 0 1px 0 rgba(255,255,255,0.08);
    padding: 1rem;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s, background 0.12s, color 0.12s, text-shadow 0.12s;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.5;
    width: 100%;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }
  .option-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,215,0,0.06), transparent 60%);
    opacity: 0;
    transition: opacity 0.15s;
  }
  .option-btn:hover:not(:disabled) {
    background: linear-gradient(180deg, #6a5540 0%, #5a3d2b 50%, #3a2615 100%);
    color: var(--gold);
    transform: translateY(-4px);
    box-shadow: 0 7px 0 #000, 0 0 10px rgba(255,215,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
    text-shadow: 0 0 8px rgba(255,215,0,0.4);
    border-color: var(--gold-dark);
  }
  .option-btn:hover:not(:disabled)::before { opacity: 1; }
  .option-btn:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 #000; }
  .option-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .option-btn.correct-ans {
    background: linear-gradient(180deg, #44ee88 0%, var(--emerald) 50%, #003d14 100%) !important;
    border-color: var(--emerald) !important;
    color: #fff !important;
    box-shadow: 0 5px 0 #001a08, var(--glow-green) !important;
    animation: pixelPulse 0.5s;
  }
  .option-btn.wrong-ans {
    background: linear-gradient(180deg, #ff6e6e 0%, var(--ruby) 50%, #5c0000 100%) !important;
    border-color: var(--ruby) !important;
    color: #fff !important;
    box-shadow: 0 5px 0 #2a0000, var(--glow-red) !important;
    animation: pixelShake 0.5s;
  }

  /* ── LETTER TILES ── */
  .letter-tile {
    width: clamp(42px, 6vw, 56px);
    height: clamp(42px, 6vw, 56px);
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    color: var(--obsidian);
    border: 3px solid var(--gold-dark);
    box-shadow: 3px 3px 0 #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--pixel);
    font-size: clamp(0.5rem, 1.5vw, 0.75rem);
    cursor: pointer;
    transition: all 0.1s;
    user-select: none;
  }
  .letter-tile:hover:not(.done-tile) {
    transform: scale(1.15) translateY(-4px);
    box-shadow: 5px 5px 0 #000;
    filter: brightness(1.15);
  }
  .letter-tile.correct-tile {
    background: linear-gradient(135deg, #1b5e20, var(--emerald));
    border-color: var(--emerald);
    color: #fff;
    box-shadow: 3px 3px 0 #000, var(--glow-green);
    animation: pixelPulse 0.4s;
  }
  .letter-tile.wrong-tile {
    background: linear-gradient(135deg, #7f0000, var(--ruby));
    border-color: var(--ruby);
    color: #fff;
    animation: pixelShake 0.4s;
  }
  .letter-tile.done-tile {
    background: linear-gradient(135deg, #1b5e20, var(--emerald));
    border-color: var(--emerald);
    color: #fff;
    box-shadow: 3px 3px 0 #000;
    cursor: default;
  }

  /* ── DRAG CARDS ── */
  .word-drag-card {
    font-family: var(--pixel);
    font-size: 0.5rem;
    background: linear-gradient(135deg, var(--cobble), var(--stone));
    color: var(--cream);
    border: 3px solid var(--wood);
    box-shadow: 3px 3px 0 #000;
    padding: 0.5rem 0.8rem;
    cursor: grab;
    transition: all 0.12s;
    display: inline-block;
    line-height: 1.6;
  }
  .word-drag-card:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 5px 5px 0 #000;
    border-color: var(--gold);
    color: var(--gold);
  }
  .word-drag-card:active { cursor: grabbing; }

  .drop-zone {
    background: rgba(0,0,0,0.35);
    border: 3px dashed var(--wood);
    min-height: 130px;
    padding: 1rem;
    transition: all 0.2s;
  }
  .drop-zone-khas { border-color: var(--sapphire); }
  .drop-zone-am   { border-color: var(--gold); }
  .drop-zone.correct-flash {
    border-style: solid;
    border-color: var(--emerald);
    background: rgba(0,200,83,0.12);
    box-shadow: 0 0 15px rgba(0,200,83,0.4);
  }
  .drop-zone.wrong-flash {
    border-style: solid;
    border-color: var(--ruby);
    background: rgba(229,57,53,0.12);
    box-shadow: 0 0 15px rgba(229,57,53,0.4);
  }
  .word-done-chip {
    font-family: var(--pixel);
    font-size: 0.4rem;
    background: var(--cobble);
    border: 2px solid var(--wood);
    color: var(--cream);
    padding: 0.3rem 0.5rem;
    display: inline-block;
    box-shadow: 2px 2px 0 #000;
    line-height: 1.6;
  }

  /* ── FEEDBACK TOAST ── */
  .feedback-toast {
    font-family: var(--pixel);
    font-size: 0.65rem;
    padding: 0.75rem 1.5rem;
    border: 3px solid;
    box-shadow: 4px 4px 0 #000;
    text-align: center;
    letter-spacing: 1px;
  }
  .feedback-toast.correct-fb {
    background: linear-gradient(135deg, #1b5e20, #2e7d32);
    border-color: var(--emerald);
    color: #fff;
    box-shadow: 4px 4px 0 #000, var(--glow-green);
  }
  .feedback-toast.wrong-fb {
    background: linear-gradient(135deg, #7f0000, #c62828);
    border-color: var(--ruby);
    color: #fff;
    box-shadow: 4px 4px 0 #000, var(--glow-red);
  }

  /* ── POPUP ── */
  .popup-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
  }
  .popup-box {
    background: linear-gradient(160deg, var(--stone), var(--cobble));
    border: 5px solid var(--wood);
    box-shadow: 8px 8px 0 #000, var(--glow-gold);
    padding: 2.5rem;
    max-width: 400px;
    width: 90vw;
    text-align: center;
    position: relative;
  }
  .popup-box::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .popup-title {
    font-family: var(--pixel);
    font-size: 1.2rem;
    color: var(--gold);
    text-shadow: 3px 3px 0 #000;
    margin-bottom: 1rem;
  }
  .popup-score {
    font-family: var(--pixel);
    font-size: 0.65rem;
    color: var(--cream);
    margin-bottom: 1.5rem;
    line-height: 2;
  }
  .popup-score span {
    color: var(--emerald);
    font-size: 1rem;
    display: inline-block;
  }

  /* ── LEVEL PAGE ── */
  .level-card {
    background: linear-gradient(160deg, var(--stone), var(--cobble));
    border: 4px solid var(--wood);
    box-shadow: 0 6px 0 #000, 0 7px 0 rgba(107,76,42,0.3);
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s, border-color 0.15s;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    border-radius: 2px;
  }
  .level-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,215,0,0.06), transparent);
    pointer-events: none;
  }
  .level-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 0 #000, 0 13px 0 rgba(107,76,42,0.3), var(--glow-gold);
    border-color: var(--gold);
  }
  .level-badge {
    font-family: var(--pixel);
    font-size: 1.5rem;
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--dirt), var(--wood));
    border: 3px solid var(--gold);
    box-shadow: 3px 3px 0 #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    text-shadow: 2px 2px 0 #000;
    flex-shrink: 0;
  }
  .level-title {
    font-family: var(--pixel);
    font-size: 0.6rem;
    color: var(--gold);
    text-shadow: 1px 1px 0 #000;
    line-height: 1.8;
  }
  .level-desc {
    font-family: var(--body-font);
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    margin-top: 0.5rem;
  }

  /* ── LYRICS PAGE ── */
  .lyric-container {
    background: rgba(10,10,10,0.75);
    border: 4px solid var(--wood);
    box-shadow: 0 0 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4);
    max-width: 700px;
    width: 90%;
    margin: 2rem auto;
    padding: 2.5rem;
    position: relative;
    min-height: 340px;
  }
  .lyric-line {
    font-family: var(--body-font);
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 700;
    line-height: 2.2;
    text-align: center;
    color: rgba(255,255,255,0.85);
  }
  .lyric-highlight {
    font-weight: 900;
    background: rgba(255,215,0,0.18);
    color: var(--gold);
    padding: 0.15rem 0.4rem;
    border: 2px solid rgba(255,215,0,0.4);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255,215,0,0.2);
    display: inline-block;
  }
  .lyric-status {
    font-family: var(--pixel);
    font-size: 0.45rem;
    color: rgba(255,215,0,0.7);
    text-align: center;
    letter-spacing: 2px;
    margin-top: 1.5rem;
  }

  /* ── HOME RULES ── */
  .rule-item {
    background: rgba(0,0,0,0.35);
    border-left: 5px solid var(--wood);
    padding: 1rem 1.5rem;
    transition: all 0.2s;
    position: relative;
  }
  .rule-item:hover { border-left-color: var(--gold); transform: translateX(4px); }
  .rule-num {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--dirt), var(--wood));
    border: 2px solid var(--gold);
    color: var(--gold);
    font-family: var(--pixel);
    font-size: 0.8rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 2px 2px 0 #000;
    flex-shrink: 0;
  }
  .rule-heading { font-family: var(--pixel); font-size: 0.55rem; color: var(--gold); margin-bottom: 0.3rem; }
  .rule-text { font-size: 0.9rem; color: rgba(255,255,255,0.75); }

  /* ── GAME IMAGE ── */
  .game-image {
    border: 4px solid var(--wood);
    box-shadow: 4px 4px 0 #000;
    background: rgba(0,0,0,0.4);
    object-fit: contain;
    max-width: 280px;
    width: 100%;
  }

  /* ── SECTION HEADERS ── */
  .section-header {
    font-family: var(--pixel);
    font-size: clamp(0.7rem, 2.5vw, 1rem);
    color: var(--gold);
    text-shadow: 3px 3px 0 #000;
    border-bottom: 3px solid var(--wood);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }

  /* ── CHEER BOY ── */
  .cheer-boy {
    position: absolute;
    bottom: 15%;
    right: 5%;
    height: 180px;
    pointer-events: none;
    z-index: 10;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(4px 4px 0 rgba(0,0,0,0.5));
  }

  /* ── INSTRUCTION BOX ── */
  .instruction-box {
    background: rgba(0,0,0,0.5);
    border-left: 5px solid var(--gold);
    border-right: 1px solid rgba(255,215,0,0.2);
    padding: 0.75rem 1rem;
    font-family: var(--pixel);
    font-size: 0.5rem;
    color: var(--cream);
    line-height: 2;
    text-shadow: 1px 1px 0 #000;
  }

  /* ── TIP BOX ── */
  .tip-box {
    background: rgba(0,0,0,0.5);
    border-left: 5px solid var(--gold);
    padding: 1rem;
    font-family: var(--body-font);
    font-size: 0.9rem;
    color: var(--cream);
    line-height: 1.7;
  }
  .tip-highlight {
    background: rgba(255,215,0,0.15);
    color: var(--gold);
    font-weight: 700;
    padding: 0 0.3rem;
  }

  /* ── FOOTER ── */
  .game-footer {
    background: linear-gradient(135deg, var(--obsidian), var(--stone));
    border-top: 4px solid var(--wood);
    padding: 1rem;
    text-align: center;
    font-family: var(--pixel);
    font-size: 0.4rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 1px;
    text-shadow: 1px 1px 0 #000;
  }

  /* ── ANIMATIONS ── */
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(-5deg); }
    50% { transform: translateY(-12px) rotate(-5deg); }
  }
  @keyframes pixelPulse {
    0% { box-shadow: 0 0 0 0 rgba(0,200,83,0.7); }
    70% { box-shadow: 0 0 0 14px rgba(0,200,83,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,200,83,0); }
  }
  @keyframes pixelShake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px) rotate(-2deg); }
    40% { transform: translateX(6px) rotate(2deg); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.08); }
    70% { transform: scale(0.96); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes twinkle {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.95); }
  }
  .twinkle { animation: twinkle 2s ease-in-out infinite; }
`;

// ─── STYLE INJECTOR ──────────────────────────────────────────────────────────
function StyleProvider() {
  useEffect(() => {
    const id = "knk-game-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GAME_STYLES;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ─── SOUND HOOK ──────────────────────────────────────────────────────────────
function useSound() {
  const sfx = useRef({});
  const playSound = useCallback((key) => {
    try {
      const a = sfx.current[key] || new Audio(`/audio/${key}.mp3`);
      sfx.current[key] = a;
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  }, []);
  return playSound;
}

// ─── POPUP COMPONENT ─────────────────────────────────────────────────────────
function GamePopup({ score, total, onRestart, onHome, onNext, nextLabel = "Tahap Seterusnya 🚀" }) {
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const upd = () => setBounds({ width: window.innerWidth, height: window.innerHeight });
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  const stars = score === total ? 3 : score >= total * 0.7 ? 2 : 1;

  return (
    <motion.div className="popup-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Confetti width={bounds.width} height={bounds.height} recycle={false} numberOfPieces={350} />
      <motion.div className="popup-box" initial={{ scale: 0.6, y: 50 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        <div className="popup-title">🏆 TAHNIAH!</div>
        <div className="d-flex justify-content-center gap-2 mb-3">
          {[1,2,3].map(i => (
            <motion.span key={i} style={{ fontSize: "1.8rem", filter: i <= stars ? "none" : "grayscale(1) opacity(0.3)" }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 300 }}>
              ⭐
            </motion.span>
          ))}
        </div>
        <div className="popup-score">
          Skor Anda:<br />
          <span>{score}</span> / {total}
        </div>
        <div className="d-flex flex-column gap-2 align-items-center">
          <button className="btn-pixel btn-pixel-red w-75" onClick={onRestart}>🔄 Main Semula</button>
          <button className="btn-pixel btn-pixel-blue w-75" onClick={onHome}>🏠 Halaman Utama</button>
          {onNext && <button className="btn-pixel btn-pixel-purple w-75" onClick={onNext}>{nextLabel}</button>}
        </div>
        <img src="/images/boy.png" alt="cheering" className="cheer-boy" style={{ height: 140, bottom: "-10px", right: "-10px", animation: "float 2s ease-in-out infinite" }} />
      </motion.div>
    </motion.div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function GameNav({ page, setPage }) {
  return (
    <nav className="game-nav">
      <div className="d-flex align-items-center justify-content-between w-100">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-icon">⚔️</span>
              KATA NAMA KHAS
        </button>
        <div className="nav-links">
          <button className={`nav-btn ${page === "home" ? "nav-active" : ""}`} onClick={() => setPage("home")}>
            <span className="nav-icon">🏠</span> Utama
          </button>
          <div className="nav-divider" />
          <button className={`nav-btn ${page === "lyrics" ? "nav-active" : ""}`} onClick={() => setPage("lyrics")}>
            <span className="nav-icon">🎵</span> Lagu
          </button>
          <div className="nav-divider" />
          <button className={`nav-btn ${page === "levels" ? "nav-active" : ""}`} onClick={() => setPage("levels")}>
            <span className="nav-icon">🎮</span> Peringkat
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div className="hero-section">
        <motion.div className="text-center px-3" style={{ zIndex: 2, maxWidth: 700 }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="pixel-card p-4 p-md-5 mx-auto" style={{ maxWidth: 680 }}>
            <motion.div className="hero-title mb-3" animate={{ textShadow: ["4px 4px 0 #000", "4px 4px 20px rgba(255,215,0,0.6)", "4px 4px 0 #000"] }} transition={{ duration: 3, repeat: Infinity }}>
              KATA NAMA KHAS
            </motion.div>
            <p className="hero-subtitle mb-4">Belajar Bersama Dunia Digital</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <motion.button className="btn-pixel btn-pixel-gold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage("lyrics")}>
                ▶ MULA PERMAINAN
              </motion.button>
              <motion.button className="btn-pixel" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage("levels")}>
                🎮 PILIH TAHAP
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rules */}
      <div className="pixel-bg py-5 px-3">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-header text-center">📜 PERATURAN PERMAINAN</h2>
          <div className="d-flex flex-column gap-3">
            {[
              { n: "1", title: "Kata Nama Khas", desc: "Nama khusus bagi manusia, haiwan, atau benda — sentiasa bermula dengan huruf besar." },
              { n: "2", title: "Huruf Besar", desc: "Setiap kata nama khas mesti bermula dengan huruf besar. Contoh: Jakarta, Milo, Proton." },
              { n: "3", title: "Kumpulkan Mata", desc: "Jawab dengan tepat untuk kumpulkan mata. Semakin tinggi skor, semakin hebat!" },
            ].map(r => (
              <motion.div key={r.n} className="rule-item d-flex align-items-start gap-3"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: +r.n * 0.1 }}>
                <div className="rule-num">{r.n}</div>
                <div>
                  <div className="rule-heading">{r.title}</div>
                  <div className="rule-text">{r.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEVEL PAGE ───────────────────────────────────────────────────────────────
function LevelsPage({ setPage }) {
  const levels = [
    { id: 1, emoji: "1️⃣", title: "Tahap 1: Pilih Kata Nama Khas", desc: "Pilih kata nama khas berdasarkan gambar yang diberikan.", color: "#00C853" },
    { id: 2, emoji: "2️⃣", title: "Tahap 2: Cari Huruf Besar",    desc: "Pilih kedudukan huruf besar yang betul pada kata nama khas.", color: "#1E88E5" },
    { id: 3, emoji: "3️⃣", title: "Tahap 3: Padankan Kata Nama",  desc: "Seret dan padankan kata kepada Kata Nama Khas atau Am.", color: "#8E24AA" },
  ];

  return (
    <div className="pixel-bg py-5 px-3" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <motion.h1 className="section-header text-center mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          🎮 PILIH PERINGKAT PERMAINAN
        </motion.h1>
        <div className="row g-4">
          {levels.map((lv, i) => (
            <div key={lv.id} className="col-12 col-md-4">
              <motion.div className="level-card p-4 h-100" onClick={() => setPage(`level${lv.id}`)}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }} whileTap={{ scale: 0.97 }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="level-badge" style={{ borderColor: lv.color, color: lv.color }}>{lv.emoji}</div>
                  <div>
                    <div className="level-title">{lv.title}</div>
                  </div>
                </div>
                <div className="level-desc">{lv.desc}</div>
                <div className="mt-3">
                  <button className="btn-pixel w-100" style={{ borderColor: lv.color, color: lv.color }}>
                    MULA ▶
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LEVEL 1 ─────────────────────────────────────────────────────────────────
function Level1({ setPage }) {
  const play = useSound();
  const [questions] = useState(() => shuffle(LEVEL1_DATA).slice(0, NUM_QUESTIONS));
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef();

  const current = questions[idx];

  useEffect(() => {
    setOptions(shuffle(current.options));
    setSelected(null); setBusy(false); setFeedback("");
  }, [current]);

  const handleSelect = useCallback(word => {
    if (busy) return;
    setBusy(true); setSelected(word);
    const ok = word === current.correctWord;
    setFeedback(ok ? "✅ Betul! Hebat!" : "❌ Cuba lagi!");
    play(ok ? "correct" : "wrong");
    timer.current = setTimeout(() => {
      if (ok) {
        const ns = score + 1;
        setScore(ns);
        if (idx + 1 === NUM_QUESTIONS) { play("cheer"); setDone(true); }
        else setIdx(i => i + 1);
      } else setBusy(false);
      setFeedback("");
    }, ok ? 900 : 700);
  }, [busy, current, idx, score, play]);

  const restart = () => { clearTimeout(timer.current); setPage("level1"); };

  return (
    <div className="pixel-bg py-4 px-2" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="pixel-card p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h2 className="section-header mb-0">⚔️ Tahap 1 – Pilih Kata Nama Khas</h2>
            <div className="score-badge">⭐ {score} / {NUM_QUESTIONS}</div>
          </div>

          <div className="instruction-box mb-3">Pilih kata nama khas yang tepat untuk gambar di bawah:</div>

          <div className="pixel-progress mb-4">
            <motion.div className="pixel-progress-fill" animate={{ width: `${(idx / NUM_QUESTIONS) * 100}%` }} />
          </div>

          <div className="row g-4 align-items-center justify-content-center">
            <div className="col-12 col-sm-5 text-center">
              <motion.img key={current.image} src={current.image} alt={current.correctWord} className="game-image"
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180 }} />
            </div>
            <div className="col-12 col-sm-7">
              <div className="row g-2">
                {options.map(opt => (
                  <div key={opt} className="col-12 col-sm-6">
                    <motion.button className={`option-btn ${selected === opt ? (opt === current.correctWord ? "correct-ans" : "wrong-ans") : ""}`}
                      onClick={() => handleSelect(opt)} disabled={busy}
                      whileHover={!busy ? { scale: 1.03 } : {}} whileTap={!busy ? { scale: 0.97 } : {}}>
                      {opt}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div className={`feedback-toast mt-3 ${feedback.startsWith("✅") ? "correct-fb" : "wrong-fb"}`}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}>
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {done && <GamePopup score={score} total={NUM_QUESTIONS} onRestart={restart} onHome={() => setPage("home")} onNext={() => setPage("level2")} nextLabel="Tahap 2 🚀" />}
    </div>
  );
}

// ─── LEVEL 2 ─────────────────────────────────────────────────────────────────
function Level2({ setPage }) {
  const play = useSound();
  const [data] = useState(() => shuffle(LEVEL2_DATA));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [highlighted, setHighlighted] = useState(null);
  const [correctParts, setCorrectParts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef();

  const current = data[idx];
  const parts = useMemo(() => current.word.split("\n").flatMap(w => w.split(" ")), [current.word]);
  const progress = (idx / NUM_QUESTIONS) * 100;

  useEffect(() => {
    setCorrectParts([]); setHighlighted(null); setFeedback(""); setBusy(false);
    return () => clearTimeout(timer.current);
  }, [idx]);

  const handleClick = useCallback((pIdx, cIdx) => {
    if (busy) return;
    setBusy(true);
    const correct = cIdx === 0 && !correctParts.includes(pIdx);
    setHighlighted({ pIdx, cIdx, ok: correct });
    setFeedback(correct ? "✅ Bagus!" : "❌ Cuba lagi!");
    play(correct ? "correct" : "wrong");

    timer.current = setTimeout(() => {
      if (correct) {
        const updated = [...correctParts, pIdx];
        setCorrectParts(updated);
        if (updated.length === parts.length) {
          const ns = score + 1;
          setScore(ns);
          if (idx + 1 === NUM_QUESTIONS) { play("cheer"); setDone(true); }
          else setIdx(i => i + 1);
        }
      }
      setBusy(false);
      setTimeout(() => setFeedback(""), 300);
    }, correct ? 1000 : 700);
  }, [busy, correctParts, parts.length, idx, score, play]);

  const restart = () => { clearTimeout(timer.current); setPage("level2"); };

  return (
    <div className="pixel-bg py-4 px-2" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="pixel-card p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h2 className="section-header mb-0">🔤 Tahap 2 – Cari Huruf Besar</h2>
            <div className="score-badge">⭐ {score} / {NUM_QUESTIONS}</div>
          </div>

          <div className="instruction-box mb-3">Klik huruf PERTAMA (huruf besar) bagi setiap perkataan kata nama khas:</div>

          <div className="pixel-progress mb-4">
            <motion.div className="pixel-progress-fill" animate={{ width: `${progress}%` }} />
          </div>

          <div className="row g-4 align-items-center justify-content-center">
            <div className="col-12 col-sm-5 text-center">
              <motion.img key={current.image} src={current.image} alt={current.word} className="game-image"
                initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150 }} />
            </div>
            <div className="col-12 col-sm-7">
              <div className="d-flex flex-column align-items-center gap-3">
                {parts.map((part, pIdx) => {
                  const done = correctParts.includes(pIdx);
                  return (
                    <div key={pIdx} className="d-flex gap-2 flex-wrap justify-content-center">
                      {[...part].map((ch, cIdx) => {
                        const isHl = highlighted?.pIdx === pIdx && highlighted?.cIdx === cIdx;
                        const cls = `letter-tile ${done || (isHl && highlighted.ok) ? "correct-tile" : ""} ${isHl && !highlighted?.ok ? "wrong-tile" : ""} ${done ? "done-tile" : ""}`;
                        return (
                          <motion.div key={`${pIdx}-${cIdx}`} className={cls}
                            onClick={() => !done && handleClick(pIdx, cIdx)}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.03 * (pIdx * 10 + cIdx) }}>
                            {ch}
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div className={`feedback-toast mt-3 ${feedback.startsWith("✅") ? "correct-fb" : "wrong-fb"}`}
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300 }}>
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {done && <GamePopup score={score} total={NUM_QUESTIONS} onRestart={restart} onHome={() => setPage("home")} onNext={() => setPage("level3")} nextLabel="Tahap 3 🚀" />}
    </div>
  );
}

// ─── LEVEL 3 ─────────────────────────────────────────────────────────────────
function Level3({ setPage }) {
  const play = useSound();
  const [data] = useState(() => shuffle(LEVEL3_DATA));
  const [dragged, setDragged] = useState(null);
  const [answers, setAnswers] = useState({ Khas: [], Am: [] });
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [flashBox, setFlashBox] = useState({ Khas: "", Am: "" });

  const handleDrop = useCallback(cat => {
    if (!dragged) return;
    const ok = dragged.type === cat;
    play(ok ? "correct" : "wrong");
    setFlashBox(p => ({ ...p, [cat]: ok ? "correct-flash" : "wrong-flash" }));
    setTimeout(() => setFlashBox(p => ({ ...p, [cat]: "" })), 600);
    if (ok) {
      setAnswers(a => ({ ...a, [cat]: [...a[cat], dragged] }));
      const ns = score + 1;
      setScore(ns);
      if (answers.Khas.length + answers.Am.length + 1 === data.length) {
        setTimeout(() => { play("cheer"); setDone(true); }, 400);
      }
    }
    setDragged(null);
  }, [dragged, score, answers, data.length, play]);

  const remaining = data.filter(w => !answers.Khas.some(a => a.word === w.word) && !answers.Am.some(a => a.word === w.word));
  const prog = (score / data.length) * 100;

  return (
    <div className="pixel-bg py-4 px-2" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="pixel-card p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h2 className="section-header mb-0">🧩 Tahap 3 – Padankan Kata Nama</h2>
            <div className="score-badge">⭐ {score} / {data.length}</div>
          </div>

          <div className="tip-box mb-3">
            <strong>📌 Peringatan:</strong> Seret perkataan ke kategori yang betul.<br />
            <span className="tip-highlight">Kata Nama Khas</span> – nama khusus (orang, tempat, jenama).<br />
            <span className="tip-highlight">Kata Nama Am</span> – nama umum kepada benda atau konsep.
          </div>

          <div className="pixel-progress mb-4">
            <motion.div className="pixel-progress-fill" animate={{ width: `${prog}%` }} />
          </div>

          <div className="row g-4">
            {/* Word bank */}
            <div className="col-12 col-md-4">
              <h5 className="section-header" style={{ fontSize: "0.55rem" }}>📦 Perkataan</h5>
              <div className="d-flex flex-wrap gap-2">
                <AnimatePresence>
                  {remaining.map(w => (
                    <motion.div key={w.word} className="word-drag-card"
                      draggable onDragStart={() => setDragged(w)}
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                      {w.word}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {remaining.length === 0 && <div style={{ fontFamily: "var(--pixel)", fontSize: "0.45rem", color: "var(--gold)" }}>✅ Semua selesai!</div>}
              </div>
            </div>

            {/* Drop zones */}
            <div className="col-12 col-md-8">
              <div className="row g-3">
                {["Khas", "Am"].map(cat => (
                  <div key={cat} className="col-12 col-sm-6">
                    <h5 className="section-header" style={{ fontSize: "0.5rem", borderBottomColor: cat === "Khas" ? "var(--sapphire)" : "var(--gold)" }}>
                      {cat === "Khas" ? "🏛️ Kata Nama KHAS" : "📚 Kata Nama AM"}
                    </h5>
                    <div className={`drop-zone drop-zone-${cat.toLowerCase()} ${flashBox[cat]}`}
                      onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(cat)}>
                      <div className="d-flex flex-wrap gap-2">
                        {answers[cat].map(w => (
                          <motion.span key={w.word} className="word-done-chip"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            ✓ {w.word}
                          </motion.span>
                        ))}
                        {answers[cat].length === 0 && (
                          <span style={{ fontFamily: "var(--pixel)", fontSize: "0.4rem", color: "rgba(255,255,255,0.3)" }}>
                            Lepaskan di sini...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {done && <GamePopup score={score} total={data.length} onRestart={() => setPage("level3")} onHome={() => setPage("home")} onNext={() => setPage("levels")} nextLabel="Halaman Peringkat 🏆" />}
    </div>
  );
}

// ─── LYRICS PAGE ─────────────────────────────────────────────────────────────
function LyricsPage({ setPage }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentLine, setCurrentLine] = useState(-1);
  const [currentStanza, setCurrentStanza] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [stanzaVisible, setStanzaVisible] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const iv = setInterval(() => {
      const t = audioRef.current?.currentTime || 0;
      for (let i = 0; i < LINE_TIMINGS.length; i++) {
        if (t >= LINE_TIMINGS[i] && (i === LINE_TIMINGS.length - 1 || t < LINE_TIMINGS[i + 1])) {
          if (i !== currentLine) {
            setCurrentLine(i);
            const si = getStanza(i);
            if (si !== currentStanza) {
              setStanzaVisible(false);
              setTimeout(() => { setCurrentStanza(si); setVisibleLines([0]); setStanzaVisible(true); }, 700);
            } else {
              setVisibleLines(p => [...p, p.length]);
            }
          }
          return;
        }
      }
      if (t > LINE_TIMINGS[LINE_TIMINGS.length - 1] && !ended) {
        setEnded(true);
        setTimeout(() => setPage("levels"), 3000);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [currentLine, currentStanza, ended, setPage]);

  const getStanza = li => {
    let c = 0;
    for (let i = 0; i < STANZAS.length; i++) { c += STANZAS[i].length; if (li < c) return i; }
    return STANZAS.length - 1;
  };

  const highlight = line => {
    const parts = [];
    let remaining = line;
    PROPER_NOUNS.forEach(noun => {
      const m = new RegExp(`\\b${noun}\\b`, "i").exec(remaining);
      if (m) {
        if (m.index > 0) parts.push(<span key={`b-${noun}`}>{remaining.slice(0, m.index)}</span>);
        parts.push(<motion.span key={noun} className="lyric-highlight" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{m[0]}</motion.span>);
        remaining = remaining.slice(m.index + m[0].length);
      }
    });
    if (remaining) parts.push(<span key="rest">{remaining}</span>);
    return parts;
  };

  return (
    <div className="pixel-bg py-4" style={{ minHeight: "100vh" }}>
      <audio ref={audioRef} src="/audio/lyrics.mp3" preload="auto" />
      <div className="container">
        <h2 className="section-header text-center mb-4">🎶 Papaku Pulang dari Jakarta 🎶</h2>
        <div className="lyric-container">
          {/* Corner decorations */}
          {["tl","tr","bl","br"].map(c => (
            <div key={c} style={{ position:"absolute", width:20, height:20, borderColor:"var(--gold-dark)", borderStyle:"solid",
              ...(c==="tl"?{top:10,left:10,borderWidth:"3px 0 0 3px"}:c==="tr"?{top:10,right:10,borderWidth:"3px 3px 0 0"}:c==="bl"?{bottom:10,left:10,borderWidth:"0 0 3px 3px"}:{bottom:10,right:10,borderWidth:"0 3px 3px 0"}) }} />
          ))}

          <AnimatePresence mode="wait">
            {stanzaVisible && (
              <motion.div key={currentStanza} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                {STANZAS[currentStanza].slice(0, visibleLines.length).map((line, i) => (
                  <motion.div key={i} className="lyric-line" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    {highlight(line)}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="d-flex gap-3 justify-content-center mt-4 flex-wrap">
            <motion.button className="btn-pixel" onClick={() => setIsPlaying(!isPlaying)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isPlaying ? "⏸ Berhenti" : "▶ Mainkan"}
            </motion.button>
            <motion.button className="btn-pixel btn-pixel-gold" onClick={() => setPage("levels")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Langkau Lagu 🎮
            </motion.button>
          </div>

          <div className="lyric-status twinkle">{currentLine < LINE_TIMINGS.length ? "Sedang bermain lagu... 🎤" : "Mengalih ke permainan... 🕹️"}</div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function KataNamaKhasGame() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    // Inject Bootstrap 5 if not present
    if (!document.getElementById("bs5-css")) {
      const link = document.createElement("link");
      link.id = "bs5-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      document.head.appendChild(link);
    }
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage setPage={setPage} />;
      case "lyrics":  return <LyricsPage setPage={setPage} />;
      case "levels":  return <LevelsPage setPage={setPage} />;
      case "level1":  return <Level1 setPage={setPage} />;
      case "level2":  return <Level2 setPage={setPage} />;
      case "level3":  return <Level3 setPage={setPage} />;
      default:        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <StyleProvider />
      <div className="pixel-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <GameNav page={page} setPage={setPage} />
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="game-footer">© 2025 Panitia Bahasa Melayu SK Bukit Sentosa</footer>
      </div>
    </>
  );
}