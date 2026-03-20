import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Users, MessageSquare, Clock, ChevronRight, Loader2,
  AlertCircle, CheckCircle, TrendingUp, Award, Target,
  ThumbsUp, ThumbsDown, Star, RefreshCw, Info,
  SkipForward, Send, Mic, BarChart2, User, Bot,
  Zap, AlertTriangle, ArrowRight
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────
const PARTICIPANTS = {
  Arjun: { avatar: 'A', color: '#3b82f6', bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', role: 'Analytical Thinker' },
  Priya: { avatar: 'P', color: '#10b981', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', role: "Devil's Advocate" },
  Rohan: { avatar: 'R', color: '#f59e0b', bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', role: 'Practical Thinker' },
}

const USER_COLOR = { bg: 'bg-accent', light: 'bg-red-50', border: 'border-red-200', text: 'text-accent' }
const AI_ORDER = ['Arjun', 'Priya', 'Rohan']

// ─── Score Ring ────────────────────────────────────────────────────────
function ScoreRing({ score, size = 110 }) {
  const radius = (size - 12) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}/>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-display font-bold" style={{ color }}>{score}</span>
        <span className="text-gray-400" style={{ fontSize: '9px' }}>/100</span>
      </div>
    </div>
  )
}

// ─── Score Bar ─────────────────────────────────────────────────────────
function ScoreBar({ label, score, feedback }) {
  const [open, setOpen] = useState(false)
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }}/>
        </div>
        <span className="text-xs font-bold text-gray-600 w-8 text-right">{score}</span>
        <Info size={11} className="text-gray-300 shrink-0"/>
      </div>
      {open && feedback && (
        <p className="text-xs text-gray-500 mt-1 ml-32 pl-3 border-l-2 border-surface-300">{feedback}</p>
      )}
    </div>
  )
}

// ─── Avatar ────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md', pulse = false }) {
  const p = PARTICIPANTS[name]
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`relative rounded-full flex items-center justify-center font-bold text-white shrink-0 ${p?.bg || 'bg-accent'} ${sizes[size]}`}>
      {name === 'You' ? <User size={size === 'lg' ? 18 : 14}/> : (p?.avatar || name[0])}
      {pulse && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"/>}
    </div>
  )
}

// ─── Setup Screen ──────────────────────────────────────────────────────
function SetupScreen({ onStart, topicsData }) {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(topicsData)[0])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [userName, setUserName] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const finalTopic = useCustom ? customTopic : selectedTopic
  const canStart = finalTopic.trim() && userName.trim()

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <span className="section-label">Feature 03</span>
        <h1 className="text-3xl font-display font-bold text-primary-500 mt-1">GD Simulator</h1>
        <p className="text-gray-500 mt-1">Practice group discussions with 3 AI participants</p>
      </div>

      {/* Participants Preview */}
      <div className="card mb-5 bg-primary-500 text-white">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Your Discussion Group</p>
        <div className="flex items-center gap-4">
          {Object.entries(PARTICIPANTS).map(([name, p]) => (
            <div key={name} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${p.bg}`}>
                {p.avatar}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{name}</p>
                <p className="text-white/40 text-xs">{p.role}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/20">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <User size={16} className="text-white"/>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">You</p>
              <p className="text-white/40 text-xs">Candidate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Name */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
          <h2 className="font-display font-semibold text-primary-500">Your Name</h2>
        </div>
        <input value={userName} onChange={e => setUserName(e.target.value)}
          placeholder="Enter your name (e.g. Vivek)"
          className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:outline-none focus:border-accent bg-surface-50"/>
      </div>

      {/* Topic Selection */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
          <h2 className="font-display font-semibold text-primary-500">Select GD Topic</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(topicsData).map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setUseCustom(false); setSelectedTopic('') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${selectedCategory === cat && !useCustom ? 'bg-primary-500 text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'}`}>
              {cat}
            </button>
          ))}
          <button onClick={() => setUseCustom(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${useCustom ? 'bg-accent text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'}`}>
            + Custom Topic
          </button>
        </div>

        {useCustom ? (
          <textarea value={customTopic} onChange={e => setCustomTopic(e.target.value)}
            placeholder="Type your GD topic..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:outline-none focus:border-accent bg-surface-50 resize-none"/>
        ) : (
          <div className="space-y-2">
            {topicsData[selectedCategory]?.map(topic => (
              <button key={topic} onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                  ${selectedTopic === topic ? 'border-accent bg-red-50 text-accent font-semibold' : 'border-surface-200 hover:border-accent hover:bg-surface-50 text-gray-700'}`}>
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {(finalTopic || userName) && (
        <div className="card mb-4 bg-surface-50">
          <p className="section-label mb-2">GD Setup</p>
          <div className="flex flex-wrap gap-2">
            {userName && <span className="badge bg-primary-500 text-white">Candidate: {userName}</span>}
            {finalTopic && <span className="badge bg-accent text-white truncate max-w-xs">{finalTopic}</span>}
            <span className="badge bg-surface-200 text-gray-600">3 AI Participants</span>
          </div>
        </div>
      )}

      <button onClick={() => onStart({ topic: finalTopic, userName })} disabled={!canStart}
        className="btn-primary w-full flex items-center justify-center gap-2">
        <Zap size={18}/>Start Group Discussion <ChevronRight size={16}/>
      </button>
    </div>
  )
}

// ─── GD Chat Screen ────────────────────────────────────────────────────
function GDScreen({ config, onEnd }) {
  const [transcript, setTranscript] = useState([]) // {speaker, content, is_pass, type}
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('opening') // opening | user_turn | ai_turn | ended
  const [loading, setLoading] = useState(false)
  const [currentAI, setCurrentAI] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [turnCount, setTurnCount] = useState(0)
  const [typing, setTyping] = useState(null) // which AI is typing
  const bottomRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript, typing])

  // Start with moderator opening
  useEffect(() => { openDiscussion() }, [])

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const addToTranscript = (entry) => {
    setTranscript(prev => [...prev, entry])
  }

  const openDiscussion = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/api/gd/moderate/open', { topic: config.topic })
      addToTranscript({ speaker: 'Moderator', content: res.data.message, type: 'moderator' })
      setPhase('user_turn')
    } catch (e) {
      addToTranscript({ speaker: 'Moderator', content: `Welcome everyone. Today's topic is: "${config.topic}". Please begin your discussion.`, type: 'moderator' })
      setPhase('user_turn')
    } finally {
      setLoading(false)
    }
  }

  const handleUserSpeak = async () => {
    if (!input.trim() || loading) return
    const userEntry = { speaker: config.userName, content: input.trim(), type: 'user' }
    addToTranscript(userEntry)
    setInput('')
    setTurnCount(t => t + 1)
    await triggerAITurn([...transcript, userEntry])
  }

  const handlePass = async () => {
    const passEntry = { speaker: config.userName, content: '[ passed this turn ]', type: 'pass', is_pass: true }
    addToTranscript(passEntry)
    setTurnCount(t => t + 1)
    await triggerAITurn([...transcript, passEntry])
  }

  const triggerAITurn = async (currentTranscript) => {
    setPhase('ai_turn')
    // 1 to 2 AI participants speak per round
    const speakCount = Math.random() > 0.4 ? 2 : 1
    let updatedTranscript = [...currentTranscript]

    for (let i = 0; i < speakCount; i++) {
      const aiName = AI_ORDER[(currentAI + i) % 3]
      setTyping(aiName)
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

      try {
        const lastUserMsg = updatedTranscript.filter(m => m.speaker === config.userName && !m.is_pass).slice(-1)[0]
        const instruction = lastUserMsg
          ? `The candidate "${config.userName}" just said: "${lastUserMsg.content}". Respond to or build on that, or make your own point on the topic.`
          : `Continue the group discussion on the topic. Make a relevant point or respond to what was said.`

        const res = await axios.post('/api/gd/participant/speak', {
          name: aiName,
          topic: config.topic,
          transcript: updatedTranscript.map(m => ({ speaker: m.speaker, content: m.content })),
          instruction
        })

        const aiEntry = { speaker: aiName, content: res.data.message, type: 'ai' }
        addToTranscript(aiEntry)
        updatedTranscript = [...updatedTranscript, aiEntry]
      } catch (e) {
        console.error('AI speak error:', e)
      }
      setTyping(null)
      if (i < speakCount - 1) await new Promise(r => setTimeout(r, 600))
    }

    setCurrentAI(prev => (prev + speakCount) % 3)
    setPhase('user_turn')
  }

  const handleEnd = () => {
    clearInterval(timerRef.current)
    onEnd(transcript, elapsedTime)
  }

  const userContributions = transcript.filter(m => m.speaker === config.userName && !m.is_pass).length
  const userPasses = transcript.filter(m => m.is_pass).length

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Users size={16} className="text-white"/>
            </div>
            <div>
              <p className="font-semibold text-primary-500 text-sm truncate max-w-xs">{config.topic}</p>
              <p className="text-xs text-gray-400">Group Discussion</p>
            </div>
          </div>
          <div className="h-6 w-px bg-surface-200"/>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock size={14}/>
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MessageSquare size={14}/>
            <span>{userContributions} contributions</span>
          </div>
        </div>
        <button onClick={handleEnd} disabled={transcript.length < 4 || loading}
          className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          End & Evaluate
        </button>
      </div>

      {/* Participants Bar */}
      <div className="bg-surface-50 border-b border-surface-200 px-6 py-2.5 flex items-center gap-4">
        <span className="text-xs text-gray-400 font-semibold">Participants:</span>
        {Object.entries(PARTICIPANTS).map(([name, p]) => (
          <div key={name} className="flex items-center gap-1.5">
            <Avatar name={name} size="sm" pulse={typing === name}/>
            <span className="text-xs text-gray-600">{name}</span>
            {typing === name && <span className="text-xs text-gray-400 italic">typing...</span>}
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-surface-300">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <User size={12} className="text-white"/>
          </div>
          <span className="text-xs font-semibold text-accent">{config.userName} (You)</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-surface-50">
        {transcript.map((msg, i) => {
          const isUser = msg.speaker === config.userName
          const isModertor = msg.type === 'moderator'
          const isPass = msg.is_pass
          const p = PARTICIPANTS[msg.speaker]

          if (isModertor) return (
            <div key={i} className="flex justify-center animate-fade-in-up">
              <div className="bg-primary-500 text-white px-5 py-3 rounded-2xl max-w-lg text-sm leading-relaxed shadow-card text-center">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Moderator</p>
                {msg.content}
              </div>
            </div>
          )

          if (isPass) return (
            <div key={i} className="flex justify-center animate-fade-in-up">
              <div className="flex items-center gap-2 bg-surface-200 px-4 py-2 rounded-full text-xs text-gray-500">
                <SkipForward size={12}/>
                <span>{config.userName} passed this turn</span>
              </div>
            </div>
          )

          return (
            <div key={i} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
              <Avatar name={isUser ? 'You' : msg.speaker} size="md"/>
              <div className={`max-w-[70%]`}>
                <p className={`text-xs font-semibold mb-1 ${isUser ? 'text-right text-accent' : p?.text || 'text-gray-600'}`}>
                  {isUser ? config.userName : msg.speaker}
                  {!isUser && p && <span className="text-gray-400 font-normal ml-1">· {p.role}</span>}
                </p>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${isUser
                    ? 'bg-accent text-white rounded-tr-none'
                    : `bg-white text-gray-700 rounded-tl-none border ${p?.border || 'border-surface-200'}`
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {typing && (
          <div className="flex gap-3 animate-fade-in-up">
            <Avatar name={typing} size="md"/>
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: PARTICIPANTS[typing]?.color }}>
                {typing} <span className="text-gray-400 font-normal">is typing...</span>
              </p>
              <div className={`px-4 py-3 rounded-2xl rounded-tl-none bg-white border ${PARTICIPANTS[typing]?.border} shadow-sm`}>
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: PARTICIPANTS[typing]?.color, animationDelay: `${i*150}ms` }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && phase === 'opening' && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin"/>Opening discussion...
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-surface-200 px-6 py-4 shrink-0">
        {phase === 'user_turn' && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-xs font-semibold text-green-600">Your Turn — Share your thoughts or pass</span>
            </div>
            <div className="flex gap-3">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserSpeak() }}}
                placeholder="Share your perspective on the topic... (Enter to send)"
                rows={2}
                className="flex-1 px-4 py-3 rounded-xl border border-surface-300 text-sm focus:outline-none focus:border-accent resize-none bg-surface-50"/>
              <div className="flex flex-col gap-2">
                <button onClick={handleUserSpeak} disabled={!input.trim()}
                  className="btn-primary px-5 flex items-center gap-2 disabled:opacity-40 py-2.5">
                  <Send size={15}/>Speak
                </button>
                <button onClick={handlePass}
                  className="btn-secondary px-5 flex items-center gap-2 py-2.5 text-sm">
                  <SkipForward size={15}/>Pass
                </button>
              </div>
            </div>
          </>
        )}
        {phase === 'ai_turn' && (
          <div className="flex items-center justify-center gap-3 py-2 text-gray-500 text-sm">
            <Loader2 size={16} className="animate-spin text-accent"/>
            <span>AI participants are discussing...</span>
          </div>
        )}
        {phase === 'opening' && (
          <div className="flex items-center justify-center gap-3 py-2 text-gray-500 text-sm">
            <Loader2 size={16} className="animate-spin"/>
            <span>Moderator is opening the discussion...</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Evaluation Screen ─────────────────────────────────────────────────
function EvaluationScreen({ config, transcript, elapsedTime, onRestart }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchEvaluation() }, [])

  const fetchEvaluation = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/gd/evaluate', {
        topic: config.topic,
        transcript: transcript.filter(m => m.type !== 'moderator').map(m => ({
          speaker: m.speaker, content: m.content, is_pass: m.is_pass || false
        })),
        user_name: config.userName
      })
      setData(res.data.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Evaluation failed')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = s => `${Math.floor(s/60)}m ${s%60}s`

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-surface-50">
      <div className="card text-center max-w-md w-full mx-4 py-12">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Loader2 size={28} className="text-accent animate-spin"/>
        </div>
        <h2 className="font-display font-bold text-xl text-primary-500">Generating GD Report</h2>
        <p className="text-gray-400 mt-2 text-sm">Llama 4 Scout is analyzing the full discussion...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="card text-center max-w-sm">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-3"/>
        <p className="text-red-600 font-semibold">Evaluation Failed</p>
        <p className="text-gray-400 text-sm mt-1">{error}</p>
        <button onClick={fetchEvaluation} className="btn-primary mt-4 mx-auto flex items-center gap-2">
          <RefreshCw size={14}/>Retry
        </button>
      </div>
    </div>
  )

  const passColor = {
    'Very High': 'text-green-600 bg-green-50 border-green-200',
    'High': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Medium': 'text-blue-600 bg-blue-50 border-blue-200',
    'Low': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Very Low': 'text-red-600 bg-red-50 border-red-200',
  }[data.gd_pass_chance?.split(' ')[0]] || 'text-gray-600 bg-surface-50 border-surface-200'

  const verdictColor = {
    'Outstanding': 'bg-green-100 text-green-700',
    'Good': 'bg-blue-100 text-blue-700',
    'Average': 'bg-yellow-100 text-yellow-700',
    'Below Average': 'bg-orange-100 text-orange-700',
    'Poor': 'bg-red-100 text-red-700',
  }[data.verdict] || 'bg-gray-100 text-gray-700'

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-primary-500">GD Performance Report</h1>
          <p className="text-gray-400 text-sm truncate max-w-lg">{config.topic} · {formatTime(elapsedTime)}</p>
        </div>
        <button onClick={onRestart} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={14}/>New GD
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">

        {/* Overview */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 min-w-[130px]">
              <ScoreRing score={data.overall_score} size={120}/>
              <span className={`badge ${verdictColor}`}>{data.verdict}</span>
            </div>

            <div className={`flex-1 p-5 rounded-2xl border ${passColor}`}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">GD Pass Probability</p>
              <p className="text-2xl font-display font-bold">{data.gd_pass_chance}</p>
              <p className="text-sm mt-2 opacity-80 leading-relaxed">{data.pass_reasoning}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 min-w-[200px]">
              {[
                { label: 'Contributions', value: data.participation_stats?.total_contributions },
                { label: 'Passes Taken', value: data.participation_stats?.passes_taken },
                { label: 'Participation', value: data.participation_stats?.participation_rate },
                { label: 'Avg Quality', value: data.participation_stats?.avg_response_quality },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-surface-50 rounded-xl">
                  <p className="text-lg font-display font-bold text-primary-500">{value ?? '-'}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Scores */}
          {data.category_scores && (
            <div className="mt-6 pt-6 border-t border-surface-200">
              <p className="section-label mb-4">Category Breakdown</p>
              {Object.entries(data.category_scores).map(([key, val]) => (
                <ScoreBar key={key}
                  label={key.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
                  score={val.score} feedback={val.feedback}/>
              ))}
            </div>
          )}
        </div>

        {/* Best Contribution */}
        {data.best_contribution && (
          <div className="card border-l-4 border-green-400 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-green-600"/>
              <h3 className="font-semibold text-green-800">Best Contribution</h3>
            </div>
            <p className="text-green-700 text-sm italic">"{data.best_contribution}"</p>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.strengths?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp size={16} className="text-green-500"/>
                <h3 className="font-display font-semibold text-primary-500">Strengths</h3>
              </div>
              <div className="space-y-3">
                {data.strengths.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{s.point}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.weaknesses?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown size={16} className="text-red-400"/>
                <h3 className="font-display font-semibold text-primary-500">Weaknesses</h3>
              </div>
              <div className="space-y-3">
                {data.weaknesses.map((w, i) => (
                  <div key={i} className="flex gap-3">
                    <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5"/>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{w.point}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{w.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contribution Analysis */}
        {data.contribution_analysis?.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-accent"/>
              <h3 className="font-display font-semibold text-primary-500">Your Contributions Analyzed</h3>
            </div>
            <div className="space-y-3">
              {data.contribution_analysis.map((c, i) => {
                const qColor = {
                  'Excellent': 'bg-green-50 border-green-200',
                  'Good': 'bg-blue-50 border-blue-200',
                  'Average': 'bg-yellow-50 border-yellow-200',
                  'Poor': 'bg-red-50 border-red-200'
                }[c.quality] || 'bg-surface-50 border-surface-200'
                const qBadge = {
                  'Excellent': 'bg-green-100 text-green-700',
                  'Good': 'bg-blue-100 text-blue-700',
                  'Average': 'bg-yellow-100 text-yellow-700',
                  'Poor': 'bg-red-100 text-red-700'
                }[c.quality] || 'bg-gray-100 text-gray-600'
                return (
                  <div key={i} className={`p-4 rounded-xl border ${qColor}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm text-gray-700 italic">"{c.what_was_said}"</p>
                      <span className={`badge ${qBadge} shrink-0`}>{c.quality}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1"><span className="font-semibold">Impact:</span> {c.impact}</p>
                    <p className="text-xs text-gray-500"><span className="font-semibold">Tip:</span> {c.feedback}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Missed Opportunities */}
        {data.missed_opportunities?.length > 0 && (
          <div className="card border-l-4 border-yellow-400 bg-yellow-50">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-yellow-600"/>
              <h3 className="font-semibold text-yellow-800">Missed Opportunities</h3>
            </div>
            <ul className="space-y-2">
              {data.missed_opportunities.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-yellow-700">
                  <span className="font-bold shrink-0">→</span>{m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compared to Peers */}
        {data.compared_to_peers && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-accent"/>
              <h3 className="font-display font-semibold text-primary-500">Compared to Other Participants</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(data.compared_to_peers).map(([key, val]) => {
                const name = key.replace('vs_', '').replace(/^\w/, c => c.toUpperCase())
                const p = PARTICIPANTS[name]
                return (
                  <div key={key} className="flex gap-3 p-3 bg-surface-50 rounded-xl">
                    <Avatar name={name} size="sm"/>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">vs {name}</p>
                      <p className="text-sm text-gray-600">{val}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Improvement Plan */}
        {data.improvement_plan?.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-accent"/>
              <h3 className="font-display font-semibold text-primary-500">Improvement Plan</h3>
            </div>
            <div className="space-y-3">
              {data.improvement_plan.map((item, i) => {
                const style = { high: 'bg-red-50 border-red-200', medium: 'bg-yellow-50 border-yellow-200', low: 'bg-green-50 border-green-200' }[item.priority] || 'bg-surface-50 border-surface-200'
                const badge = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' }[item.priority] || 'bg-gray-100 text-gray-600'
                return (
                  <div key={i} className={`p-4 rounded-xl border ${style}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${badge} text-xs`}>{item.priority} priority</span>
                      <span className="text-sm font-semibold text-gray-700">{item.area}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.suggestion}</p>
                    {item.practice && <p className="text-xs text-gray-400 mt-1.5">🎯 {item.practice}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Evaluator Summary */}
        {data.evaluator_summary && (
          <div className="card bg-primary-500 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-white/60"/>
              <p className="text-sm font-semibold text-white/80">Evaluator's Summary</p>
            </div>
            <p className="text-white/90 leading-relaxed italic">"{data.evaluator_summary}"</p>
          </div>
        )}

        <div className="text-center pb-8">
          <button onClick={onRestart} className="btn-primary inline-flex items-center gap-2">
            <RefreshCw size={16}/>Practice Another GD
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function GDSimulator() {
  const [screen, setScreen] = useState('setup')
  const [config, setConfig] = useState(null)
  const [transcript, setTranscript] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [topicsData, setTopicsData] = useState({})
  const [loadingTopics, setLoadingTopics] = useState(true)

  useEffect(() => {
    axios.get('/api/gd/topics')
      .then(res => setTopicsData(res.data.topics))
      .catch(() => setTopicsData({
        "Technology & AI": ["Is Artificial Intelligence a threat or opportunity for employment?", "Should social media platforms be regulated by governments?"],
        "Society & Ethics": ["Should college education be free for everyone?", "Is social media doing more harm than good?"],
      }))
      .finally(() => setLoadingTopics(false))
  }, [])

  const handleStart = (cfg) => { setConfig(cfg); setScreen('gd') }
  const handleEnd = (t, time) => { setTranscript(t); setElapsedTime(time); setScreen('evaluation') }
  const handleRestart = () => { setScreen('setup'); setConfig(null); setTranscript([]); setElapsedTime(0) }

  if (loadingTopics) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 size={24} className="text-accent animate-spin"/>
    </div>
  )

  if (screen === 'setup') return <SetupScreen onStart={handleStart} topicsData={topicsData}/>
  if (screen === 'gd') return <GDScreen config={config} onEnd={handleEnd}/>
  if (screen === 'evaluation') return <EvaluationScreen config={config} transcript={transcript} elapsedTime={elapsedTime} onRestart={handleRestart}/>
}
