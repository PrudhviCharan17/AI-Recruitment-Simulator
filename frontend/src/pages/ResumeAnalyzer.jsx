import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import {
  Upload, FileText, X, Loader2, CheckCircle, AlertCircle,
  TrendingUp, Award, Target, ChevronDown, ChevronUp,
  Star, AlertTriangle, Info, Briefcase, GraduationCap,
  Code, User, Mail, Phone, MapPin, Github, Linkedin,
  Building2, ExternalLink, IndianRupee, Clock, Zap, Trophy, Filter, RefreshCw,
  Copy, Check, Wand2, RotateCcw
} from 'lucide-react'

// ─── Circle ATS Gauge ──────────────────────────────────────────────────
function CircleGauge({ score }) {
  const [animScore, setAnimScore] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const target = Number(score) || 0
    cancelAnimationFrame(rafRef.current)
    if (target === 0) { setAnimScore(0); return }
    let start = null
    const duration = 1400
    const tick = (ts) => {
      if (!start) start = ts
      const p     = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setAnimScore(Math.round(eased * target))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const size   = 160
  const stroke = 12
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (animScore / 100) * circ

  const color = animScore >= 80 ? '#16a34a'
    : animScore >= 60 ? '#3b82f6'
    : animScore >= 40 ? '#ca8a04'
    : '#dc2626'

  const label = animScore >= 80 ? 'Excellent'
    : animScore >= 60 ? 'Good'
    : animScore >= 40 ? 'Average'
    : 'Needs Work'

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold leading-none" style={{ color }}>{animScore}</span>
          <span className="text-xs text-gray-400 mt-1">/100</span>
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
      <span className="text-xs text-gray-400">ATS Score</span>
    </div>
  )
}

// ─── Mini Score Bar ────────────────────────────────────────────────────
function ScoreBar({ label, score }) {
  const s = Number(score) || 0
  const color = s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-blue-500' : s >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${s}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{s}</span>
    </div>
  )
}

// ─── Collapsible Section ───────────────────────────────────────────────
function Section({ title, icon: Icon, children, defaultOpen = true, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card mb-4 transition-all duration-200 hover:shadow-md">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon size={16} className="text-accent" />
          <h3 className="font-display font-semibold text-primary-500">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-semibold">{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

// ─── Upload Zone ───────────────────────────────────────────────────────
function UploadZone({ onFileSelect, file, onRemove }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) onFileSelect(acceptedFiles[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  if (file) {
    return (
      <div className="border-2 border-green-300 bg-green-50 rounded-2xl p-6 flex items-center justify-between transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button onClick={onRemove} className="p-2 hover:bg-green-100 rounded-lg transition-colors">
          <X size={16} className="text-green-700" />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
        ${isDragActive ? 'border-accent bg-red-50 scale-[1.01]' : 'border-surface-300 hover:border-accent hover:bg-surface-50 hover:shadow-md'}`}
    >
      <input {...getInputProps()} />
      <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Upload size={24} className="text-gray-400" />
      </div>
      <p className="font-semibold text-primary-500">Drop your resume here</p>
      <p className="text-sm text-gray-400 mt-1">or click to browse — PDF, DOCX, TXT (max 5MB)</p>
    </div>
  )
}

// ─── Match Score Badge ─────────────────────────────────────────────────
function MatchBadge({ score }) {
  const cfg =
    score >= 75 ? { bg: 'bg-green-100', text: 'text-green-700', label: 'Great Match' } :
    score >= 50 ? { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Good Match'  } :
    score >= 30 ? { bg: 'bg-yellow-100',text: 'text-yellow-700',label: 'Partial Match'} :
                  { bg: 'bg-red-100',   text: 'text-red-700',   label: 'Low Match'   }
  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} shrink-0`}>
      <Trophy size={10} />
      <span>{score}% — {cfg.label}</span>
    </div>
  )
}


// ─── Write Mail Panel ─────────────────────────────────────────────────
function WriteMailPanel({ job, resumeData, onClose }) {
  const [mail,    setMail]    = useState('')
  const [loading, setLoading] = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [ready,   setReady]   = useState(false)

  const generate = async () => {
    setLoading(true)
    setReady(false)
    setMail('')
    setCopied(false)
    try {
      const c      = resumeData?.candidate || {}
      const skills = [
        ...(resumeData?.skills?.technical || []),
        ...(resumeData?.skills?.languages || []),
        ...(resumeData?.skills?.tools     || []),
      ].slice(0, 8).join(', ')
      const exp = (resumeData?.experience || [])
        .map(e => `${e.role} at ${e.company} (${e.duration})`)
        .slice(0, 3).join('; ')
      const jobDesc = (job.job_description || '').slice(0, 600)

      const res = await fetch('/api/mail/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name:  c.name || '',
          candidate_email: c.email || '',
          skills,
          experience:      exp,
          job_title:       job.job_title || '',
          employer_name:   job.employer_name || '',
          job_city:        job.job_city || '',
          job_description: jobDesc,
        })
      })
      const data = await res.json()
      if (!data.success) throw new Error('failed')
      setMail(data.mail)
      setReady(true)
    } catch {
      setMail('Could not generate — please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { generate() }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(mail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50/30 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-blue-100">
        <div className="flex items-center gap-1.5">
          <Mail size={12} className="text-accent" />
          <span className="text-xs font-bold text-primary-500">Application Email Draft</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-surface-100 rounded-lg transition-colors">
          <X size={12} className="text-gray-400" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-7 gap-2">
          <Loader2 size={20} className="text-accent animate-spin" />
          <p className="text-xs text-gray-400">Writing email from your resume + job details...</p>
        </div>
      ) : (
        <>
          <textarea
            value={mail}
            onChange={e => setMail(e.target.value)}
            rows={11}
            className="w-full px-4 py-3 text-xs text-gray-700 leading-relaxed bg-transparent border-none outline-none resize-none font-mono"
          />
          <div className="flex items-center gap-2 px-3 pb-3 border-t border-blue-100 pt-2.5">
            <button
              onClick={handleCopy}
              disabled={!ready}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95
                ${copied ? 'bg-green-100 text-green-700' : 'bg-accent text-white hover:opacity-90 disabled:opacity-40'}`}
            >
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy Email</>}
            </button>
            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-100 text-gray-600 hover:bg-surface-200 transition-all active:scale-95"
            >
              <RotateCcw size={11} /> Rewrite
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Job Opening Card ──────────────────────────────────────────────────
function JobCard({ job, rank, candidateEmail, resumeData }) {
  const [expanded, setExpanded] = useState(false)
  const [showMail, setShowMail] = useState(false)
  const ms = job.match_score || 0
  const rankColors = ['bg-yellow-400', 'bg-slate-300', 'bg-amber-600']
  const rankBg   = rank <= 3 ? rankColors[rank - 1] : 'bg-surface-200'
  const rankText = rank <= 3 ? 'text-slate-800' : 'text-gray-500'

  const USD_TO_INR = 83.5
  const toINR = (usd) => {
    const inr = usd * USD_TO_INR
    if (inr >= 10000000) return `₹${(inr/10000000).toFixed(1)}Cr`
    if (inr >= 100000)   return `₹${(inr/100000).toFixed(1)}L`
    return `₹${Math.round(inr/1000)}k`
  }
  const hasSalary = job.job_min_salary || job.job_max_salary
  const period = job.job_salary_period ? `/${job.job_salary_period.toLowerCase()}` : '/yr'
  let salaryText = 'Salary not disclosed'
  if (job.job_min_salary && job.job_max_salary)
    salaryText = `${toINR(job.job_min_salary)}–${toINR(job.job_max_salary)}${period}`
  else if (job.job_min_salary)
    salaryText = `From ${toINR(job.job_min_salary)}${period}`
  else if (job.job_max_salary)
    salaryText = `Up to ${toINR(job.job_max_salary)}${period}`

  return (
    <div>
      <div className={`rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden
        ${ms >= 75 ? 'border-green-200 bg-green-50/40' :
          ms >= 50 ? 'border-blue-200 bg-blue-50/20'   :
                     'border-surface-200 bg-white'}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${rankBg} ${rankText}`}>
              #{rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-primary-500 text-sm leading-snug">{job.job_title}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Building2 size={11} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 font-medium">{job.employer_name}</span>
                    {job.job_city && (
                      <>
                        <span className="text-gray-300">·</span>
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500">
                          {job.job_city}{job.job_country ? `, ${job.job_country}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <MatchBadge score={ms} />
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {job.job_employment_type && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 bg-surface-100 px-2 py-0.5 rounded-full">
                    <Clock size={10} />{job.job_employment_type.replace(/_/g, ' ')}
                  </span>
                )}
                {job.job_is_remote && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                    <Zap size={10} /> Remote
                  </span>
                )}
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold
                  ${hasSalary ? 'bg-green-50 text-green-700' : 'bg-surface-100 text-gray-400'}`}>
                  <IndianRupee size={10} />
                  {salaryText}
                </span>
              </div>

              {job.match_reason && (
                <p className="text-xs text-gray-400 mt-1.5 italic">{job.match_reason}</p>
              )}

              {expanded && job.job_description && (
                <div className="mt-3 text-xs text-gray-600 leading-relaxed bg-white rounded-xl p-3 border border-surface-200 max-h-44 overflow-y-auto">
                  {job.job_description.slice(0, 700)}{job.job_description.length > 700 ? '…' : ''}
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  <Info size={11} />
                  {expanded ? 'Hide details' : 'View description'}
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setShowMail(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-semibold active:scale-95 transition-all border
                      ${showMail
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface-100 text-gray-600 border-surface-200 hover:bg-surface-200'}`}
                  >
                    <Wand2 size={11} /> {showMail ? 'Hide Email' : 'Write Mail'}
                  </button>
                  {job.job_apply_link && (
                    <a
                      href={job.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
                    >
                      Apply Now <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMail && (
        <WriteMailPanel
          job={job}
          resumeData={resumeData}
          onClose={() => setShowMail(false)}
        />
      )}
    </div>
  )
}
// ─── Live Job Openings ─────────────────────────────────────────────────
// Calls your own FastAPI /api/jobs endpoint (proxy) — no CORS, no exposed key
function JobOpenings({ jobRole, activeRole, resumeSkills, candidateEmail, resumeData }) {
  // activeRole = clicked pill (resume-based). jobRole = typed. Prefer activeRole.
  const resolvedRole = activeRole || jobRole
  const [jobs,         setJobs]        = useState([])
  const [loading,      setLoading]     = useState(false)
  const [error,        setError]       = useState(null)
  const [fetched,      setFetched]     = useState(false)
  const [filterRemote, setFilterRemote]= useState(false)
  const [location,     setLocation]    = useState('')

  const scoreAndSort = (raw) => {
    const skills = [
      ...(resumeSkills?.technical || []),
      ...(resumeSkills?.tools     || []),
      ...(resumeSkills?.languages || []),
    ].map(s => s.toLowerCase())

    return raw
      .map(job => {
        const desc  = (job.job_description || '').toLowerCase()
        const title = (job.job_title       || '').toLowerCase()
        const role  = resolvedRole.toLowerCase()

        const matched = skills.filter(s => desc.includes(s) || title.includes(s))
        const skillPct = skills.length > 0 ? Math.round((matched.length / skills.length) * 100) : 0

        let bonus = 0
        if (job.job_is_remote) bonus += 5
        if (title.includes(role)) bonus += 15
        if (job.job_min_salary || job.job_max_salary) bonus += 5

        const match_score  = Math.min(skillPct + bonus, 99)
        const match_reason = matched.length > 0
          ? `Matches your skills: ${matched.slice(0, 4).join(', ')}`
          : 'Aligned with your target job title'

        return { ...job, match_score, match_reason }
      })
      .sort((a, b) => b.match_score - a.match_score)
  }

  const fetchJobs = useCallback(async () => {
    if (!resolvedRole) return
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/jobs', {
        params: { query: resolvedRole, remote: filterRemote, location: location.trim() || undefined },
        timeout: 30000,
      })
      setJobs(scoreAndSort(res.data?.data || []))
      setFetched(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not fetch jobs. Check that JSEARCH_API_KEY is set in your server .env')
    } finally {
      setLoading(false)
    }
  }, [resolvedRole, filterRemote])

  // Re-fetch when role or remote toggle changes (after first fetch)
  useEffect(() => { if (fetched) fetchJobs() }, [resolvedRole, filterRemote, location])
  // Auto-fetch when activeRole changes (pill click)
  useEffect(() => { if (activeRole) { setFetched(false); setJobs([]) } }, [activeRole])

  if (!resolvedRole) return (
    <div className="border-2 border-dashed border-surface-300 rounded-2xl text-center py-10 px-6">
      <Briefcase size={30} className="text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-semibold text-gray-400">Enter a target job role above to see live openings</p>
      <p className="text-xs text-gray-300 mt-1">Powered by JSearch · RapidAPI</p>
    </div>
  )

  if (!fetched) return (
    <div className="text-center py-10">
      <Briefcase size={30} className="text-accent mx-auto mb-3" />
      <p className="text-sm font-semibold text-primary-500 mb-1">Ready to find live openings for</p>
      <p className="text-base font-bold text-accent mb-3">"{resolvedRole}"</p>
      <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
        Jobs will be ranked by how closely they match your resume skills
      </p>
      <button onClick={fetchJobs} disabled={loading} className="btn-primary flex items-center gap-2 mx-auto">
        {loading
          ? <><Loader2 size={15} className="animate-spin" /> Finding matches...</>
          : <><Zap size={16} /> Find Matching Jobs</>}
      </button>
      {loading && (
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          {['Searching live job boards...', 'Matching against your skills...', 'Ranking by compatibility...'].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-surface-50 rounded-xl px-4 py-2">
              <Loader2 size={11} className="animate-spin text-accent shrink-0" />{s}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">{jobs.length} openings · ranked by resume match</span>
          <button
            onClick={() => setFilterRemote(v => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all
              ${filterRemote
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-surface-100 text-gray-500 border-surface-200 hover:border-green-300'}`}
          >
            <Filter size={10} /> Remote only
          </button>
          <div className="flex items-center gap-1 border border-surface-200 rounded-full bg-surface-50 px-2.5 py-1 hover:border-accent transition-colors">
            <MapPin size={10} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetched && fetchJobs()}
              placeholder="City or Remote..."
              className="text-xs bg-transparent outline-none text-gray-600 placeholder-gray-300 w-28"
            />
            {location && (
              <button onClick={() => setLocation('')} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X size={10} />
              </button>
            )}
          </div>
        </div>
        <button onClick={fetchJobs} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-500 transition-colors">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm mb-4">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Job fetch failed</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <Loader2 size={26} className="text-accent animate-spin" />
          <p className="text-sm text-gray-400">Fetching and scoring live jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center py-10 text-gray-400 text-sm">No jobs found. Try refreshing.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => <JobCard key={job.job_id || i} job={job} rank={i + 1} candidateEmail={candidateEmail} resumeData={resumeData} />)}
        </div>
      )}
    </div>
  )
}

// ─── Results Display ───────────────────────────────────────────────────
function Results({ data, jobRole }) {
  const [selectedResumeRole, setSelectedResumeRole] = useState(null)
  const {
    candidate, ats_score, skills, experience, education,
    strengths, weaknesses, missing_sections, improvement_suggestions,
    resume_based_roles, verdict, summary,
  } = data

  const verdictColor = {
    'Strong':     'bg-green-100 text-green-700',
    'Good':       'bg-blue-100 text-blue-700',
    'Average':    'bg-yellow-100 text-yellow-700',
    'Needs Work': 'bg-red-100 text-red-700',
  }[verdict] || 'bg-gray-100 text-gray-700'

  return (
    <div className="space-y-4 animate-fade-in-up">

      {/* ── Overview: Gauge + Candidate ── */}
      <div className="card transition-all duration-200 hover:shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          <div className="shrink-0">
            <CircleGauge score={Number(ats_score?.overall) || 0} />
          </div>

          {/* Candidate Info */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                <User size={22} className="text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-primary-500">
                  {candidate?.name || 'Candidate'}
                </h2>
                <span className={`badge ${verdictColor} mt-1`}>{verdict}</span>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-gray-500">
              {candidate?.email    && <div className="flex items-center gap-2"><Mail    size={13} />{candidate.email}</div>}
              {candidate?.phone    && <div className="flex items-center gap-2"><Phone   size={13} />{candidate.phone}</div>}
              {candidate?.location && <div className="flex items-center gap-2"><MapPin  size={13} />{candidate.location}</div>}
              {candidate?.linkedin && <div className="flex items-center gap-2"><Linkedin size={13} />{candidate.linkedin}</div>}
              {candidate?.github   && <div className="flex items-center gap-2"><Github  size={13} />{candidate.github}</div>}
            </div>
            {summary && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed italic border-l-2 border-accent pl-3">
                {summary}
              </p>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        {ats_score?.breakdown && (
          <div className="mt-6 pt-6 border-t border-surface-200">
            <p className="section-label mb-3">Score Breakdown</p>
            <div className="space-y-2">
              {Object.entries(ats_score.breakdown).map(([key, val]) => (
                <ScoreBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} score={val} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Recommended Job Roles — resume-based only ── */}
      {resume_based_roles?.length > 0 && (
        <Section title="Recommended Job Roles" icon={Target} defaultOpen badge="Based on Resume">
          <p className="text-xs text-gray-400 mb-3">
            Derived from your skills, experience &amp; education — not influenced by the target role you entered
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Click any role below to instantly see matching live job openings ↓
          </p>
          <div className="flex flex-wrap gap-2">
            {resume_based_roles.map((role, i) => {
              const isActive = selectedResumeRole === role
              return (
                <button key={i} onClick={() => setSelectedResumeRole(isActive ? null : role)}
                  className={`badge px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-200
                    hover:shadow-md hover:-translate-y-0.5 border-2
                    ${isActive
                      ? 'bg-accent text-white border-accent shadow-md scale-[1.04]'
                      : 'bg-primary-500 text-white border-transparent hover:bg-accent hover:border-accent'}`}>
                  {role}{isActive ? ' ✓' : ''}
                </button>
              )
            })}
          </div>
          {selectedResumeRole && (
            <p className="text-xs text-accent mt-3 font-semibold animate-pulse">
              ↓ Showing live openings for "{selectedResumeRole}"
            </p>
          )}
        </Section>
      )}

      {/* ── Live Job Openings ── */}
      <Section
        title="Live Job Openings"
        icon={Briefcase}
        defaultOpen
        badge={selectedResumeRole ? `Resume: ${selectedResumeRole}` : jobRole ? `Target: ${jobRole}` : 'Click a role above'}
      >
        <JobOpenings
          jobRole={jobRole}
          activeRole={selectedResumeRole}
          resumeSkills={skills}
          candidateEmail={candidate?.email}
          resumeData={data}
        />
      </Section>

      {/* ── Skills ── */}
      {skills && (
        <Section title="Skills" icon={Code}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.technical?.length > 0 && (
              <div>
                <p className="section-label mb-2">Technical</p>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map(s => <span key={s} className="badge bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">{s}</span>)}
                </div>
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div>
                <p className="section-label mb-2">Tools</p>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map(s => <span key={s} className="badge bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">{s}</span>)}
                </div>
              </div>
            )}
            {skills.languages?.length > 0 && (
              <div>
                <p className="section-label mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map(s => <span key={s} className="badge bg-green-50 text-green-700 font-mono hover:bg-green-100 transition-colors">{s}</span>)}
                </div>
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <p className="section-label mb-2">Soft Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map(s => <span key={s} className="badge bg-surface-100 text-gray-600 hover:bg-surface-200 transition-colors">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── Experience ── */}
      {experience?.length > 0 && (
        <Section title="Experience" icon={Briefcase}>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="flex gap-4 p-4 bg-surface-50 rounded-xl transition-all duration-200 hover:bg-surface-100 hover:shadow-sm">
                <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase size={14} className="text-primary-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-primary-500">{exp.role}</p>
                      <p className="text-sm text-gray-500">{exp.company} · {exp.duration}</p>
                    </div>
                    {exp.impact_score !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-500">{exp.impact_score}/10</span>
                      </div>
                    )}
                  </div>
                  {exp.highlights?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-accent mt-1.5">•</span>{h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Education ── */}
      {education?.length > 0 && (
        <Section title="Education" icon={GraduationCap}>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex gap-3 p-4 bg-surface-50 rounded-xl transition-all duration-200 hover:bg-surface-100 hover:shadow-sm">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap size={14} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-primary-500">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.institution} · {edu.year}</p>
                  {edu.gpa && <p className="text-xs text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Strengths & Weaknesses ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths?.length > 0 && (
          <div className="card transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-green-500" />
              <h3 className="font-display font-semibold text-primary-500">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {weaknesses?.length > 0 && (
          <div className="card transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-yellow-500" />
              <h3 className="font-display font-semibold text-primary-500">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500 font-bold mt-0.5">!</span>{w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Improvement Suggestions ── */}
      {improvement_suggestions?.length > 0 && (
        <Section title="Improvement Suggestions" icon={TrendingUp}>
          <div className="space-y-3">
            {improvement_suggestions.map((item, i) => {
              const s = {
                high:   'bg-red-50 border-red-200 text-red-700',
                medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                low:    'bg-green-50 border-green-200 text-green-700',
              }[item.priority?.toLowerCase()] || 'bg-surface-50 border-surface-200 text-gray-600'
              return (
                <div key={i} className={`p-4 rounded-xl border ${s} transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">{item.priority}</span>
                    <span className="text-xs opacity-60">·</span>
                    <span className="text-xs font-semibold">{item.section}</span>
                  </div>
                  <p className="text-sm">{item.suggestion}</p>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Missing Sections ── */}
      {missing_sections?.length > 0 && (
        <div className="card border-l-4 border-yellow-400 bg-yellow-50 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Missing Sections</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing_sections.map((s, i) => (
              <span key={i} className="badge bg-yellow-100 text-yellow-700">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [file,    setFile]    = useState(null)
  const [jobRole, setJobRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_role', jobRole)

    try {
      const res = await axios.post('/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <span className="section-label">Feature 01</span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-500 mt-1">Resume Analyzer</h1>
        <p className="text-gray-500 mt-1">ATS score, live job matches, skill gaps &amp; actionable improvements</p>
      </div>

      {!result && (
        <div className="card mb-6 animate-fade-in-up hover:shadow-lg transition-all duration-200">
          <h2 className="font-display font-semibold text-primary-500 mb-4">Upload Resume</h2>
          <UploadZone file={file} onFileSelect={setFile} onRemove={() => setFile(null)} />
          <div className="mt-4">
            <label className="section-label block mb-1.5">Target Job Role (Optional)</label>
            <input
              type="text"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, Data Analyst..."
              className="w-full px-4 py-3 rounded-xl border border-surface-300 text-sm focus:outline-none focus:border-accent transition-colors bg-surface-50"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Used for improvement tips &amp; live job openings.
              Job <em>recommendations</em> always come from your resume.
            </p>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />{error}
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Analyzing with Qwen3 32B...</>
              : <><Award size={18} /> Analyze Resume</>}
          </button>
        </div>
      )}

      {loading && (
        <div className="card text-center py-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 size={28} className="text-accent animate-spin" />
          </div>
          <p className="font-display font-semibold text-primary-500">Analyzing your resume...</p>
          <p className="text-sm text-gray-400 mt-1">Qwen3 32B is extracting skills, scoring ATS compatibility...</p>
          <div className="flex justify-center gap-1 mt-6">
            {['Parsing...', 'Scoring...', 'Generating insights...'].map((step, i) => (
              <span key={i} className="animate-shimmer px-3 py-1 rounded-full text-xs text-gray-400">{step}</span>
            ))}
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="font-semibold text-sm">Analysis Complete</span>
            </div>
            <button
              onClick={() => { setResult(null); setFile(null); setJobRole('') }}
              className="btn-secondary text-sm py-2 px-4"
            >
              Analyze Another
            </button>
          </div>
          <Results data={result} jobRole={jobRole} />
        </>
      )}
    </div>
  )
}
