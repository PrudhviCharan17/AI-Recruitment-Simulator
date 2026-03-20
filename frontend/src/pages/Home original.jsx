import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sun, Moon, Settings, LogOut, Edit3,
  Zap, FileText, Mic, Users, Clock, TrendingUp,
  ArrowRight, Sparkles, BookOpen, Lock, Play,
  Activity, ChevronRight, Flame, Search
} from 'lucide-react'

/* ─── Theme ─────────────────────────────────────────────────────── */
const THEME = {
  light: {
    bg:'#f0f4f8', pageBg:'#f0f4f8',
    card:'#ffffff', cardHov:'#fafcff',
    nav:'rgba(248,250,253,0.92)',
    border:'#dde5ee', borderHov:'#b8cce0',
    text:'#0d1b2a', textSub:'#4a6080', textMuted:'#8da4be',
    surface:'#edf2f7', surfaceHov:'#e2eaf3',
    accent:'#0ea5e9', accentDark:'#0284c7',
    accentGlow:'rgba(14,165,233,0.18)', accentBg:'rgba(14,165,233,0.07)',
    teal:'#14b8a6', tealDark:'#0d9488', tealBg:'rgba(20,184,166,0.09)',
    shadow:'0 2px 16px rgba(13,27,42,0.07)', shadowHov:'0 12px 40px rgba(13,27,42,0.13)',
    heroFrom:'#0d1b2a', heroTo:'#1a3a5c',
    toggleBg:'#e2eaf3', toggleKnob:'#fff',
  },
  dark: {
    bg:'#070e1a', pageBg:'#070e1a',
    card:'#0e1a2d', cardHov:'#132235',
    nav:'rgba(7,14,26,0.95)',
    border:'#1a2e4a', borderHov:'#254570',
    text:'#deeaf8', textSub:'#6a8fad', textMuted:'#3d5470',
    surface:'#0a1525', surfaceHov:'#101e34',
    accent:'#38bdf8', accentDark:'#0ea5e9',
    accentGlow:'rgba(56,189,248,0.18)', accentBg:'rgba(56,189,248,0.07)',
    teal:'#2dd4bf', tealDark:'#14b8a6', tealBg:'rgba(45,212,191,0.08)',
    shadow:'0 2px 16px rgba(0,0,0,0.45)', shadowHov:'0 12px 40px rgba(0,0,0,0.65)',
    heroFrom:'#050c17', heroTo:'#0c1e35',
    toggleBg:'#1a2e4a', toggleKnob:'#38bdf8',
  }
}

/* ─── Animated Counter ──────────────────────────────────────────── */
function Counter({ target, suffix='' }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return
      done.current = true
      let v = 0
      const step = Math.max(1, Math.ceil(target / 40))
      const id = setInterval(() => { v = Math.min(v+step, target); setN(v); if (v>=target) clearInterval(id) }, 30)
      io.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>
}

/* ─── Pill Dark-Mode Toggle ─────────────────────────────────────── */
function DarkToggle({ dark, toggle, t }) {
  return (
    <button onClick={toggle} title={dark ? 'Switch to light' : 'Switch to dark'} style={{
      width:52, height:28, borderRadius:14, border:`1.5px solid ${t.border}`,
      background: dark ? '#1a2e4a' : '#e2eaf3',
      cursor:'pointer', position:'relative', transition:'all 0.3s ease',
      flexShrink:0, padding:0, outline:'none'
    }}>
      {/* track icons */}
      <Sun size={11} color={dark?t.textMuted:'#f59e0b'} style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)', transition:'opacity 0.3s', opacity:dark?0.3:1 }}/>
      <Moon size={11} color={dark?t.accent:t.textMuted} style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', transition:'opacity 0.3s', opacity:dark?1:0.3 }}/>
      {/* knob */}
      <span style={{
        position:'absolute', top:3, width:20, height:20, borderRadius:'50%',
        background: dark ? t.accent : '#fff',
        boxShadow: dark ? `0 0 8px ${t.accentGlow}` : '0 1px 4px rgba(0,0,0,0.18)',
        transition:'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        left: dark ? 'calc(100% - 23px)' : '3px',
      }}/>
    </button>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────── */
function Navbar({ t, dark, toggleDark }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:500,
      backdropFilter:'blur(24px) saturate(180%)',
      background: t.nav,
      borderBottom:`1px solid ${t.border}`,
      boxShadow: scrolled ? t.shadow : 'none',
      transition:'box-shadow 0.3s ease, background 0.3s ease',
      fontFamily:"'DM Sans',sans-serif"
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        {/* Logo — left */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.teal})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 14px ${t.accentGlow}` }}>
            <Zap size={16} color="#fff"/>
          </div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:14.5, color:t.text, whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>
            AI Recruitment <span style={{ color:t.accent }}>Simulator</span>
          </span>
        </Link>

        {/* Right side — nav links + toggle + profile */}
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>

          {/* Nav links */}
          {[['/', 'Dashboard'], ['/performance', 'Performance'], ['/faq', 'FAQs']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              padding:'6px 13px', borderRadius:9, fontSize:13, fontWeight:500,
              color:t.textSub, textDecoration:'none', transition:'all 0.18s',
              whiteSpace:'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.background=t.surface; e.currentTarget.style.color=t.text }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=t.textSub }}>
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div style={{ width:1, height:22, background:t.border, margin:'0 10px' }}/>

          {/* Pill dark toggle */}
          <DarkToggle dark={dark} toggle={toggleDark} t={t}/>

          {/* Gap + Profile */}
          <div style={{ width:10 }}/>

          {/* Profile icon — click only, no chevron */}
          <div ref={ref} style={{ position:'relative' }}>
            <button onClick={() => setProfileOpen(p => !p)} style={{
              width:36, height:36, borderRadius:'50%', padding:0, border:`2px solid ${profileOpen ? t.accent : 'transparent'}`,
              background:`linear-gradient(135deg,${t.accent},${t.teal})`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:700, fontSize:13, fontFamily:"'DM Sans',sans-serif",
              transition:'all 0.2s', boxShadow: profileOpen ? `0 0 0 3px ${t.accentGlow}` : 'none',
              position:'relative', flexShrink:0, outline:'none'
            }}>
              V
              <span style={{ position:'absolute', bottom:0, right:0, width:9, height:9, background:'#22c55e', borderRadius:'50%', border:`2px solid ${dark?'#070e1a':'#f0f4f8'}` }}/>
            </button>

            {profileOpen && (
              <div style={{
                position:'absolute', right:0, top:'calc(100% + 8px)',
                background:t.card, border:`1px solid ${t.border}`,
                borderRadius:16, overflow:'hidden', zIndex:600,
                boxShadow:t.shadowHov, minWidth:210,
                animation:'slideDown 0.2s ease forwards'
              }}>
                <div style={{ padding:'14px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${t.accent},${t.teal})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>V</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:t.text, margin:0 }}>Vivek Kumar</p>
                    <p style={{ fontSize:11, color:t.textMuted, margin:'1px 0 0' }}>vivek@example.com</p>
                  </div>
                </div>
                <div style={{ padding:'5px 0' }}>
                  {[[Edit3,'Edit Profile'],[Settings,'Settings']].map(([Icon,lbl]) => (
                    <button key={lbl} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:t.textSub, transition:'all 0.15s', textAlign:'left', fontFamily:"'DM Sans',sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.background=t.surface; e.currentTarget.style.color=t.text }}
                    onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=t.textSub }}>
                      <Icon size={13}/>{lbl}
                    </button>
                  ))}
                </div>
                <div style={{ padding:'5px 0', borderTop:`1px solid ${t.border}` }}>
                  <button style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:'#f87171', transition:'all 0.15s', textAlign:'left', fontFamily:"'DM Sans',sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(248,113,113,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background='none'}>
                    <LogOut size={13}/>Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ─── Main ───────────────────────────────────────────────────────── */
export default function Home() {
  const [dark, setDark] = useState(false)
  const t = dark ? THEME.dark : THEME.light
  const toolsRef = useRef(null)

  useEffect(() => {
    document.body.style.background = t.bg
    document.documentElement.style.background = t.bg
  }, [dark, t.bg])

  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior:'smooth', block:'start' })

  const heroStats = [
    { label:'Interviews Done', value:24, suffix:'',  icon:Mic,        color:t.accent  },
    { label:'GDs Completed',   value:8,  suffix:'',  icon:Users,      color:t.teal    },
    { label:'JAM Sessions',    value:5,  suffix:'',  icon:Clock,      color:'#a78bfa' },
    { label:'Avg Score',       value:74, suffix:'%', icon:TrendingUp, color:'#34d399' },
  ]

  const recent = [
    { label:'Technical Round — Full Stack Developer', score:78, time:'2 hours ago',  icon:Mic,      color:t.accent,  type:'Interview' },
    { label:'GD — AI: Threat or Opportunity?',        score:82, time:'1 day ago',    icon:Users,    color:t.teal,    type:'GD'       },
    { label:'Resume Analysis — portfolio_v3.pdf',     score:71, time:'2 days ago',   icon:FileText, color:'#6366f1', type:'Resume'   },
    { label:'HR Round — Product Manager',             score:85, time:'3 days ago',   icon:Mic,      color:'#34d399', type:'Interview' },
    { label:'GD — Should plastic be banned?',         score:68, time:'4 days ago',   icon:Users,    color:t.teal,    type:'GD'       },
    { label:'Technical Round — Data Scientist',       score:73, time:'5 days ago',   icon:Mic,      color:t.accent,  type:'Interview' },
  ]

  const tools = [
    {
      title:'Resume Analyzer', icon:FileText, color:'#6366f1', tint:'rgba(99,102,241,0.08)',
      desc:'ATS score, skill gaps & improvement suggestions powered by Qwen3 32B',
      badge:'AI Powered', badgeColor:'#6366f1', to:'/resume',
      features:['ATS Score','Skill Gap','Job Match'],
      cta:'Analyze', available:true
    },
    {
      title:'Interview by AI', icon:Mic, color:t.accent, tint:t.accentBg,
      desc:'Practice TR, HR & MR rounds with an AI that reads your resume live',
      badge:'Most Used', badgeColor:t.accent, to:'/interview',
      features:['TR / HR / MR','Resume Q&A','Full Report'],
      cta:'Start', available:true
    },
    {
      title:'Group Discussion', icon:Users, color:t.teal, tint:t.tealBg,
      desc:'Simulate real GDs with 3 AI personas — Arjun, Priya & Rohan',
      badge:'3 Personas', badgeColor:t.teal, to:'/gd',
      features:['Topic Bank','Pass Option','GD Report'],
      cta:'Start GD', available:true
    },
    {
      title:'JAM Practice', icon:Mic, color:'#f59e0b', tint:'rgba(245,158,11,0.08)',
      desc:'Just A Minute — speak on any topic for 60 seconds, get instant AI feedback on fluency & clarity',
      badge:'New', badgeColor:'#f59e0b', to:'/jam',
      features:['60s Timer','Fluency Score','Topic Bank'],
      cta:'Start JAM', available:true
    },
  ]

  const f = "'DM Sans',sans-serif"

  return (
    <div style={{ minHeight:'100vh', background:t.bg, transition:'background 0.35s ease', fontFamily:f }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeInUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .fu  { animation:fadeInUp .5s ease both }
        .fu1 { animation:fadeInUp .5s .06s ease both }
        .fu2 { animation:fadeInUp .5s .12s ease both }
        .fu3 { animation:fadeInUp .5s .18s ease both }
        .fu4 { animation:fadeInUp .5s .24s ease both }
        .fu5 { animation:fadeInUp .5s .30s ease both }
        /* Tool card hover */
        .tool-card { transition:transform .26s cubic-bezier(.4,0,.2,1), box-shadow .26s ease, border-color .2s ease !important }
        .tool-card:hover { transform:translateY(-7px) scale(1.015) !important }
        /* Stat hover */
        .stat-box { transition:transform .2s ease, box-shadow .2s ease !important }
        .stat-box:hover { transform:translateY(-4px) scale(1.04) !important }
        /* Row hover */
        .sess-row { transition:background .15s ease, transform .15s ease; border-radius:13px }
        .sess-row:hover { transform:translateX(3px) }
        /* Button hover */
        .cta-btn { transition:all .2s ease !important }
        .cta-btn:hover { transform:translateY(-2px) !important; filter:brightness(1.1) !important }
        /* Tip banner hover */
        .tip-card { transition:transform .25s ease, box-shadow .25s ease }
        .tip-card:hover { transform:translateY(-3px) }
      `}</style>

      <Navbar t={t} dark={dark} toggleDark={() => setDark(d => !d)} />

      <main style={{ maxWidth:1280, margin:'0 auto', padding:'32px 32px 0' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="fu" style={{
          borderRadius:26, marginBottom:28, overflow:'hidden', position:'relative',
          background:`linear-gradient(140deg,${t.heroFrom} 0%,${t.heroTo} 100%)`,
          boxShadow:`0 20px 60px rgba(0,0,0,${dark?.55:.20})`,
        }}>
          {/* decorative */}
          <div style={{ position:'absolute', top:-70, right:-70, width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle,${t.accentGlow},transparent 68%)`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-50, left:120, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.1),transparent 70%)', pointerEvents:'none', animation:'floatY 5s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:44, right:460, width:5, height:5, borderRadius:'50%', background:t.accent, opacity:.7, animation:'floatY 3.2s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', top:92, right:418, width:3, height:3, borderRadius:'50%', background:t.teal,   opacity:.5, animation:'floatY 4.1s 1s ease-in-out infinite' }}/>

          <div style={{ position:'relative', zIndex:1, padding:'40px 48px', display:'flex', gap:40, alignItems:'stretch', flexWrap:'wrap' }}>

            {/* Left — welcome + CTAs */}
            <div style={{ flex:'1 1 260px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, background:'rgba(14,165,233,0.14)', border:`1px solid ${t.accentGlow}`, marginBottom:14 }}>
                <Flame size={11} color={t.accent}/>
                <span style={{ fontSize:10, fontWeight:700, color:t.accent, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:f }}>Welcome back, Vivek!</span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#fff', margin:'0 0 13px', lineHeight:1.22 }}>
                Ready to ace your<br/>
                <span style={{ background:`linear-gradient(90deg,${t.accent},${t.teal})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>next interview?</span>
              </h1>
              <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.5)', margin:'0 0 28px', lineHeight:1.75, maxWidth:380, fontFamily:f }}>
                You've completed <strong style={{ color:'#fff' }}>24 interviews</strong> &amp; <strong style={{ color:'#fff' }}>8 GDs</strong>. Your score improved by <strong style={{ color:t.teal }}>6%</strong> this week!
              </p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={scrollToTools} className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 24px', borderRadius:12, background:`linear-gradient(135deg,${t.accent},${t.accentDark})`, color:'#fff', fontWeight:700, fontSize:13.5, border:'none', cursor:'pointer', boxShadow:`0 4px 20px ${t.accentGlow}`, fontFamily:f }}>
                  <Play size={14} fill="white"/>Start Practice
                </button>
                <Link to="/resume" className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'11px 24px', borderRadius:12, background:'rgba(255,255,255,0.09)', color:'rgba(255,255,255,0.88)', fontWeight:600, fontSize:13.5, textDecoration:'none', border:'1px solid rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', fontFamily:f }}>
                  <FileText size={14}/>Analyze Resume
                </Link>
              </div>
            </div>

            {/* Right — Your Progress */}
            <div style={{ flex:'1 1 300px' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.28)', letterSpacing:'0.14em', textTransform:'uppercase', margin:'0 0 12px', fontFamily:f }}>Your Progress</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {heroStats.map(({ label, value, suffix, icon:Icon, color }) => (
                  <div key={label} className="stat-box" style={{ background:'rgba(255,255,255,0.07)', borderRadius:14, padding:'16px', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(8px)', cursor:'default' }}>
                    <div style={{ width:30, height:30, borderRadius:9, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:9 }}>
                      <Icon size={14} color={color}/>
                    </div>
                    <p style={{ fontSize:26, fontWeight:800, color:'#fff', margin:0, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                      <Counter target={value} suffix={suffix}/>
                    </p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontFamily:f }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Sessions (full width) ────────────────────── */}
        <div className="fu1" style={{ background:t.card, borderRadius:22, padding:'26px 28px', border:`1px solid ${t.border}`, boxShadow:t.shadow, marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:t.textMuted, letterSpacing:'0.13em', textTransform:'uppercase', margin:0, fontFamily:f }}>History</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:t.text, margin:'3px 0 0' }}>Recent Sessions</h2>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:10, background:t.surface, border:`1px solid ${t.border}` }}>
                <Activity size={13} color={t.accent}/>
                <span style={{ fontSize:12, fontWeight:600, color:t.textSub, fontFamily:f }}>6 sessions</span>
              </div>
              <Link to="/history" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:t.accent, textDecoration:'none', padding:'6px 12px', borderRadius:10, border:`1px solid ${t.accentGlow}`, background:t.accentBg, fontFamily:f, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background=`rgba(14,165,233,0.14)`}
              onMouseLeave={e => e.currentTarget.style.background=t.accentBg}>
                View All <ArrowRight size={12}/>
              </Link>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:4 }}>
            {recent.map(({ label, score, time, icon:Icon, color, type }, i) => (
              <div key={i} className="sess-row" style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background=t.surfaceHov}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={color}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:t.text, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:f }}>{label}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                    <span style={{ fontSize:10, fontWeight:600, color, background:`${color}12`, padding:'1px 7px', borderRadius:5, fontFamily:f }}>{type}</span>
                    <span style={{ fontSize:11, color:t.textMuted, fontFamily:f }}>{time}</span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                  <div style={{ padding:'3px 10px', borderRadius:18, background:score>=80?'rgba(52,211,153,0.1)':score>=65?t.accentBg:'rgba(245,158,11,0.1)', color:score>=80?'#34d399':score>=65?t.accent:'#f59e0b' }}>
                    <span style={{ fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{score}</span>
                    <span style={{ fontSize:10, opacity:0.65, fontFamily:f }}>/100</span>
                  </div>
                  <ChevronRight size={13} color={t.textMuted}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Practice Tools ──────────────────────────────────── */}
        <div ref={toolsRef} style={{ marginBottom:44, scrollMarginTop:80 }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:t.textMuted, letterSpacing:'0.13em', textTransform:'uppercase', margin:0, fontFamily:f }}>Features</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:t.text, margin:'4px 0 0' }}>Practice Tools</h2>
            </div>
            <span style={{ fontSize:12, color:t.textMuted, fontFamily:f }}>4 active · 1 coming soon</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
            {tools.map(({ title, icon:Icon, color, tint, badge, badgeColor, to, features, cta, available, desc }, i) => (
              <div key={title} className={`tool-card fu${i+1}`}
              style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20, padding:24, position:'relative', overflow:'hidden', boxShadow:t.shadow, opacity:available?1:0.7, cursor:available?'pointer':'default' }}
              onMouseEnter={e => { if(available){ e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`${t.shadowHov},0 0 0 1px ${color}20` }}}
              onMouseLeave={e => { e.currentTarget.style.borderColor=t.border; e.currentTarget.style.boxShadow=t.shadow }}>

                {/* radial tint */}
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at top right,${tint},transparent 62%)`, pointerEvents:'none', borderRadius:20 }}/>

                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                    <div style={{ width:46, height:46, borderRadius:13, background:`${color}16`, border:`1px solid ${color}26`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={21} color={color}/>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {!available && <Lock size={10} color={t.textMuted}/>}
                      <span style={{ padding:'3px 9px', borderRadius:18, background:`${badgeColor}14`, border:`1px solid ${badgeColor}24`, fontSize:10, fontWeight:700, color:badgeColor, letterSpacing:'0.03em', fontFamily:f }}>{badge}</span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:t.text, margin:'0 0 7px' }}>{title}</h3>
                  <p style={{ fontSize:12.5, color:t.textSub, margin:'0 0 14px', lineHeight:1.65, fontFamily:f }}>{desc}</p>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
                    {features.map(ft => (
                      <span key={ft} style={{ padding:'3px 9px', borderRadius:7, background:t.surface, fontSize:10.5, fontWeight:600, color:t.textSub, fontFamily:f }}>{ft}</span>
                    ))}
                  </div>

                  {available ? (
                    <Link to={to} className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:11, background:`linear-gradient(135deg,${color},${color}cc)`, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:13, boxShadow:`0 3px 12px ${color}28`, fontFamily:f }}>
                      {cta} <ArrowRight size={13}/>
                    </Link>
                  ) : (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:11, background:t.surface, color:t.textMuted, fontWeight:600, fontSize:13, border:`1px solid ${t.border}`, fontFamily:f }}>
                      <Clock size={12}/>Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip Banner (no "More Tips" button) ──────────────── */}
        <div className="tip-card fu" style={{
          borderRadius:20, padding:'24px 32px', marginBottom:48,
          background: dark ? `linear-gradient(135deg,${t.accentBg},${t.tealBg})` : 'linear-gradient(135deg,#f0f9ff,#f0fdfb)',
          border:`1px solid ${dark ? t.border : t.borderHov}`,
          display:'flex', alignItems:'center', gap:18, flexWrap:'wrap',
          boxShadow:t.shadow
        }}>
          <div style={{ width:44, height:44, borderRadius:13, background:t.accentBg, border:`1px solid ${t.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Sparkles size={19} color={t.accent}/>
          </div>
          <div style={{ flex:1, minWidth:180 }}>
            <p style={{ fontSize:13.5, fontWeight:700, color:t.text, margin:'0 0 4px', fontFamily:f }}>💡 Today's Interview Tip</p>
            <p style={{ fontSize:13, color:t.textSub, margin:0, lineHeight:1.65, fontFamily:f }}>
              In Technical rounds, always explain your <strong>thought process out loud</strong> before jumping to the answer — interviewers value structured thinking over just getting it right.
            </p>
          </div>
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background:dark?'#050b14':'#0d1b2a', borderTop:`1px solid ${dark?'#0e1a2e':'#152236'}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px 28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.teal})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Zap size={15} color="#fff"/>
                </div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:14, color:'#fff' }}>AI Recruitment Simulator</span>
              </div>
              <p style={{ fontSize:12.5, color:'rgba(255,255,255,0.34)', lineHeight:1.75, maxWidth:270, margin:'0 0 20px', fontFamily:f }}>
                Prepare smarter for interviews, GDs and aptitude tests with free AI-powered simulations.
              </p>
              <div style={{ display:'flex', gap:7 }}>
                {['GitHub','Twitter','LinkedIn'].map(s => (
                  <button key={s} style={{ padding:'5px 13px', borderRadius:7, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.42)', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:f, transition:'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.42)'; e.currentTarget.style.background='rgba(255,255,255,0.06)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {[
              { title:'Practice', links:['Resume Analyzer','Interview Simulator','GD Simulator','JAM Practice','Question Bank'] },
              { title:'Company',  links:['About Us','Blog','Careers','Contact'] },
              { title:'Support',  links:['FAQs','Privacy Policy','Terms of Use','Report Bug'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,0.22)', letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 16px', fontFamily:f }}>{title}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {links.map(l => (
                    <a key={l} href="#" style={{ fontSize:12.5, color:'rgba(255,255,255,0.4)', textDecoration:'none', transition:'color 0.18s', fontFamily:f }}
                    onMouseEnter={e => e.target.style.color=t.accent}
                    onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop:22, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:0, fontFamily:f }}>© 2026 AI Recruitment Simulator · Built with Groq + React</p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.18)', fontFamily:f }}>Powered by</span>
              {['Qwen3 32B','Llama 4 Scout','Groq LPU'].map(tag => (
                <span key={tag} style={{ padding:'2px 9px', borderRadius:6, background:t.accentBg, border:`1px solid ${t.accentGlow}`, fontSize:10.5, fontWeight:700, color:t.accent, fontFamily:f }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
