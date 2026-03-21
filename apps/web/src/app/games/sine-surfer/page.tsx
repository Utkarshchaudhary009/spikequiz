'use client'

import { useState } from 'react'
import { Activity, Play, RotateCcw, Heart, Trophy } from 'lucide-react'
import { SineSurfer } from '@/components/games/SineSurfer'

export default function SineSurferPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [mode, setMode] = useState<'sin' | 'cos'>('sin')
  const [highScore, setHighScore] = useState(0)

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setHealth(3)
  }

  const handleGameOver = (finalScore: number) => {
    setIsPlaying(false)
    setGameOver(true)
    if (finalScore > highScore) {
      setHighScore(finalScore)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-800 dark:text-slate-100">
              <Activity className="w-8 h-8 text-blue-500" />
              Sine Wave Surfer
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
              Ride the waves and input the exact trig values!
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3 px-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider leading-none">
                  Score
                </span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                  {score}
                </span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider leading-none mr-1">
                Health
              </span>
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${
                    i < health
                      ? 'fill-red-500 text-red-500 scale-100'
                      : 'fill-transparent text-slate-300 dark:text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls Overlay & Wrapper */}
        <div className="relative">
          <SineSurfer
            gameMode={mode}
            isPlaying={isPlaying}
            onGameOver={handleGameOver}
            onScoreUpdate={setScore}
            onHealthUpdate={setHealth}
          />

          {/* Start Screen Menu */}
          {!isPlaying && !gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-sm mt-12 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center">
              <h2 className="text-xl font-bold text-white mb-6">Select Wave Mode</h2>
              <div className="flex gap-4 mb-8 w-full">
                <button
                  onClick={() => setMode('sin')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                    mode === 'sin'
                      ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Sine (sin)
                </button>
                <button
                  onClick={() => setMode('cos')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                    mode === 'cos'
                      ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Cosine (cos)
                </button>
              </div>
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgb(16,185,129,39%)] transition-all active:scale-95"
              >
                <Play fill="currentColor" /> Let's Surf!
              </button>
            </div>
          )}

          {/* Game Over Menu */}
          {gameOver && (
            <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-sm mt-12 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
              <h2 className="text-3xl font-black text-white mb-2 tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">
                Wipeout!
              </h2>
              <p className="text-slate-400 mb-6 text-center">You missed too many targets.</p>

              <div className="w-full bg-slate-800 rounded-xl p-4 mb-6 flex flex-col items-center border border-slate-700">
                <span className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-1">
                  Final Score
                </span>
                <span className="text-5xl font-black text-white">{score}</span>
              </div>

              {score >= highScore && score > 0 && (
                <div className="text-amber-400 text-sm font-bold flex items-center gap-2 mb-6 animate-pulse">
                  <Trophy className="w-4 h-4" /> New High Score!
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgb(59,130,246,39%)] transition-all active:scale-95"
              >
                <RotateCcw strokeWidth={3} className="w-5 h-5" /> Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
