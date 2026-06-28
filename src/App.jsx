/* Application root — layout, routing state and inference orchestration */
import { useState, useCallback } from 'react'
import './App.css'

import LandingPage  from './components/LandingPage/LandingPage'
import Navbar       from './components/Navbar/Navbar'
import Editor       from './components/Editor/Editor'
import ResultsPanel from './components/ResultsPanel/ResultsPanel'
import Footer       from './components/Footer/Footer'

import { analyzeText } from './services/api'

export default function App() {
  /* Vista activa: 'landing' | 'detector' */
  const [view,    setView]    = useState('landing')

  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  /* Trigger model inference via backend */
  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeText(text)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [text])

  /* Landing page */
  if (view === 'landing') {
    return (
      <LandingPage
        onContinue={() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
          setView('detector')
        }}
      />
    )
  }

  /* Detector page */
  return (
    <div className="app">
      <Navbar />

      <main id="detector" className="detector" aria-label="Detector de texto IA">
        <div className="detector__workspace">
          <Editor
            text={text}
            onChange={setText}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <ResultsPanel loading={loading} result={result} error={error} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
