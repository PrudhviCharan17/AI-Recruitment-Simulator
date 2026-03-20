import { useState, useRef, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import {
  Code, Users, Briefcase, Upload, FileText, X, Loader2,
  Send, Mic, MicOff, ChevronRight, AlertCircle, CheckCircle,
  TrendingUp, Award, Target, Star, AlertTriangle, ArrowLeft,
  Clock, MessageSquare, BarChart2, Zap, ThumbsUp, ThumbsDown,
  Info, RefreshCw, User, Bot, Volume2, VolumeX, Radio,
  Play, Square, Keyboard
} from 'lucide-react'

// ─── Round Definitions ────────────────────────────────────────────────
const ROUNDS = [
  {
    key: 'TR', label: 'Technical Round', interviewer: 'Alex',
    icon: Code, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.25)',
    desc: 'DSA, system design & domain knowledge',
    what: ['Coding concepts', 'System design', 'Trade-offs', 'Architecture'],
    tip: 'Think out loud — explain your reasoning as you go'
  },
  {
    key: 'HR', label: 'HR Round', interviewer: 'Priya',
    icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    desc: 'Behavioral, culture fit & career goals',
    what: ['STAR method answers', 'Career goals', 'Team scenarios', 'Values'],
    tip: 'Use specific examples with real outcomes — avoid generic answers'
  },
  {
    key: 'MR', label: 'Management Round', interviewer: 'Rajan',
    icon: Briefcase, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    desc: 'Leadership, strategy & team management',
    what: ['Leadership scenarios', 'Conflict resolution', 'Strategy', 'Metrics'],
    tip: 'Show ownership mindset — speak as a decision-maker not a follower'
  },
]

const ROLES = [
  'Full Stack Developer','Data Scientist','Product Manager','DevOps Engineer',
  'ML Engineer','Backend Developer','Frontend Developer','Data Analyst',
  'Cloud Architect','QA Engineer','Android Developer','iOS Developer'
]

// ─── Score Ring ───────────────────────────────────────────────────────
function ScoreRing({ score, size = 110 }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#0ea5e9' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1.2s ease' }}/>
      </svg>
      <div style={{ position:'absolute', textAlign:'center' }}>
        <div style={{ fontSize:22, fontWeight:800, color, fontFamily:"'Playfair Display',serif" }}>{score}</div>
        <div style={{ fontSize:9, color:'#94a3b8' }}>/100</div>
      </div>
    </div>
  )
}

// ─── Setup Screen ─────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [round, setRound] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const selectedRole = role === '__custom' ? customRole.trim() : role
  const selectedRound = ROUNDS.find(r => r.key === round)
  const canStart = selectedRole && round

  const onDrop = useCallback(f => f[0] && setFile(f[0]), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf':['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':['.docx'], 'text/plain':['.txt'] },
    maxFiles: 1
  })

  const handleStart = async () => {
    if (!canStart) return
    setLoading(true); setError(null)
    try {
      let resumeText = ''
      if (file) {
        const fd = new FormData(); fd.append('file', file)
        const res = await axios.post('/api/interview/parse-resume', fd)
        resumeText = res.data.resume_text
      }
      onStart({ role: selectedRole, round, resumeText, hasResume: !!file })
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to parse resume. Try again.')
    } finally { setLoading(false) }
  }

  const f = "'DM Sans',sans-serif"
  const px = { fontFamily: f }

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:f }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp .45s ease both }
        .fu1 { animation: fadeUp .45s .08s ease both }
        .fu2 { animation: fadeUp .45s .16s ease both }
        .fu3 { animation: fadeUp .45s .24s ease both }
        .role-btn { transition: all .18s ease; cursor:pointer; }
        .role-btn:hover { border-color: #0ea5e9 !important; color: #0ea5e9 !important; background: rgba(14,165,233,0.05) !important }
        .round-card { transition: all .22s ease; cursor:pointer; }
        .round-card:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ maxWidth: 760, margin:'0 auto', padding:'40px 24px 60px' }}>

        {/* Header */}
        <div className="fu" style={{ marginBottom: 32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:20, background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', marginBottom:12 }}>
            <Zap size={12} color="#0ea5e9"/>
            <span style={{ fontSize:11, fontWeight:700, color:'#0ea5e9', letterSpacing:'0.1em', textTransform:'uppercase' }}>AI Interview Simulator</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#0d1b2a', margin:'0 0 8px' }}>
            Set Up Your Interview
          </h1>
          <p style={{ fontSize:14, color:'#4a6080', margin:0, lineHeight:1.6 }}>
            Configure your session — resume upload is optional. The AI adapts to whatever you provide.
          </p>
        </div>

        {/* Step 1 — Role */}
        <div className="fu1" style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#0ea5e9', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>1</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#0d1b2a', margin:0 }}>Select Job Role</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:8, marginBottom: role === '__custom' ? 12 : 0 }}>
            {ROLES.map(r => (
              <button key={r} className="role-btn" onClick={() => setRole(r)} style={{
                padding:'9px 12px', borderRadius:10, border:`1.5px solid ${role===r ? '#0ea5e9' : '#dde5ee'}`,
                background: role===r ? 'rgba(14,165,233,0.07)' : '#fff',
                color: role===r ? '#0ea5e9' : '#4a6080',
                fontWeight: role===r ? 700 : 500, fontSize:13, textAlign:'left', ...px
              }}>
                {r}
              </button>
            ))}
            <button className="role-btn" onClick={() => setRole('__custom')} style={{
              padding:'9px 12px', borderRadius:10, border:`1.5px solid ${role==='__custom' ? '#0ea5e9' : '#dde5ee'}`,
              background: role==='__custom' ? 'rgba(14,165,233,0.07)' : '#fff',
              color: role==='__custom' ? '#0ea5e9' : '#4a6080',
              fontWeight: role==='__custom' ? 700 : 500, fontSize:13, textAlign:'left', ...px
            }}>
              + Custom Role
            </button>
          </div>
          {role === '__custom' && (
            <input value={customRole} onChange={e => setCustomRole(e.target.value)}
              placeholder="e.g. Blockchain Developer, UX Designer..."
              style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid #0ea5e9', fontSize:13, outline:'none', background:'#f8fafc', color:'#0d1b2a', marginTop:8, ...px }}/>
          )}
        </div>

        {/* Step 2 — Round */}
        <div className="fu2" style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#0ea5e9', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>2</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#0d1b2a', margin:0 }}>Select Interview Round</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            {ROUNDS.map(({ key, label, interviewer, icon:Icon, color, bg, border:bd, desc, what, tip }) => (
              <div key={key} className="round-card" onClick={() => setRound(key)} style={{
                padding:18, borderRadius:16, border:`2px solid ${round===key ? color : '#dde5ee'}`,
                background: round===key ? bg : '#fafbfc',
                boxShadow: round===key ? `0 4px 20px ${bg}` : 'none'
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={19} color={color}/>
                  </div>
                  {round === key && <CheckCircle size={16} color={color}/>}
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'#0d1b2a', margin:'0 0 4px' }}>{label}</p>
                <p style={{ fontSize:11, color:'#8da4be', margin:'0 0 10px', ...px }}>{desc}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
                  {what.map(w => (
                    <span key={w} style={{ padding:'2px 8px', borderRadius:6, background:`${color}12`, fontSize:10, fontWeight:600, color, ...px }}>{w}</span>
                  ))}
                </div>
                <div style={{ padding:'8px 10px', borderRadius:10, background: round===key ? `${color}10` : '#f0f4f8', borderLeft:`3px solid ${color}` }}>
                  <p style={{ fontSize:11, color:'#4a6080', margin:0, lineHeight:1.5, ...px }}>💡 {tip}</p>
                </div>
                <p style={{ fontSize:11, color:'#8da4be', margin:'10px 0 0', ...px }}>
                  Interviewer: <strong style={{ color }}>{interviewer}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 — Resume (Optional) */}
        <div className="fu3" style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'#0ea5e9', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>3</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#0d1b2a', margin:0 }}>Upload Resume</h2>
            </div>
            <span style={{ padding:'3px 10px', borderRadius:20, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:10, fontWeight:700, color:'#10b981', ...px }}>OPTIONAL</span>
          </div>
          <p style={{ fontSize:12, color:'#8da4be', margin:'0 0 14px 38px', ...px }}>
            With resume → AI asks about YOUR specific projects & experience. Without → standard role-based interview.
          </p>

          {file ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderRadius:14, border:'1.5px solid rgba(16,185,129,0.3)', background:'rgba(16,185,129,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'rgba(16,185,129,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FileText size={17} color="#10b981"/>
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#065f46', margin:0, ...px }}>{file.name}</p>
                  <p style={{ fontSize:11, color:'#10b981', margin:'2px 0 0', ...px }}>{(file.size/1024).toFixed(1)} KB · Ready</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} style={{ width:30, height:30, borderRadius:8, border:'none', background:'rgba(16,185,129,0.12)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <X size={13} color="#10b981"/>
              </button>
            </div>
          ) : (
            <div {...getRootProps()} style={{
              border:`2px dashed ${isDragActive ? '#0ea5e9' : '#dde5ee'}`,
              borderRadius:14, padding:'28px 20px', textAlign:'center', cursor:'pointer',
              background: isDragActive ? 'rgba(14,165,233,0.04)' : '#fafbfc',
              transition:'all 0.2s'
            }}>
              <input {...getInputProps()}/>
              <Upload size={22} color="#8da4be" style={{ margin:'0 auto 10px', display:'block' }}/>
              <p style={{ fontSize:13, fontWeight:600, color:'#4a6080', margin:'0 0 4px', ...px }}>
                {isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
              </p>
              <p style={{ fontSize:11, color:'#8da4be', margin:0, ...px }}>PDF, DOCX, TXT supported</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:12, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', marginBottom:16 }}>
            <AlertCircle size={15} color="#ef4444"/>
            <p style={{ fontSize:13, color:'#dc2626', margin:0, ...px }}>{error}</p>
          </div>
        )}

        {/* Start Button */}
        <button onClick={handleStart} disabled={!canStart || loading} style={{
          width:'100%', padding:'16px', borderRadius:16,
          background: canStart ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : '#e2e8f0',
          color: canStart ? '#fff' : '#94a3b8', border:'none', cursor: canStart ? 'pointer' : 'not-allowed',
          fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          boxShadow: canStart ? '0 6px 24px rgba(14,165,233,0.3)' : 'none',
          transition:'all 0.2s', ...px
        }}>
          {loading ? <><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }}/>Parsing Resume...</> : <><Play size={18} fill="white"/>Start Interview with {selectedRound?.interviewer || '...'}</>}
        </button>
        {!file && canStart && (
          <p style={{ textAlign:'center', fontSize:12, color:'#8da4be', margin:'10px 0 0', ...px }}>
            ℹ️ No resume uploaded — {selectedRound?.interviewer} will conduct a standard {selectedRound?.label}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Chat Screen ──────────────────────────────────────────────────────
function ChatScreen({ config, onEnd }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [voiceMode, setVoiceMode] = useState(false)
  const [recording, setRecording] = useState(false)
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [recTime, setRecTime] = useState(0)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [spokenLang, setSpokenLang] = useState('en')

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const recTimerRef = useRef(null)
  const mediaRecRef = useRef(null)
  const audioChunksRef = useRef([])
  const hasStartedRef = useRef(false)
  const roundInfo = ROUNDS.find(r => r.key === config.round)
  const f = "'DM Sans',sans-serif"

  useEffect(() => {
  window.speechSynthesis.getVoices()
}, [])

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e+1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])

  // Space key shortcut for voice
  useEffect(() => {
    const fn = (e) => {
      if (!voiceMode) return
      if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        recording ? stopRecording() : startRecording()
      }
      if (e.code === 'Escape' && recording) cancelRecording()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [voiceMode, recording])

  // Start interview — guard prevents double-fire in React StrictMode
  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    callAI([])
  }, [])

  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  const callAI = async (msgs) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/interview/start', {
        messages: msgs,
        role: config.role,
        round_type: config.round,
        resume_text: config.resumeText || '',
        has_resume: config.hasResume
      })
      const aiMsg = { role:'assistant', content: res.data.message }
      setMessages(prev => [...prev, aiMsg])
      if (voiceMode && !muted) await speakText(res.data.message)
    } catch (e) {
      setMessages(prev => [...prev, { role:'assistant', content:'⚠️ Connection error. Please check your API key and try again.' }])
    } finally { setLoading(false) }
  }

  const sendMessage = async (text) => {
    const t = (text || input).trim()
    if (!t || loading) return
    setInput('')
    const userMsg = { role:'user', content: t }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    await callAI(newMsgs)
  }

  const speakText = (text) => {
  if (muted || !("speechSynthesis" in window)) return

  stopAudio()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "en-US"
  utterance.rate = 1
  utterance.pitch = 1

  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.name.toLowerCase().includes("google") ||
    v.name.toLowerCase().includes("natural")
  )
  if (preferred) utterance.voice = preferred

  utterance.onstart = () => setAiSpeaking(true)
  utterance.onend = () => setAiSpeaking(false)
  utterance.onerror = () => setAiSpeaking(false)

  window.speechSynthesis.speak(utterance)
}

  const stopAudio = () => {
  window.speechSynthesis.cancel()
  setAiSpeaking(false)
}

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        if (audioChunksRef.current.length === 0) return
        const blob = new Blob(audioChunksRef.current, { type:'audio/webm' })
        await transcribeAndSend(blob)
      }
      mr.start()
      mediaRecRef.current = mr
      setRecording(true)
      setRecTime(0)
      recTimerRef.current = setInterval(() => setRecTime(t => t+1), 1000)
    } catch { alert('Microphone access denied. Please allow mic access.') }
  }

  const stopRecording = () => {
    if (mediaRecRef.current && recording) {
      mediaRecRef.current.stop()
      setRecording(false)
      clearInterval(recTimerRef.current)
    }
  }

  const cancelRecording = () => {
    if (mediaRecRef.current && recording) {
      audioChunksRef.current = []
      mediaRecRef.current.stop()
      setRecording(false)
      clearInterval(recTimerRef.current)
    }
  }

  const transcribeAndSend = async (blob) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', blob, 'audio.webm')
      fd.append('language', spokenLang)
      const res = await axios.post('/api/interview/transcribe', fd)
      if (res.data.text) await sendMessage(res.data.text)
    } catch { setLoading(false) }
  }

  const accentColor = roundInfo?.color || '#0ea5e9'

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#f0f4f8', fontFamily:f }}>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 70%{box-shadow:0 0 0 16px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        @keyframes wave { 0%,100%{height:8px} 50%{height:20px} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .rec-ring { animation: ripple 1.2s ease infinite }
        .wave-bar { animation: wave .6s ease-in-out infinite }
      `}</style>

      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #dde5ee', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, boxShadow:'0 2px 12px rgba(13,27,42,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`${accentColor}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {roundInfo && <roundInfo.icon size={18} color={accentColor}/>}
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'#0d1b2a', margin:0, fontFamily:"'Playfair Display',serif" }}>
              {config.role} · {roundInfo?.label}
            </p>
            <p style={{ fontSize:11, color:'#8da4be', margin:0 }}>Interviewer: <strong style={{ color:accentColor }}>{roundInfo?.interviewer}</strong> · {config.hasResume ? '📄 Resume loaded' : '📋 Role-based'}</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Timer */}
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:10, background:'#f0f4f8', border:'1px solid #dde5ee' }}>
            <Clock size={13} color="#8da4be"/>
            <span style={{ fontSize:13, fontWeight:700, color:'#4a6080', fontFamily:'monospace' }}>{formatTime(elapsed)}</span>
          </div>

          {/* Voice toggle */}
          <button onClick={() => { setVoiceMode(v => !v); if (recording) cancelRecording(); stopAudio() }}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:`1.5px solid ${voiceMode ? accentColor : '#dde5ee'}`, background: voiceMode ? `${accentColor}10` : '#fff', cursor:'pointer', transition:'all 0.2s' }}>
            {voiceMode ? <Volume2 size={14} color={accentColor}/> : <VolumeX size={14} color="#8da4be"/>}
            <span style={{ fontSize:12, fontWeight:600, color: voiceMode ? accentColor : '#8da4be' }}>{voiceMode ? 'Voice ON' : 'Voice OFF'}</span>
          </button>

          {/* Mute */}
          {voiceMode && (
            <button onClick={() => { setMuted(m => !m); if (!muted) stopAudio() }}
              style={{ width:34, height:34, borderRadius:10, border:`1px solid ${muted ? '#dde5ee' : accentColor}`, background: muted ? '#f0f4f8' : `${accentColor}10`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {muted ? <VolumeX size={14} color="#8da4be"/> : <Volume2 size={14} color={accentColor}/>}
            </button>
          )}

          {/* End */}
          <button onClick={() => onEnd(messages, elapsed)} disabled={messages.length < 2}
            style={{ padding:'8px 16px', borderRadius:10, background: messages.length>=2 ? '#ef4444' : '#e2e8f0', color: messages.length>=2 ? '#fff' : '#94a3b8', border:'none', cursor: messages.length>=2 ? 'pointer' : 'not-allowed', fontWeight:600, fontSize:12, transition:'all 0.2s' }}>
            End & Evaluate
          </button>
        </div>
      </div>

      {/* AI Speaking indicator */}
      {aiSpeaking && (
        <div style={{ background:`${accentColor}0d`, borderBottom:`1px solid ${accentColor}20`, padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', gap:3, alignItems:'flex-end' }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} className="wave-bar" style={{ width:3, borderRadius:2, background:accentColor, animationDelay:`${i*0.1}s` }}/>
              ))}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:accentColor }}>{roundInfo?.interviewer} is speaking...</span>
          </div>
          <button onClick={stopAudio} style={{ padding:'3px 10px', borderRadius:6, background:`${accentColor}15`, border:`1px solid ${accentColor}30`, fontSize:11, fontWeight:600, color:accentColor, cursor:'pointer' }}>
            <Square size={10} style={{ display:'inline', marginRight:4 }}/>Stop
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', gap:10, flexDirection: msg.role==='user' ? 'row-reverse' : 'row', animation:'fadeUp 0.3s ease both' }}>
            <div style={{ width:36, height:36, borderRadius:12, background: msg.role==='assistant' ? `${accentColor}18` : '#0d1b2a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {msg.role==='assistant'
                ? <Bot size={16} color={accentColor}/>
                : <User size={16} color="#fff"/>}
            </div>
            <div style={{ maxWidth:'72%' }}>
              {msg.role === 'assistant' && (
                <p style={{ fontSize:11, fontWeight:600, color:accentColor, margin:'0 0 5px', marginLeft:2 }}>{roundInfo?.interviewer}</p>
              )}
              <div style={{
                padding:'13px 16px', borderRadius: msg.role==='assistant' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                background: msg.role==='assistant' ? '#fff' : `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                color: msg.role==='assistant' ? '#0d1b2a' : '#fff',
                fontSize:14, lineHeight:1.65,
                boxShadow: msg.role==='assistant' ? '0 2px 12px rgba(13,27,42,0.07)' : `0 4px 16px ${accentColor}30`,
                border: msg.role==='assistant' ? '1px solid #dde5ee' : 'none'
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:`${accentColor}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Bot size={16} color={accentColor}/>
            </div>
            <div style={{ padding:'14px 18px', borderRadius:'4px 18px 18px 18px', background:'#fff', border:'1px solid #dde5ee', boxShadow:'0 2px 12px rgba(13,27,42,0.07)' }}>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} className="wave-bar" style={{ width:4, borderRadius:2, background:'#8da4be', animationDelay:`${i*0.15}s` }}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input Area */}
      <div style={{ background:'#fff', borderTop:'1px solid #dde5ee', padding:'16px 20px', flexShrink:0 }}>
        {voiceMode ? (
          // Voice input
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              {/* Mic button */}
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={loading}
                className={recording ? 'rec-ring' : ''}
                style={{
                  width:60, height:60, borderRadius:'50%', border:'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: recording ? '#ef4444' : `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: recording ? '0 0 0 0 rgba(239,68,68,0.4)' : `0 6px 20px ${accentColor}40`,
                  transition:'all 0.2s', opacity: loading ? 0.5 : 1
                }}>
                {recording ? <Square size={22} color="#fff" fill="white"/> : <Mic size={22} color="#fff"/>}
              </button>

              <div style={{ textAlign:'left' }}>
                {recording ? (
                  <>
                    <p style={{ fontSize:14, fontWeight:700, color:'#ef4444', margin:0 }}>🔴 Recording... {recTime}s</p>
                    <p style={{ fontSize:11, color:'#8da4be', margin:'3px 0 0' }}>Click or press <kbd style={{ padding:'1px 5px', borderRadius:4, border:'1px solid #dde5ee', fontSize:10, fontFamily:'monospace' }}>Space</kbd> to stop · <kbd style={{ padding:'1px 5px', borderRadius:4, border:'1px solid #dde5ee', fontSize:10, fontFamily:'monospace' }}>Esc</kbd> to cancel</p>
                  </>
                ) : loading ? (
                  <p style={{ fontSize:13, fontWeight:600, color:accentColor, margin:0 }}>⏳ Transcribing your answer...</p>
                ) : (
                  <>
                    <p style={{ fontSize:13, fontWeight:600, color:'#4a6080', margin:0 }}>Click mic or press <kbd style={{ padding:'1px 6px', borderRadius:4, border:'1px solid #dde5ee', fontSize:11, fontFamily:'monospace', background:'#f0f4f8' }}>Space</kbd> to speak</p>
                    <p style={{ fontSize:11, color:'#8da4be', margin:'3px 0 0' }}>Speak in {spokenLang === 'te' ? 'Telugu' : spokenLang === 'hi' ? 'Hindi' : 'English'} · transcribed to English automatically</p>
                  </>
                )}
              </div>
            </div>

            {/* Language selector + Switch to text */}
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:11, color:'#8da4be', fontWeight:600 }}>Speak in:</span>
              {[['en','🇬🇧 English'],['hi','🇮🇳 Hindi'],['te','🏳️ Telugu']].map(([code, label]) => (
                <button key={code} onClick={() => setSpokenLang(code)}
                  style={{ padding:'4px 11px', borderRadius:8, border:`1.5px solid ${spokenLang===code ? accentColor : '#dde5ee'}`, background: spokenLang===code ? `${accentColor}12` : '#f0f4f8', cursor:'pointer', fontSize:11, fontWeight:700, color: spokenLang===code ? accentColor : '#4a6080', transition:'all 0.15s' }}>
                  {label}
                </button>
              ))}
              <div style={{ width:1, height:18, background:'#dde5ee', margin:'0 2px' }}/>
              <button onClick={() => setVoiceMode(false)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:8, border:'1px solid #dde5ee', background:'#f0f4f8', cursor:'pointer', fontSize:11, fontWeight:600, color:'#4a6080' }}>
                <Keyboard size={12}/>Text Mode
              </button>
            </div>
          </div>
        ) : (
          // Text input
          <div>
            <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
                placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                disabled={loading}
                rows={2}
                style={{ flex:1, padding:'12px 16px', borderRadius:14, border:'1.5px solid #dde5ee', fontSize:13, outline:'none', resize:'none', background:'#f8fafc', color:'#0d1b2a', fontFamily:f, lineHeight:1.6, transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='#0ea5e9'}
                onBlur={e => e.target.style.borderColor='#dde5ee'}
              />
              <div style={{ display:'flex', gap:8 }}>
                {voiceMode === false && (
                  <button onClick={() => { setVoiceMode(true) }} style={{ width:44, height:44, borderRadius:12, border:`1.5px solid ${accentColor}`, background:`${accentColor}10`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Mic size={17} color={accentColor}/>
                  </button>
                )}
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  style={{ width:44, height:44, borderRadius:12, border:'none', background: input.trim() && !loading ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : '#e2e8f0', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                  {loading ? <Loader2 size={16} color="#94a3b8" style={{ animation:'spin 1s linear infinite' }}/> : <Send size={16} color={input.trim() ? '#fff' : '#94a3b8'}/>}
                </button>
              </div>
            </div>
            <p style={{ fontSize:11, color:'#8da4be', margin:'8px 0 0', textAlign:'center' }}>Enter to send · Shift+Enter for new line · Click 🎤 for voice mode</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Evaluation Screen ────────────────────────────────────────────────
function EvaluationScreen({ config, messages, elapsedTime, onRestart }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const roundInfo = ROUNDS.find(r => r.key === config.round)
  const f = "'DM Sans',sans-serif"
  const accent = roundInfo?.color || '#0ea5e9'

  useEffect(() => { fetchEval() }, [])

  const fetchEval = async () => {
    try {
      const res = await axios.post('/api/interview/evaluate', { messages, role:config.role, round_type:config.round })
      setData(res.data.data)
    } catch (e) { setError(e.response?.data?.detail || 'Evaluation failed') }
    finally { setLoading(false) }
  }

  const fmt = s => `${Math.floor(s/60)}m ${s%60}s`

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:f }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'48px 40px', textAlign:'center', maxWidth:380, width:'90%', boxShadow:'0 4px 40px rgba(13,27,42,0.1)' }}>
        <div style={{ width:60, height:60, borderRadius:18, background:`${accent}12`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <Loader2 size={26} color={accent} style={{ animation:'spin 1s linear infinite' }}/>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#0d1b2a', margin:'0 0 8px' }}>Generating Report</h2>
        <p style={{ fontSize:13, color:'#8da4be', margin:0 }}>Qwen3 32B is analyzing your full interview...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:f }}>
      <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', maxWidth:360 }}>
        <AlertCircle size={30} color="#ef4444" style={{ margin:'0 auto 12px', display:'block' }}/>
        <p style={{ fontWeight:700, color:'#0d1b2a', margin:'0 0 8px', fontFamily:"'Playfair Display',serif" }}>Evaluation Failed</p>
        <p style={{ fontSize:13, color:'#8da4be', margin:'0 0 16px' }}>{error}</p>
        <button onClick={fetchEval} style={{ padding:'10px 24px', borderRadius:12, background:accent, color:'#fff', border:'none', cursor:'pointer', fontWeight:600, fontSize:13 }}>
          Retry
        </button>
      </div>
    </div>
  )

  const verdictStyle = { 'Excellent':'#10b981','Good':'#0ea5e9','Average':'#f59e0b','Below Average':'#f97316','Poor':'#ef4444' }
  const vColor = verdictStyle[data.verdict] || '#8da4be'

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:f }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #dde5ee', padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:'#0d1b2a', margin:0 }}>Interview Report</h1>
          <p style={{ fontSize:12, color:'#8da4be', margin:'4px 0 0' }}>{config.role} · {roundInfo?.label} · {fmt(elapsedTime)} · {messages.filter(m=>m.role==='user').length} answers</p>
        </div>
        <button onClick={onRestart} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, background:'#f0f4f8', border:'1px solid #dde5ee', cursor:'pointer', fontWeight:600, fontSize:13, color:'#4a6080' }}>
          <RefreshCw size={14}/>New Interview
        </button>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'28px 24px 60px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Overview */}
        <div style={{ background:'#fff', borderRadius:22, padding:'28px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)', display:'flex', gap:24, flexWrap:'wrap', alignItems:'flex-start' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <ScoreRing score={data.overall_score}/>
            <span style={{ padding:'5px 14px', borderRadius:20, background:`${vColor}15`, color:vColor, fontSize:12, fontWeight:700, border:`1px solid ${vColor}25` }}>{data.verdict}</span>
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <p style={{ fontSize:10, fontWeight:700, color:'#8da4be', letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 8px' }}>Selection Probability</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:'#0d1b2a', margin:'0 0 8px' }}>{data.selection_chance}</p>
            <p style={{ fontSize:13, color:'#4a6080', lineHeight:1.65, margin:0 }}>{data.selection_reasoning}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {[['Answers',messages.filter(m=>m.role==='user').length],['Duration',fmt(elapsedTime)]].map(([l,v])=>(
              <div key={l} style={{ textAlign:'center', padding:'14px 18px', borderRadius:14, background:'#f0f4f8', minWidth:80 }}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:'#0d1b2a', margin:0 }}>{v}</p>
                <p style={{ fontSize:11, color:'#8da4be', margin:'4px 0 0' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score bars */}
        {data.round_scores && (
          <div style={{ background:'#fff', borderRadius:22, padding:'24px 28px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#8da4be', letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 18px' }}>Performance Breakdown</p>
            {Object.entries(data.round_scores).map(([key, val]) => {
              const sc = val.score
              const barColor = sc>=80?'#10b981':sc>=60?'#0ea5e9':sc>=40?'#f59e0b':'#ef4444'
              return (
                <div key={key} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#0d1b2a' }}>{key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:barColor, fontFamily:'monospace' }}>{sc}/100</span>
                  </div>
                  <div style={{ height:7, borderRadius:7, background:'#edf2f7', overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:7, background:`linear-gradient(90deg,${barColor},${barColor}aa)`, width:`${sc}%`, transition:'width 1.2s ease' }}/>
                  </div>
                  {val.feedback && <p style={{ fontSize:11, color:'#4a6080', margin:'5px 0 0', paddingLeft:4 }}>{val.feedback}</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
          {data.strengths?.length > 0 && (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <ThumbsUp size={16} color="#10b981"/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Strengths</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {data.strengths.map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(16,185,129,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <CheckCircle size={11} color="#10b981"/>
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0d1b2a', margin:0 }}>{s.point}</p>
                      <p style={{ fontSize:12, color:'#4a6080', margin:'3px 0 0' }}>{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.weaknesses?.length > 0 && (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <ThumbsDown size={16} color="#ef4444"/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Areas to Improve</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {data.weaknesses.map((w,i) => (
                  <div key={i} style={{ display:'flex', gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <AlertTriangle size={11} color="#ef4444"/>
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0d1b2a', margin:0 }}>{w.point}</p>
                      <p style={{ fontSize:12, color:'#4a6080', margin:'3px 0 0' }}>{w.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answer Analysis */}
        {data.answer_analysis?.length > 0 && (
          <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <MessageSquare size={15} color={accent}/>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Answer Analysis</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {data.answer_analysis.map((a,i) => {
                const qc = {'Excellent':'#10b981','Good':'#0ea5e9','Average':'#f59e0b','Poor':'#ef4444'}[a.quality]||'#8da4be'
                return (
                  <div key={i} style={{ padding:'14px 16px', borderRadius:14, background:`${qc}07`, border:`1px solid ${qc}22` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:6 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0d1b2a', margin:0 }}>Q{i+1}: {a.question}</p>
                      <span style={{ padding:'2px 9px', borderRadius:12, background:`${qc}18`, color:qc, fontSize:10, fontWeight:700, flexShrink:0 }}>{a.quality}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#4a6080', margin:0, lineHeight:1.6 }}>{a.feedback}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Improvement Plan */}
        {data.improvement_plan?.length > 0 && (
          <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <TrendingUp size={15} color={accent}/>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Improvement Plan</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {data.improvement_plan.map((item,i) => {
                const pc = {'high':'#ef4444','medium':'#f59e0b','low':'#10b981'}[item.priority]||'#8da4be'
                return (
                  <div key={i} style={{ padding:'14px 16px', borderRadius:14, background:`${pc}06`, border:`1px solid ${pc}20` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ padding:'2px 9px', borderRadius:12, background:`${pc}18`, color:pc, fontSize:10, fontWeight:700, textTransform:'uppercase' }}>{item.priority}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:'#0d1b2a' }}>{item.area}</span>
                    </div>
                    <p style={{ fontSize:13, color:'#4a6080', margin:'0 0 4px' }}>{item.suggestion}</p>
                    {item.resources && <p style={{ fontSize:11, color:'#8da4be', margin:0 }}>📚 {item.resources}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Key Moments + Next Steps */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
          {data.key_moments?.length > 0 && (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <Star size={15} color="#f59e0b"/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Key Moments</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {data.key_moments.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, fontSize:13, color:'#4a6080' }}>
                    <span>{m.type==='positive'?'✅':'⚠️'}</span>
                    <span>{m.moment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.next_steps?.length > 0 && (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', border:'1px solid #dde5ee', boxShadow:'0 2px 16px rgba(13,27,42,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <Target size={15} color={accent}/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0d1b2a', margin:0 }}>Next Steps</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {data.next_steps.map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:8, fontSize:13, color:'#4a6080' }}>
                    <span style={{ color:accent, fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interviewer Notes */}
        {data.interviewer_notes && (
          <div style={{ background:`linear-gradient(135deg,${accent},${accent}cc)`, borderRadius:20, padding:'24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Bot size={15} color="rgba(255,255,255,0.7)"/>
              <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', margin:0, textTransform:'uppercase', letterSpacing:'0.1em' }}>{roundInfo?.interviewer}'s Notes</p>
            </div>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.92)', lineHeight:1.7, margin:0, fontStyle:'italic' }}>"{data.interviewer_notes}"</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign:'center', paddingTop:8 }}>
          <button onClick={onRestart} style={{ padding:'14px 32px', borderRadius:14, background:`linear-gradient(135deg,${accent},${accent}cc)`, color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:14, boxShadow:`0 6px 24px ${accent}35` }}>
            Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function InterviewSim() {
  const [screen, setScreen] = useState('setup')
  const [config, setConfig] = useState(null)
  const [messages, setMessages] = useState([])
  const [elapsed, setElapsed] = useState(0)

  const handleStart = (cfg) => { setConfig(cfg); setScreen('chat') }
  const handleEnd = (msgs, time) => { setMessages(msgs); setElapsed(time); setScreen('evaluation') }
  const handleRestart = () => { setScreen('setup'); setConfig(null); setMessages([]); setElapsed(0) }

  if (screen==='setup') return <SetupScreen onStart={handleStart}/>
  if (screen==='chat') return <ChatScreen config={config} onEnd={handleEnd}/>
  if (screen==='evaluation') return <EvaluationScreen config={config} messages={messages} elapsedTime={elapsed} onRestart={handleRestart}/>
}
