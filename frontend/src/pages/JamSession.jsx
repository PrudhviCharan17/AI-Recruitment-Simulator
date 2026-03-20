import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Mic, Square, Loader2, ChevronRight, AlertCircle, CheckCircle,
  RefreshCw, TrendingUp, Target, Star, AlertTriangle, Zap,
  MessageSquare, BarChart2, BookOpen, ThumbsUp, ThumbsDown,
  Clock, Radio, Lightbulb, ArrowLeft
} from 'lucide-react'

// ─── Topics ───────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Technical':   { color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.25)' },
  'Behavioral':  { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' },
  'Product':     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  'Soft Skills': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)' },
  'Custom':      { color: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)' },
}

const DURATION = 60 // seconds

// ─── Score Ring ───────────────────────────────────────────────────────
function ScoreRing({ score, size = 100, label }) {
  const [anim, setAnim] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const target = Number(score) || 0
    cancelAnimationFrame(rafRef.current)
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1200, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setAnim(Math.round(e * target))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (anim / 100) * circ
  const color = anim >= 80 ? '#10b981' : anim >= 60 ? '#0ea5e9' : anim >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.3s' }}/>
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: size > 90 ? 22 : 16, fontWeight: 800, color, fontFamily: "'Playfair Display',serif" }}>{anim}</div>
          <div style={{ fontSize: 9, color: '#94a3b8' }}>/100</div>
        </div>
      </div>
      {label && <div style={{ fontSize: 11, fontWeight: 600, color: '#8da4be', textAlign: 'center' }}>{label}</div>}
    </div>
  )
}

// ─── Setup Screen ─────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [topics, setTopics] = useState([])
  const [selected, setSelected] = useState(null)
  const [customTopic, setCustomTopic] = useState('')
  const [loadingTopics, setLoadingTopics] = useState(true)
  const f = "'DM Sans',sans-serif"

  useEffect(() => {
    axios.get('/api/jam/topics').then(r => {
      setTopics(r.data.topics)
      setLoadingTopics(false)
    }).catch(() => setLoadingTopics(false))
  }, [])

  const categories = [...new Set(topics.map(t => t.category))]
  const selectedTopic = topics.find(t => t.id === selected)
  const isCustom = selected === 'custom'
  const canStart = selected && (!isCustom || customTopic.trim().length > 2)

  const handleStart = () => {
    if (!canStart) return
    const topic = isCustom
      ? { id: 'custom', label: customTopic.trim(), category: 'Custom', prompt: `Speak about: ${customTopic.trim()}` }
      : selectedTopic
    onStart(topic)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: f }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp .4s ease both }
        .fu1 { animation: fadeUp .4s .07s ease both }
        .fu2 { animation: fadeUp .4s .14s ease both }
        .fu3 { animation: fadeUp .4s .21s ease both }
        .topic-btn { transition: all .18s ease; cursor: pointer; }
        .topic-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* Header */}
        <div className="fu" style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: 12 }}>
            <Radio size={12} color="#f97316"/>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Jam Session</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: '#0d1b2a', margin: '0 0 8px' }}>
            60-Second Jam
          </h1>
          <p style={{ fontSize: 14, color: '#4a6080', margin: 0, lineHeight: 1.6 }}>
            Pick a topic, hit record, and speak for 60 seconds. We'll transcribe your voice and give you a full breakdown of your communication skills.
          </p>
        </div>

        {/* How it works */}
        <div className="fu1" style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {[
              { icon: Target,      step: '1', label: 'Pick a Topic',     desc: 'Choose from categories or enter your own' },
              { icon: Mic,         step: '2', label: 'Record 60 Seconds', desc: 'Speak clearly — timer auto-stops at 1 min' },
              { icon: BarChart2,   step: '3', label: 'Get Your Report',   desc: 'Score, gaps, tips & ideal answer outline' },
            ].map(({ icon: Icon, step, label, desc }, i) => (
              <div key={i} style={{ flex: '1 1 180px', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 16px', borderRight: i < 2 ? '1px solid #f0f4f8' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#f97316"/>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0d1b2a', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 11, color: '#8da4be', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Selector */}
        <div className="fu2" style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>1</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Choose Your Topic</h2>
          </div>

          {loadingTopics ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Loader2 size={22} color="#f97316" style={{ animation: 'spin 1s linear infinite' }}/>
            </div>
          ) : (
            <>
              {categories.map(cat => {
                const catTopics = topics.filter(t => t.category === cat)
                const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Custom']
                return (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: cc.color, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>{cat}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {catTopics.map(topic => {
                        const isSelected = selected === topic.id
                        return (
                          <button key={topic.id} className="topic-btn"
                            onClick={() => setSelected(topic.id)}
                            style={{
                              padding: '8px 14px', borderRadius: 10,
                              border: `1.5px solid ${isSelected ? cc.color : '#dde5ee'}`,
                              background: isSelected ? cc.bg : '#fafbfc',
                              color: isSelected ? cc.color : '#4a6080',
                              fontWeight: isSelected ? 700 : 500, fontSize: 13,
                              fontFamily: f, cursor: 'pointer'
                            }}>
                            {topic.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Custom input */}
              {isCustom && (
                <div style={{ marginTop: 12 }}>
                  <input
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    placeholder="e.g. Microservices vs Monolith, My 5-year plan..."
                    autoFocus
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 11, border: '1.5px solid #f97316', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#0d1b2a', fontFamily: f, boxSizing: 'border-box' }}
                  />
                </div>
              )}

              {/* Selected topic preview */}
              {selectedTopic && !isCustom && (
                <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: `${CATEGORY_COLORS[selectedTopic.category]?.bg || 'rgba(249,115,22,0.08)'}`, border: `1px solid ${CATEGORY_COLORS[selectedTopic.category]?.border || 'rgba(249,115,22,0.2)'}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#8da4be', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>You'll be asked to speak about</p>
                  <p style={{ fontSize: 13, color: '#0d1b2a', margin: 0, lineHeight: 1.6 }}>{selectedTopic.prompt}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Start Button */}
        <div className="fu3">
          <button onClick={handleStart} disabled={!canStart}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: canStart ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#e2e8f0',
              color: canStart ? '#fff' : '#94a3b8', border: 'none',
              cursor: canStart ? 'pointer' : 'not-allowed',
              fontWeight: 700, fontSize: 15, fontFamily: f,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: canStart ? '0 6px 24px rgba(249,115,22,0.3)' : 'none',
              transition: 'all 0.2s'
            }}>
            <Mic size={18} fill={canStart ? 'white' : 'none'}/>
            Start Jam Session
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Recording Screen ─────────────────────────────────────────────────
function RecordingScreen({ topic, onDone }) {
  const [phase, setPhase] = useState('ready') // ready | countdown | recording | processing
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [error, setError] = useState(null)

  const mediaRecRef  = useRef(null)
  const audioChunks  = useRef([])
  const timerRef     = useRef(null)
  const ctdRef       = useRef(null)
  const f = "'DM Sans',sans-serif"
  const cc = CATEGORY_COLORS[topic.category] || CATEGORY_COLORS['Custom']

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current)
    clearInterval(ctdRef.current)
    if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop()
  }, [])

  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(3)
    let c = 3
    ctdRef.current = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c === 0) {
        clearInterval(ctdRef.current)
        beginRecording()
      }
    }, 1000)
  }

  const beginRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunks.current = []
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        handleDone()
      }
      mr.start()
      mediaRecRef.current = mr
      setPhase('recording')
      setTimeLeft(DURATION)

      let t = DURATION
      timerRef.current = setInterval(() => {
        t -= 1
        setTimeLeft(t)
        if (t <= 0) {
          clearInterval(timerRef.current)
          mr.stop()
        }
      }, 1000)
    } catch {
      setError('Microphone access denied. Please allow mic access and try again.')
      setPhase('ready')
    }
  }

  const stopEarly = () => {
    clearInterval(timerRef.current)
    if (mediaRecRef.current?.state === 'recording') mediaRecRef.current.stop()
  }

  const handleDone = async () => {
    setPhase('processing')
    try {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const fd = new FormData()
      fd.append('file', blob, 'jam.webm')
      const res = await axios.post('/api/jam/transcribe', fd)
      if (!res.data.success || !res.data.text) {
        setError('No speech detected. Please try again and speak clearly.')
        setPhase('ready')
        return
      }
      onDone(res.data.text)
    } catch (e) {
      setError(e.response?.data?.detail || 'Transcription failed. Please try again.')
      setPhase('ready')
    }
  }

  const progress = ((DURATION - timeLeft) / DURATION) * 100
  const circumference = 2 * Math.PI * 54
  const strokeOffset = circumference - (progress / 100) * circumference

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: f, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(249,115,22,0.4)} 70%{box-shadow:0 0 0 24px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .rec-pulse { animation: pulse-ring 1.4s ease infinite }
        .ripple-ring { animation: ripple 1.4s ease-out infinite }
        .fu { animation: fadeUp .4s ease both }
      `}</style>

      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Topic card */}
        <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: `1px solid ${cc.border}`, boxShadow: '0 2px 16px rgba(13,27,42,0.06)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ padding: '2px 10px', borderRadius: 20, background: cc.bg, border: `1px solid ${cc.border}`, fontSize: 10, fontWeight: 700, color: cc.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{topic.category}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: '#0d1b2a', margin: '0 0 6px' }}>{topic.label}</h2>
          <p style={{ fontSize: 13, color: '#4a6080', margin: 0, lineHeight: 1.6 }}>{topic.prompt || `Speak freely about: ${topic.label}`}</p>
        </div>

        {/* Main recording widget */}
        <div className="fu" style={{ background: '#fff', borderRadius: 24, padding: '40px 32px', border: '1px solid #dde5ee', boxShadow: '0 4px 32px rgba(13,27,42,0.08)', textAlign: 'center' }}>

          {/* Countdown */}
          {phase === 'countdown' && (
            <>
              <div style={{ fontSize: 80, fontWeight: 800, fontFamily: "'Playfair Display',serif", color: '#f97316', lineHeight: 1, marginBottom: 16 }}>{countdown}</div>
              <p style={{ fontSize: 15, color: '#4a6080', margin: 0 }}>Get ready to speak...</p>
            </>
          )}

          {/* Recording */}
          {phase === 'recording' && (
            <>
              {/* Timer ring */}
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {/* Ripple rings */}
                <div className="ripple-ring" style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '2px solid rgba(249,115,22,0.3)' }}/>
                <div className="ripple-ring" style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '2px solid rgba(249,115,22,0.3)', animationDelay: '0.5s' }}/>
                <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={60} cy={60} r={54} fill="none" stroke="#f0f4f8" strokeWidth="6"/>
                  <circle cx={60} cy={60} r={54} fill="none" stroke="#f97316" strokeWidth="6"
                    strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#f97316', fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{timeLeft}</div>
                  <div style={{ fontSize: 10, color: '#8da4be', marginTop: 2 }}>seconds</div>
                </div>
              </div>

              {/* Mic indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse-ring 1s ease infinite' }}/>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Recording in progress</span>
              </div>

              {/* Waveform bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 32, marginBottom: 24 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{
                    width: 4, borderRadius: 2, background: '#f97316', opacity: 0.7,
                    animation: `wave ${0.5 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
                    height: `${20 + Math.sin(i * 1.3) * 12}px`,
                    animationDelay: `${i * 0.08}s`
                  }}/>
                ))}
              </div>
              <style>{`@keyframes wave { from{transform:scaleY(0.4)} to{transform:scaleY(1)} }`}</style>

              <button onClick={stopEarly}
                style={{ padding: '12px 28px', borderRadius: 14, background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.25)', color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: f, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Square size={14} fill="#dc2626"/> Stop Early
              </button>
            </>
          )}

          {/* Ready state */}
          {phase === 'ready' && (
            <>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Mic size={34} color="#f97316"/>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#0d1b2a', margin: '0 0 8px' }}>Ready when you are</h3>
              <p style={{ fontSize: 13, color: '#8da4be', margin: '0 0 24px', lineHeight: 1.6 }}>
                You'll get a 3-second countdown, then speak for up to 60 seconds.<br/>Timer stops automatically at the end.
              </p>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 16, textAlign: 'left' }}>
                  <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }}/>
                  <p style={{ fontSize: 12, color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              )}

              <button onClick={startCountdown}
                style={{ width: '100%', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 24px rgba(249,115,22,0.3)' }}>
                <Mic size={18} fill="white"/> Start Recording
              </button>
            </>
          )}

          {/* Processing */}
          {phase === 'processing' && (
            <>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Loader2 size={28} color="#f97316" style={{ animation: 'spin 1s linear infinite' }}/>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#0d1b2a', margin: '0 0 8px' }}>Transcribing your voice...</h3>
              <p style={{ fontSize: 13, color: '#8da4be', margin: 0 }}>Whisper AI is processing your recording</p>
            </>
          )}
        </div>

        {/* Tips */}
        {phase === 'ready' && (
          <div className="fu" style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Speak at a natural pace', 'Stay on topic', 'Use examples when possible'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: '#fff', border: '1px solid #dde5ee', fontSize: 12, color: '#4a6080' }}>
                <Lightbulb size={11} color="#f97316"/>
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Evaluation Screen ────────────────────────────────────────────────
function EvaluationScreen({ topic, transcript, onRestart }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const f = "'DM Sans',sans-serif"
  const cc = CATEGORY_COLORS[topic.category] || CATEGORY_COLORS['Custom']

  useEffect(() => { fetchEval() }, [])

  const fetchEval = async () => {
    setLoading(true); setError(null)
    try {
      const res = await axios.post('/api/jam/evaluate', {
        topic_id: topic.id,
        topic_label: topic.label,
        topic_prompt: topic.prompt,
        transcript
      })
      setData(res.data.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Evaluation failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', textAlign: 'center', maxWidth: 380, width: '90%', boxShadow: '0 4px 40px rgba(13,27,42,0.1)' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Loader2 size={26} color="#f97316" style={{ animation: 'spin 1s linear infinite' }}/>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#0d1b2a', margin: '0 0 8px' }}>Generating Report</h2>
        <p style={{ fontSize: 13, color: '#8da4be', margin: 0 }}>Qwen3 32B is analyzing your response...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 360, boxShadow: '0 4px 24px rgba(13,27,42,0.08)' }}>
        <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 12px', display: 'block' }}/>
        <p style={{ fontWeight: 700, color: '#0d1b2a', margin: '0 0 8px', fontFamily: "'Playfair Display',serif", fontSize: 18 }}>Evaluation Failed</p>
        <p style={{ fontSize: 13, color: '#8da4be', margin: '0 0 20px' }}>{error}</p>
        <button onClick={fetchEval} style={{ padding: '10px 24px', borderRadius: 12, background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: f }}>Retry</button>
      </div>
    </div>
  )

  const verdictColor = { 'Excellent': '#10b981', 'Good': '#0ea5e9', 'Average': '#f59e0b', 'Needs Work': '#f97316', 'Poor': '#ef4444' }[data.verdict] || '#8da4be'
  const scoreItems = [
    { label: 'Relevance',  score: data.relevance_score,  feedback: data.relevance_feedback },
    { label: 'Clarity',    score: data.clarity_score,    feedback: data.clarity_feedback },
    { label: 'Depth',      score: data.depth_score,      feedback: data.depth_feedback },
    { label: 'Confidence', score: data.confidence_score, feedback: data.confidence_feedback },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: f }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .4s ease both}
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #dde5ee', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: '#0d1b2a', margin: 0 }}>Jam Report</h1>
          <p style={{ fontSize: 12, color: '#8da4be', margin: '3px 0 0' }}>{topic.label} · {topic.category}</p>
        </div>
        <button onClick={onRestart}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 12, background: '#f0f4f8', border: '1px solid #dde5ee', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#4a6080', fontFamily: f }}>
          <RefreshCw size={14}/> New Jam
        </button>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Overview */}
        <div className="fu" style={{ background: '#fff', borderRadius: 22, padding: '28px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ScoreRing score={data.overall_score} size={110}/>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: `${verdictColor}15`, border: `1px solid ${verdictColor}25`, color: verdictColor, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{data.verdict}</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#0d1b2a', margin: '0 0 8px' }}>{topic.label}</p>
            <p style={{ fontSize: 13, color: '#4a6080', lineHeight: 1.7, margin: 0 }}>{data.summary}</p>
          </div>
          {/* Mini scores */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {scoreItems.map(({ label, score }) => (
              <ScoreRing key={label} score={score} size={72} label={label}/>
            ))}
          </div>
        </div>

        {/* Score Breakdown bars */}
        <div className="fu" style={{ background: '#fff', borderRadius: 22, padding: '24px 28px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#8da4be', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 20px' }}>Score Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {scoreItems.map(({ label, score, feedback }) => {
              const s = Number(score) || 0
              const barColor = s >= 80 ? '#10b981' : s >= 60 ? '#0ea5e9' : s >= 40 ? '#f59e0b' : '#ef4444'
              return (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0d1b2a' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: barColor, fontFamily: 'monospace' }}>{s}/100</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 7, background: '#edf2f7', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', borderRadius: 7, background: `linear-gradient(90deg,${barColor},${barColor}aa)`, width: `${s}%`, transition: 'width 1.2s ease' }}/>
                  </div>
                  {feedback && <p style={{ fontSize: 12, color: '#4a6080', margin: 0, lineHeight: 1.5 }}>{feedback}</p>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
          {data.strengths?.length > 0 && (
            <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ThumbsUp size={16} color="#10b981"/>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Strengths</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <CheckCircle size={11} color="#10b981"/>
                    </div>
                    <p style={{ fontSize: 13, color: '#0d1b2a', margin: 0, lineHeight: 1.5 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.gaps?.length > 0 && (
            <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <AlertTriangle size={16} color="#f59e0b"/>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Gaps</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.gaps.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <AlertTriangle size={11} color="#f59e0b"/>
                    </div>
                    <p style={{ fontSize: 13, color: '#0d1b2a', margin: 0, lineHeight: 1.5 }}>{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ideal Answer Outline */}
        {data.ideal_answer_outline?.length > 0 && (
          <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={15} color={cc.color}/>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Ideal Answer Outline</h3>
            </div>
            <p style={{ fontSize: 12, color: '#8da4be', margin: '0 0 14px' }}>Key points a strong answer on this topic should cover:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.ideal_answer_outline.map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: cc.bg, border: `1px solid ${cc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 800, color: cc.color }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: '#0d1b2a', margin: 0, lineHeight: 1.6 }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Tips */}
        {data.improvement_tips?.length > 0 && (
          <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={15} color={cc.color}/>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Improvement Tips</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.improvement_tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: `${cc.bg}`, border: `1px solid ${cc.border}` }}>
                  <Lightbulb size={14} color={cc.color} style={{ flexShrink: 0, marginTop: 1 }}/>
                  <p style={{ fontSize: 13, color: '#0d1b2a', margin: 0, lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="fu" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1px solid #dde5ee', boxShadow: '0 2px 16px rgba(13,27,42,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <MessageSquare size={15} color="#8da4be"/>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: '#0d1b2a', margin: 0 }}>Your Transcript</h3>
          </div>
          <p style={{ fontSize: 13, color: '#4a6080', lineHeight: 1.8, margin: 0, fontStyle: 'italic', borderLeft: '3px solid #dde5ee', paddingLeft: 14 }}>"{transcript}"</p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <button onClick={onRestart}
            style={{ padding: '14px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: f, boxShadow: '0 6px 24px rgba(249,115,22,0.3)' }}>
            Jam Again
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function JamSession() {
  const [screen, setScreen] = useState('setup') // setup | recording | evaluation
  const [topic, setTopic] = useState(null)
  const [transcript, setTranscript] = useState('')

  const handleStart = (t) => { setTopic(t); setScreen('recording') }
  const handleDone  = (text) => { setTranscript(text); setScreen('evaluation') }
  const handleRestart = () => { setScreen('setup'); setTopic(null); setTranscript('') }

  if (screen === 'setup')      return <SetupScreen onStart={handleStart}/>
  if (screen === 'recording')  return <RecordingScreen topic={topic} onDone={handleDone}/>
  if (screen === 'evaluation') return <EvaluationScreen topic={topic} transcript={transcript} onRestart={handleRestart}/>
}
