'use client'

import { useState } from 'react'
import { Orbit, Play, RotateCcw, Heart, Trophy, Crosshair } from 'lucide-react'
import { Astrolabe } from '@/components/games/Astrolabe'

export default function AstrolabePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [level, setLevel] = useState(1)
  const [mode, setMode] = useState<'sin' | 'cos'>('sin')
  const [highScore, setHighScore] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setHealth(3)
    setLevel(1)
  }

  const handleLevelComplete = () => {
    setShowLevelUp(true)
    setTimeout(() => {
      setLevel((l) => l + 1)
      setShowLevelUp(false)
    }, 1500)
  }

  const handleGameOver = (finalScore: number) => {
    setIsPlaying(false)
    setGameOver(true)
    if (finalScore > highScore) {
      setHighScore(finalScore)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black py-8 font-sans transition-colors duration-500 overflow-hidden text-slate-100 relative">
      {/* Starry background effect (static dots using CSS) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-indigo-200 drop-shadow-[0_0_15px_rgba(199,210,254,0.5)]">
              <Orbit className="w-8 h-8 text-sky-400" />
              Astrolabe Lock
            </h1>
            <p className="text-indigo-400 font-medium mt-1">
              Trace constellations to match angles and ratios!
            </p>
          </div>

          <div className="flex items-center gap-6 bg-indigo-950/60 backdrop-blur-md border border-indigo-800/50 py-3 px-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-xs text-indigo-300/70 uppercase font-bold tracking-wider leading-none">
                  Level
                </span>
                <span className="text-xl font-bold text-indigo-100 leading-none">{level}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-indigo-800"></div>

            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-xs text-indigo-300/70 uppercase font-bold tracking-wider leading-none">
                  Score
                </span>
                <span className="text-xl font-bold text-indigo-100 leading-none">{score}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-indigo-800"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-300/70 uppercase font-bold tracking-wider leading-none mr-1">
                Tether
              </span>
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${
                    i < health
                      ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : 'fill-transparent text-indigo-900 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls Overlay & Wrapper */}
        <div className="relative mt-8">
          <Astrolabe
            gameMode={mode}
            difficultyLevel={level}
            isPlaying={isPlaying}
            onGameOver={handleGameOver}
            onScoreUpdate={setScore}
            onHealthUpdate={setHealth}
            onLevelComplete={handleLevelComplete}
          />

          {showLevelUp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-sky-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.8)] animate-bounce duration-1000">
                CONSTELLATION LOCKED
              </div>
            </div>
          )}

          {/* Start Screen Menu */}
          {!isPlaying && !gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-md mt-24 bg-indigo-950/80 backdrop-blur-xl border border-indigo-700/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <h2 className="text-2xl font-bold text-indigo-100 mb-6 drop-shadow-md">
                Engage Targeting Mode
              </h2>
              <div className="flex gap-4 mb-8 w-full">
                <button
                  onClick={() => setMode('sin')}
                  className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all border-2 ${
                    mode === 'sin'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'bg-indigo-900/40 border-indigo-800 text-indigo-400 hover:bg-indigo-800/60'
                  }`}
                >
                  Sine (sin)
                </button>
                <button
                  onClick={() => setMode('cos')}
                  className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all border-2 ${
                    mode === 'cos'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-indigo-900/40 border-indigo-800 text-indigo-400 hover:bg-indigo-800/60'
                  }`}
                >
                  Cosine (cos)
                </button>
              </div>
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white py-4 rounded-xl font-extrabold text-xl shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all active:scale-95 border border-indigo-400/50"
              >
                <Play fill="currentColor" strokeWidth={0} /> INITIATE LINK
              </button>
            </div>
          )}

          {/* Game Over Menu */}
          {gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-sm mt-24 bg-slate-900/95 backdrop-blur-xl border border-rose-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.3)] flex flex-col items-center z-50">
              <h2 className="text-3xl font-black text-rose-500 mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">
                CONNECTION LOST
              </h2>
              <p className="text-rose-200/60 mb-8 text-center font-medium">
                Tether integrity compromised.
              </p>

              <div className="w-full bg-slate-950/80 rounded-2xl p-6 mb-8 flex flex-col items-center border border-slate-800 shadow-inner">
                <span className="text-indigo-400 text-sm uppercase tracking-widest font-bold mb-2">
                  Final Score
                </span>
                <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {score}
                </span>
              </div>

              {score >= highScore && score > 0 && (
                <div className="text-amber-400 text-sm font-bold flex items-center gap-2 mb-6 animate-pulse">
                  <Trophy className="w-5 h-5" /> New Record Established!
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all active:scale-95"
              >
                <RotateCcw strokeWidth={3} className="w-5 h-5" /> RE-ENGAGE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
