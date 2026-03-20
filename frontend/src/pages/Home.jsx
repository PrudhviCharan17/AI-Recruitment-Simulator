import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sun, Moon,
  Zap, FileText, Mic, Users,
  ArrowRight, Sparkles, Play, Radio
} from 'lucide-react'

/* ─── Theme ─────────────────────────────────────────────────────── */
const THEME = {
  light: {
    bg:'#f0f4f8', card:'#ffffff',
    nav:'rgba(248,250,253,0.92)',
    border:'#dde5ee', borderHov:'#b8cce0',
    text:'#0d1b2a', textSub:'#4a6080', textMuted:'#8da4be',
    surface:'#edf2f7', surfaceHov:'#e2eaf3',
    accent:'#0ea5e9', accentDark:'#0284c7',
    accentGlow:'rgba(14,165,233,0.18)', accentBg:'rgba(14,165,233,0.07)',
    teal:'#14b8a6', tealDark:'#0d9488', tealBg:'rgba(20,184,166,0.09)',
    shadow:'0 2px 16px rgba(13,27,42,0.07)', shadowHov:'0 12px 40px rgba(13,27,42,0.13)',
    heroFrom:'#0d1b2a', heroTo:'#1a3a5c',
  },
  dark: {
    bg:'#070e1a', card:'#0e1a2d',
    nav:'rgba(7,14,26,0.95)',
    border:'#1a2e4a', borderHov:'#254570',
    text:'#deeaf8', textSub:'#6a8fad', textMuted:'#3d5470',
    surface:'#0a1525', surfaceHov:'#101e34',
    accent:'#38bdf8', accentDark:'#0ea5e9',
    accentGlow:'rgba(56,189,248,0.18)', accentBg:'rgba(56,189,248,0.07)',
    teal:'#2dd4bf', tealDark:'#14b8a6', tealBg:'rgba(45,212,191,0.08)',
    shadow:'0 2px 16px rgba(0,0,0,0.45)', shadowHov:'0 12px 40px rgba(0,0,0,0.65)',
    heroFrom:'#050c17', heroTo:'#0c1e35',
  }
}

/* ─── Dark Toggle ────────────────────────────────────────────────── */
function DarkToggle({ dark, toggle, t }) {
  return (
    <button onClick={toggle} style={{
      width:52, height:28, borderRadius:14, border:`1.5px solid ${t.border}`,
      background: dark ? '#1a2e4a' : '#e2eaf3',
      cursor:'pointer', position:'relative', transition:'all 0.3s ease',
      flexShrink:0, padding:0, outline:'none'
    }}>
      <Sun size={11} color={dark ? t.textMuted : '#f59e0b'} style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)', opacity: dark ? 0.3 : 1, transition:'opacity 0.3s' }}/>
      <Moon size={11} color={dark ? t.accent : t.textMuted} style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', opacity: dark ? 1 : 0.3, transition:'opacity 0.3s' }}/>
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
  const [scrolled, setScrolled] = useState(false)
  const f = "'DM Sans',sans-serif"

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:500,
      backdropFilter:'blur(24px) saturate(180%)',
      background: t.nav,
      borderBottom:`1px solid ${t.border}`,
      boxShadow: scrolled ? t.shadow : 'none',
      transition:'box-shadow 0.3s ease',
      fontFamily: f
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.teal})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 14px ${t.accentGlow}` }}>
            <Zap size={16} color="#fff"/>
          </div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:14.5, color:t.text, whiteSpace:'nowrap' }}>
            AI Recruitment <span style={{ color:t.accent }}>Simulator</span>
          </span>
        </Link>

        {/* Dark mode toggle only — no profile */}
        <DarkToggle dark={dark} toggle={toggleDark} t={t}/>
      </div>
    </nav>
  )
}

/* ─── Hero Feature Pill ──────────────────────────────────────────── */
function FeaturePill({ icon: Icon, color, label, f }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'12px 16px', borderRadius:14,
        background: hovered ? `${color}18` : 'rgba(255,255,255,0.06)',
        border: hovered ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.1)',
        backdropFilter:'blur(8px)',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        transition:'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        cursor:'default',
      }}
    >
      <div style={{
        width:34, height:34, borderRadius:10, flexShrink:0,
        background: hovered ? `${color}30` : `${color}22`,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'background 0.22s ease',
      }}>
        <Icon size={15} color={color}/>
      </div>
      <span style={{ fontSize:13, fontWeight:600, color: hovered ? '#fff' : 'rgba(255,255,255,0.82)', fontFamily:f, transition:'color 0.2s' }}>{label}</span>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────── */
export default function Home() {
  const [dark, setDark] = useState(false)
  const t = dark ? THEME.dark : THEME.light
  const toolsRef = useRef(null)
  const f = "'DM Sans',sans-serif"

  useEffect(() => {
    document.body.style.background = t.bg
    document.documentElement.style.background = t.bg
  }, [dark, t.bg])

  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior:'smooth', block:'start' })

  const tools = [
    {
      title:'Resume Analyzer', icon:FileText, color:'#6366f1', tint:'rgba(99,102,241,0.08)',
      desc:'Upload your resume and get an ATS score, skill gap analysis, live job matches, and a tailored improvement plan — powered by Qwen3 32B.',
      badge:'AI Powered', badgeColor:'#6366f1', to:'/resume',
      features:['ATS Score','Skill Gap','Live Jobs','Email Draft'],
    },
    {
      title:'Interview Simulator', icon:Mic, color:t.accent, tint:t.accentBg,
      desc:'Practice Technical, HR, and Management rounds with an AI interviewer that adapts to your resume and reacts to your answers in real time.',
      badge:'Most Used', badgeColor:t.accent, to:'/interview',
      features:['TR / HR / MR','Voice Mode','Full Report'],
    },
    {
      title:'GD Simulator', icon:Users, color:t.teal, tint:t.tealBg,
      desc:'Simulate real group discussions with 3 AI personas — Arjun (analytical), Priya (devil\'s advocate), and Rohan (practical).',
      badge:'3 AI Personas', badgeColor:t.teal, to:'/gd',
      features:['Topic Bank','Pass Option','GD Report'],
    },
    {
      title:'JAM Session', icon:Radio, color:'#f59e0b', tint:'rgba(245,158,11,0.08)',
      desc:'Just A Minute — record yourself speaking on any topic for 60 seconds and get instant AI feedback on fluency, clarity, depth, and confidence.',
      badge:'New', badgeColor:'#f59e0b', to:'/jam',
      features:['60s Timer','Fluency Score','Topic Bank'],
    },
  ]

  const howItWorks = [
    { step:'01', title:'Pick a Tool', desc:'Choose from Resume Analyzer, Interview Simulator, GD Simulator, or JAM Session based on what you need to practice.' },
    { step:'02', title:'Practice with AI', desc:'Interact with Groq-powered AI in real time — use text or voice, upload your resume, or go cold. No signup needed.' },
    { step:'03', title:'Get Your Report', desc:'Receive a detailed breakdown with scores, strengths, gaps, answer analysis, and a step-by-step improvement plan.' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:t.bg, transition:'background 0.35s ease', fontFamily:f }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .fu  { animation:fadeInUp .5s ease both }
        .fu1 { animation:fadeInUp .5s .06s ease both }
        .fu2 { animation:fadeInUp .5s .12s ease both }
        .fu3 { animation:fadeInUp .5s .18s ease both }
        .fu4 { animation:fadeInUp .5s .24s ease both }
        .tool-card { transition:transform .26s cubic-bezier(.4,0,.2,1), box-shadow .26s ease, border-color .2s ease !important }
        .tool-card:hover { transform:translateY(-7px) scale(1.015) !important }
        .cta-btn  { transition:all .2s ease !important }
        .cta-btn:hover { transform:translateY(-2px) !important; filter:brightness(1.1) !important }
        .step-card { transition:transform .22s ease, box-shadow .22s ease }
        .step-card:hover { transform:translateY(-4px) }
        .tip-card  { transition:transform .25s ease }
        .tip-card:hover { transform:translateY(-3px) }
      `}</style>

      <Navbar t={t} dark={dark} toggleDark={() => setDark(d => !d)}/>

      <main style={{ maxWidth:1280, margin:'0 auto', padding:'32px 32px 0' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="fu" style={{
          borderRadius:26, marginBottom:28, overflow:'hidden', position:'relative',
          background:`linear-gradient(140deg,${t.heroFrom} 0%,${t.heroTo} 100%)`,
          boxShadow:`0 20px 60px rgba(0,0,0,${dark ? .55 : .20})`,
        }}>
          <div style={{ position:'absolute', top:-70, right:-70, width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle,${t.accentGlow},transparent 68%)`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-50, left:120, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.1),transparent 70%)', pointerEvents:'none', animation:'floatY 5s ease-in-out infinite' }}/>

          <div style={{ position:'relative', zIndex:1, padding:'48px 56px', display:'flex', gap:48, alignItems:'center', flexWrap:'wrap' }}>

            {/* Left */}
            <div style={{ flex:'1 1 300px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, background:'rgba(14,165,233,0.14)', border:`1px solid ${t.accentGlow}`, marginBottom:18 }}>
                <Zap size={11} color={t.accent}/>
                <span style={{ fontSize:10, fontWeight:700, color:t.accent, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:f }}>Free · No signup required</span>
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:'#fff', margin:'0 0 16px', lineHeight:1.22 }}>
                Ace your next<br/>
                <span key={dark ? 'dark' : 'light'} style={{ background:`linear-gradient(90deg,${t.accent},${t.teal})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'inline-block' }}>interview & GD</span>
              </h1>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.52)', margin:'0 0 32px', lineHeight:1.75, maxWidth:420, fontFamily:f }}>
                Practice with AI-powered Resume Analysis, Mock Interviews, Group Discussions, and JAM Sessions. Get instant feedback. No account needed.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <button onClick={scrollToTools} className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 26px', borderRadius:12, background:`linear-gradient(135deg,${t.accent},${t.accentDark})`, color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer', boxShadow:`0 4px 20px ${t.accentGlow}`, fontFamily:f }}>
                  <Play size={14} fill="white"/>Explore Tools
                </button>
                <Link to="/resume" className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'12px 26px', borderRadius:12, background:'rgba(255,255,255,0.09)', color:'rgba(255,255,255,0.88)', fontWeight:600, fontSize:14, textDecoration:'none', border:'1px solid rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', fontFamily:f }}>
                  <FileText size={14}/>Analyze Resume
                </Link>
              </div>
            </div>

            {/* Right — feature pills */}
            <div style={{ flex:'1 1 240px', display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:FileText, color:'#6366f1', label:'Resume → ATS Score + Live Jobs' },
                { icon:Mic,      color:t.accent,  label:'Mock Interviews — TR / HR / MR' },
                { icon:Users,    color:t.teal,    label:'GD with 3 AI Personas' },
                { icon:Radio,    color:'#f59e0b', label:'JAM — 60 Second Speaking Test' },
              ].map(pill => <FeaturePill key={pill.label} {...pill} f={f}/>)}
            </div>
          </div>
        </div>

        {/* ── How It Works ─────────────────────────────────────── */}
        <div className="fu1" style={{ marginBottom:28 }}>
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:10, fontWeight:700, color:t.textMuted, letterSpacing:'0.13em', textTransform:'uppercase', margin:0, fontFamily:f }}>Simple Process</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:t.text, margin:'4px 0 0' }}>How It Works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="step-card" style={{ background:t.card, borderRadius:20, padding:'24px', border:`1px solid ${t.border}`, boxShadow:t.shadow }}>
                <div style={{ fontSize:11, fontWeight:800, color:t.accent, letterSpacing:'0.1em', marginBottom:10, fontFamily:f }}>STEP {step}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:t.text, margin:'0 0 8px' }}>{title}</h3>
                <p style={{ fontSize:13, color:t.textSub, margin:0, lineHeight:1.7, fontFamily:f }}>{desc}</p>
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
            <span style={{ fontSize:12, color:t.textMuted, fontFamily:f }}>4 tools available</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
            {tools.map(({ title, icon:Icon, color, tint, badge, badgeColor, to, features, desc }, i) => (
              <div key={title} className={`tool-card fu${i+1}`}
                style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20, padding:24, position:'relative', overflow:'hidden', boxShadow:t.shadow, cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`${t.shadowHov},0 0 0 1px ${color}20` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=t.border; e.currentTarget.style.boxShadow=t.shadow }}>

                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at top right,${tint},transparent 62%)`, pointerEvents:'none', borderRadius:20 }}/>

                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                    <div style={{ width:46, height:46, borderRadius:13, background:`${color}16`, border:`1px solid ${color}26`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={21} color={color}/>
                    </div>
                    <span style={{ padding:'3px 9px', borderRadius:18, background:`${badgeColor}14`, border:`1px solid ${badgeColor}24`, fontSize:10, fontWeight:700, color:badgeColor, fontFamily:f }}>{badge}</span>
                  </div>

                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:t.text, margin:'0 0 7px' }}>{title}</h3>
                  <p style={{ fontSize:12.5, color:t.textSub, margin:'0 0 14px', lineHeight:1.65, fontFamily:f }}>{desc}</p>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
                    {features.map(ft => (
                      <span key={ft} style={{ padding:'3px 9px', borderRadius:7, background:t.surface, fontSize:10.5, fontWeight:600, color:t.textSub, fontFamily:f }}>{ft}</span>
                    ))}
                  </div>

                  <Link to={to} className="cta-btn" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:11, background:`linear-gradient(135deg,${color},${color}cc)`, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:13, boxShadow:`0 3px 12px ${color}28`, fontFamily:f }}>
                    Try Now <ArrowRight size={13}/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip Banner ───────────────────────────────────────── */}
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
            <p style={{ fontSize:13.5, fontWeight:700, color:t.text, margin:'0 0 4px', fontFamily:f }}>💡 Interview Tip</p>
            <p style={{ fontSize:13, color:t.textSub, margin:0, lineHeight:1.65, fontFamily:f }}>
              In Technical rounds, always explain your <strong>thought process out loud</strong> before jumping to the answer — interviewers value structured thinking over just getting it right.
            </p>
          </div>
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background:dark ? '#050b14' : '#0d1b2a', borderTop:`1px solid ${dark ? '#0e1a2e' : '#152236'}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px 28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${t.accent},${t.teal})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Zap size={15} color="#fff"/>
                </div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:14, color:'#fff' }}>AI Recruitment Simulator</span>
              </div>
              <p style={{ fontSize:12.5, color:'rgba(255,255,255,0.34)', lineHeight:1.75, maxWidth:270, margin:'0 0 20px', fontFamily:f }}>
                Free AI-powered recruitment prep — no signup, no database, no tracking. Just practice.
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
              { title:'Practice', links:['Resume Analyzer','Interview Simulator','GD Simulator','JAM Session'] },
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
