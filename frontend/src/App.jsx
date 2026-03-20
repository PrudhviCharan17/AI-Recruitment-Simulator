import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import InterviewSim from './pages/InterviewSim'
import GDSimulator from './pages/GDSimulator'
import JamSession from './pages/JamSession'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="interview" element={<InterviewSim />} />
        <Route path="gd" element={<GDSimulator />} />
        <Route path="/jam" element={<JamSession />} />
      </Route>
    </Routes>
  )
}
