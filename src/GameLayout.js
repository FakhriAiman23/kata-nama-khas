// src/components/GameLayout.js
import React from 'react';
import { motion } from 'framer-motion'; // For smooth animations
import './App.css'; // Import App.css for shared game-related styles

export function GameLayout({ title, children, score }) {
  return (
    <div className="game-layout"> 
      <motion.div
        className="game-card" 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="game-inner">
          <h2 className="game-title">{title}</h2>
          {children} 
          {typeof score === 'number' && (
            <div className="score-box"> 
              <h3 className="score-label">
                Skor Anda: <span className="score-number">{score}</span>
              </h3>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}