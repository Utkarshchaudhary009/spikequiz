'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'

export const TRIG_VALUES = [
  { id: '1', label: '1', val: 1 },
  { id: 'v3', label: '√3/2', val: Math.sqrt(3) / 2 },
  { id: 'v2', label: '√2/2', val: Math.sqrt(2) / 2 },
  { id: 'v1', label: '1/2', val: 0.5 },
  { id: '0', label: '0', val: 0 },
  { id: '-v1', label: '-1/2', val: -0.5 },
  { id: '-v2', label: '-√2/2', val: -Math.sqrt(2) / 2 },
  { id: '-v3', label: '-√3/2', val: -Math.sqrt(3) / 2 },
  { id: '-1', label: '-1', val: -1 },
]

export const STANDARD_ANGLES = [
  { id: '0', label: '0', val: 0 },
  { id: 'p6', label: 'π/6', val: Math.PI / 6 },
  { id: 'p4', label: 'π/4', val: Math.PI / 4 },
  { id: 'p3', label: 'π/3', val: Math.PI / 3 },
  { id: 'p2', label: 'π/2', val: Math.PI / 2 },
  { id: '2p3', label: '2π/3', val: (2 * Math.PI) / 3 },
  { id: '3p4', label: '3π/4', val: (3 * Math.PI) / 4 },
  { id: '5p6', label: '5π/6', val: (5 * Math.PI) / 6 },
  { id: 'pi', label: 'π', val: Math.PI },
  { id: '7p6', label: '7π/6', val: (7 * Math.PI) / 6 },
  { id: '5p4', label: '5π/4', val: (5 * Math.PI) / 4 },
  { id: '4p3', label: '4π/3', val: (4 * Math.PI) / 3 },
  { id: '3p2', label: '3π/2', val: (3 * Math.PI) / 2 },
  { id: '5p3', label: '5π/3', val: (5 * Math.PI) / 3 },
  { id: '7p4', label: '7π/4', val: (7 * Math.PI) / 4 },
  { id: '11p6', label: '11π/6', val: (11 * Math.PI) / 6 },
]

interface NodeData {
  id: string
  label: string
  val: number
  localAngle: number
}

interface Connection {
  innerId: string
  outerId: string
}

interface Props {
  gameMode: 'sin' | 'cos'
  difficultyLevel: number // 1 to essentially infinite
  isPlaying: boolean
  onGameOver: (score: number) => void
  onScoreUpdate: (score: number) => void
  onHealthUpdate: (health: number) => void
  onLevelComplete: () => void
}

const CENTER = 300
const INNER_RADIUS = 100
const OUTER_RADIUS = 220

function generateLevelNodes(mode: 'sin' | 'cos', difficulty: number) {
  // Number of nodes increases with difficulty up to 8
  const N = Math.min(4 + Math.floor(difficulty / 2), 8)

  const shuffledAngles = [...STANDARD_ANGLES].sort(() => Math.random() - 0.5)
  const innerSelection = shuffledAngles.slice(0, N)

  const inner: NodeData[] = innerSelection.map((s, i) => ({
    id: `in_${s.id}_${i}`,
    label: s.label,
    val: s.val,
    localAngle: (i * 2 * Math.PI) / N,
  }))

  const targets = inner.map((n) => {
    const v = mode === 'sin' ? Math.sin(n.val) : Math.cos(n.val)
    let bestBtn = TRIG_VALUES[0]
    let minE = Infinity
    for (const b of TRIG_VALUES) {
      if (Math.abs(b.val - v) < minE) {
        minE = Math.abs(b.val - v)
        bestBtn = b
      }
    }
    return bestBtn
  })

  // get unique outer targets
  const uniqueOuter: typeof TRIG_VALUES = []
  const seen = new Set<string>()
  for (const t of targets) {
    if (!seen.has(t.id)) {
      seen.add(t.id)
      uniqueOuter.push(t)
    }
  }

  // add distractors if necessary
  let distractorAttempts = 0
  while (uniqueOuter.length < N && distractorAttempts < 50) {
    distractorAttempts++
    const pool = [...TRIG_VALUES].sort(() => Math.random() - 0.5)
    const t = pool[0]
    if (!seen.has(t.id)) {
      seen.add(t.id)
      uniqueOuter.push(t)
    } else if (uniqueOuter.length === TRIG_VALUES.length) {
      break
    }
  }

  const shuffledOuter = uniqueOuter.sort(() => Math.random() - 0.5)
  const outer: NodeData[] = shuffledOuter.map((s, i) => ({
    id: `out_${s.id}`,
    label: s.label,
    val: s.val,
    localAngle: (i * 2 * Math.PI) / shuffledOuter.length,
  }))

  return { inner, outer }
}

export function Astrolabe({
  gameMode,
  difficultyLevel,
  isPlaying,
  onGameOver,
  onScoreUpdate,
  onHealthUpdate,
  onLevelComplete,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<number | null>(null)

  // Level Definition State
  const [{ inner: innerNodes, outer: outerNodes }, setNodes] = useState<{ inner: NodeData[]; outer: NodeData[] }>(
    {
      inner: [],
      outer: [],
    },
  )

  // Gameplay State
  const [lockedConnections, setLockedConnections] = useState<Connection[]>([])
  const [dragLine, setDragLine] = useState<{ sourceId: string; px: number; py: number } | null>(
    null,
  )

  // High-performance rotation tracking
  const [tick, setTick] = useState(0)
  const rotationsRef = useRef({ inner: 0, outer: 0, lastTime: 0 })

  // Error effect
  const [errorFlash, setErrorFlash] = useState<string | null>(null) // innerNode ID

  const gameStateRef = useRef({
    health: 3,
    score: 0,
    lockedCount: 0,
    innerTotal: 0,
    isTransitioning: false,
  })

  // Initialize/Reset
  useEffect(() => {
    if (!isPlaying) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      return
    }

    // New game!
    gameStateRef.current.health = 3
    gameStateRef.current.score = 0
    onHealthUpdate(3)
    onScoreUpdate(0)

    startLevel(1)

    // Game loop
    rotationsRef.current.lastTime = performance.now()
    const loop = (time: number) => {
      const dt = (time - rotationsRef.current.lastTime) / 1000
      rotationsRef.current.lastTime = time

      // Speeds scale slightly with difficulty
      const diffScale = 1 + difficultyLevel * 0.15
      rotationsRef.current.inner += 0.4 * diffScale * dt // radians per second
      rotationsRef.current.outer -= 0.25 * diffScale * dt

      setTick(time) // Trigger render
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, gameMode])

  // Need an effect hook to handle difficultyLevel changes cleanly (starting a new level).
  // But difficultyLevel also drives the initial start...
  // So a better approach is a local internalLevel state, but parent tracks too.
  // The prop difficultyLevel comes from parent, but we might want to decouple.
  // Actually, we'll watch difficultyLevel to trigger generateLevel!

  const startLevel = (diff: number) => {
    const nodes = generateLevelNodes(gameMode, diff)
    setNodes(nodes)
    setLockedConnections([])
    gameStateRef.current.lockedCount = 0
    gameStateRef.current.innerTotal = nodes.inner.length
    gameStateRef.current.isTransitioning = false
  }

  // React to level progression from parent
  useEffect(() => {
    if (isPlaying && difficultyLevel > 1) {
      startLevel(difficultyLevel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyLevel])

  // Interaction Handlers
  const handlePointerDown = (nodeId: string, event: React.PointerEvent) => {
    if (!isPlaying || gameStateRef.current.isTransitioning) return

    // Prevent dragging an already locked node
    if (lockedConnections.some((c) => c.innerId === nodeId)) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return

    event.currentTarget.setPointerCapture(event.pointerId)
    setDragLine({
      sourceId: nodeId,
      px: event.clientX - rect.left,
      py: event.clientY - rect.top,
    })
  }

  // Global Pointer Events on SVG container
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragLine) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setDragLine((prev) =>
      prev ? { ...prev, px: e.clientX - rect.left, py: e.clientY - rect.top } : null,
    )
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragLine) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      setDragLine(null)
      return
    }

    const { outer: outerRot } = rotationsRef.current
    const upX = e.clientX - rect.left
    const upY = e.clientY - rect.top

    // Find if dropped near an outer node
    let hitNode: NodeData | null = null
    for (const outer of outerNodes) {
      const gAngle = outer.localAngle + outerRot
      const nx = CENTER + OUTER_RADIUS * Math.cos(gAngle)
      const ny = CENTER + OUTER_RADIUS * Math.sin(gAngle)
      if (Math.hypot(nx - upX, ny - upY) < 40) {
        // hit radius
        hitNode = outer
        break
      }
    }

    if (hitNode) {
      evaluateConnection(dragLine.sourceId, hitNode)
    }
    setDragLine(null)
  }

  const evaluateConnection = (sourceId: string, outerHost: NodeData) => {
    const innerNode = innerNodes.find((n) => n.id === sourceId)
    if (!innerNode) return

    const expectedRatio = gameMode === 'sin' ? Math.sin(innerNode.val) : Math.cos(innerNode.val)

    // Math.abs handles float precision perfectly for discrete values
    const isCorrect = Math.abs(expectedRatio - outerHost.val) < 0.05

    if (isCorrect) {
      // SUCCESS!
      const newLocked = [...lockedConnections, { innerId: sourceId, outerId: outerHost.id }]
      setLockedConnections(newLocked)

      gameStateRef.current.lockedCount += 1
      gameStateRef.current.score += 50
      onScoreUpdate(gameStateRef.current.score)

      // Level Complete Check
      if (gameStateRef.current.lockedCount >= gameStateRef.current.innerTotal) {
        gameStateRef.current.isTransitioning = true
        setTimeout(() => {
          onLevelComplete()
        }, 1200) // Delay for triumph animation
      }
    } else {
      // MISSED
      setErrorFlash(sourceId)
      setTimeout(() => setErrorFlash(null), 500)

      gameStateRef.current.health -= 1
      onHealthUpdate(gameStateRef.current.health)

      if (gameStateRef.current.health <= 0) {
        onGameOver(gameStateRef.current.score)
      }
    }
  }

  // --- RENDERING ---
  const { inner: innerRot, outer: outerRot } = rotationsRef.current

  // Map nodes to screen coordinates
  const drawnInnerNodes = innerNodes.map((n) => {
    const angle = n.localAngle + innerRot
    return {
      ...n,
      gx: CENTER + INNER_RADIUS * Math.cos(angle),
      gy: CENTER + INNER_RADIUS * Math.sin(angle),
      isLocked: lockedConnections.some((c) => c.innerId === n.id),
      hasError: errorFlash === n.id,
    }
  })

  const drawnOuterNodes = outerNodes.map((n) => {
    const angle = n.localAngle + outerRot
    return {
      ...n,
      gx: CENTER + OUTER_RADIUS * Math.cos(angle),
      gy: CENTER + OUTER_RADIUS * Math.sin(angle),
    }
  })

  // Determine drag line source coordinate
  let activeSrcX = CENTER,
    activeSrcY = CENTER
  if (dragLine) {
    const srcNode = drawnInnerNodes.find((n) => n.id === dragLine.sourceId)
    if (srcNode) {
      activeSrcX = srcNode.gx
      activeSrcY = srcNode.gy
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 600 600"
        className="w-full h-full rounded-2xl bg-indigo-950/40 backdrop-blur-md border border-indigo-900 shadow-[0_0_40px_rgba(30,27,75,0.8)] touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // cancel drag if leaving svg
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
          <filter id="neonGlowOuter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Decorative Rings */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS}
          className="stroke-indigo-800/40"
          fill="none"
          strokeWidth="2"
          strokeDasharray="10 10"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS}
          className="stroke-indigo-800/40"
          fill="none"
          strokeWidth="4"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={CENTER - 10}
          className="stroke-indigo-900/40"
          fill="none"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Render Locked Connections */}
        {lockedConnections.map((conn) => {
          const src = drawnInnerNodes.find((n) => n.id === conn.innerId)
          const tgt = drawnOuterNodes.find((n) => n.id === conn.outerId)
          if (!src || !tgt) return null
          return (
            <line
              key={`${conn.innerId}-${conn.outerId}`}
              x1={src.gx}
              y1={src.gy}
              x2={tgt.gx}
              y2={tgt.gy}
              className="stroke-emerald-400"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neonGlowOuter)"
            />
          )
        })}

        {/* Render Active Drag Line */}
        {dragLine && (
          <line
            x1={activeSrcX}
            y1={activeSrcY}
            x2={dragLine.px}
            y2={dragLine.py}
            className="stroke-sky-300 stroke-dashed"
            strokeWidth="3"
            strokeDasharray="6 6"
            style={{ pointerEvents: 'none' }} // crucial
            filter="url(#neonGlowOuter)"
          />
        )}

        {/* Outer Nodes (Values) */}
        {drawnOuterNodes.map((node) => (
          <g key={node.id} transform={`translate(${node.gx}, ${node.gy})`}>
            {/* Hit area ring */}
            <circle cx="0" cy="0" r="30" fill="transparent" className="cursor-pointer" />
            <circle
              cx="0"
              cy="0"
              r="22"
              className="fill-indigo-900 stroke-indigo-400"
              strokeWidth="2"
            />
            {/* The value text */}
            <text
              fill="#c7d2fe" // indigo-200
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ pointerEvents: 'none' }}
              className="font-mono tracking-tighter"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Inner Nodes (Angles) */}
        {drawnInnerNodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.gx}, ${node.gy})`}
            onPointerDown={(e) => handlePointerDown(node.id, e)}
            className="cursor-crosshair"
          >
            {node.hasError && (
              <circle
                cx="0"
                cy="0"
                r="30"
                className="fill-red-500/50 animate-ping"
                style={{ pointerEvents: 'none' }}
              />
            )}
            <circle
              cx="0"
              cy="0"
              r="26"
              className={`transition-colors duration-300 stroke-2 ${
                node.isLocked
                  ? 'fill-emerald-800 stroke-emerald-400'
                  : dragLine?.sourceId === node.id
                    ? 'fill-sky-800 stroke-sky-300 scale-110 shadow-[0_0_15px_#38bdf8] origin-center'
                    : 'fill-indigo-800 stroke-indigo-300 hover:fill-indigo-700'
              }`}
            />
            {/* Outer decorative ring for un-locked */}
            {!node.isLocked && (
              <circle
                cx="0"
                cy="0"
                r="32"
                className="stroke-indigo-400/40"
                fill="none"
                strokeDasharray="3 3"
              />
            )}
            <text
              fill="#e0e7ff" // indigo-100
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ pointerEvents: 'none' }}
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Center decorative element */}
        <circle cx={CENTER} cy={CENTER} r={20} fill="url(#starGlow)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={6}
          className="fill-indigo-100 shadow-[0_0_20px_#e0e7ff]"
          filter="url(#neonGlowOuter)"
        />
      </svg>
    </div>
  )
}
