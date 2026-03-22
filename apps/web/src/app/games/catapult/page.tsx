'use client'

import { useState } from 'react'
import { Rocket, Play, RotateCcw, Heart, Trophy, Crosshair } from 'lucide-react'
import { Catapult } from '@/components/games/Catapult'

export default function CatapultPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [level, setLevel] = useState(1)
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
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black py-8 font-sans transition-colors duration-500 overflow-hidden text-slate-100 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.5)]">
              <Rocket className="w-8 h-8 text-rose-500" />
              Catapult
            </h1>
            <p className="text-blue-400 font-medium mt-1">
              Master the launch angle! Range ∝ sin(2θ)
            </p>
          </div>

          <div className="flex items-center gap-6 bg-blue-950/60 backdrop-blur-md border border-blue-800/50 py-3 px-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-xs text-blue-300/70 uppercase font-bold tracking-wider leading-none">
                  Level
                </span>
                <span className="text-xl font-bold text-blue-100 leading-none">{level}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-blue-800"></div>

            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-xs text-blue-300/70 uppercase font-bold tracking-wider leading-none">
                  Score
                </span>
                <span className="text-xl font-bold text-blue-100 leading-none">{score}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-blue-800"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300/70 uppercase font-bold tracking-wider leading-none mr-1">
                Health
              </span>
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${
                    i < health
                      ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : 'fill-transparent text-blue-900 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls Overlay & Wrapper */}
        <div className="relative mt-8">
          <Catapult
            difficultyLevel={level}
            isPlaying={isPlaying}
            onGameOver={handleGameOver}
            onScoreUpdate={setScore}
            onHealthUpdate={setHealth}
            onLevelComplete={handleLevelComplete}
          />

          {showLevelUp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)] animate-bounce duration-1000">
                TARGET DESTROYED
              </div>
            </div>
          )}

          {/* Start Screen Menu */}
          {!isPlaying && !gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-md mt-24 bg-blue-950/80 backdrop-blur-xl border border-blue-700/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <h2 className="text-2xl font-bold text-blue-100 mb-6 drop-shadow-md text-center">
                Ready to Launch
              </h2>
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-400 hover:to-orange-500 text-white py-4 rounded-xl font-extrabold text-xl shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all active:scale-95 border border-rose-400/50"
              >
                <Play fill="currentColor" strokeWidth={0} /> INITIATE LAUNCH SEQUENCE
              </button>
            </div>
          )}

          {/* Game Over Menu */}
          {gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-sm mt-24 bg-slate-900/95 backdrop-blur-xl border border-rose-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.3)] flex flex-col items-center z-50">
              <h2 className="text-3xl font-black text-rose-500 mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">
                OUT OF AMMO
              </h2>
              <p className="text-rose-200/60 mb-8 text-center font-medium">Mission Failed.</p>

              <div className="w-full bg-slate-950/80 rounded-2xl p-6 mb-8 flex flex-col items-center border border-slate-800 shadow-inner">
                <span className="text-blue-400 text-sm uppercase tracking-widest font-bold mb-2">
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
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all active:scale-95"
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
