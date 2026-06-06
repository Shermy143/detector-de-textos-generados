/* Application root — layout and state orchestration */
import { useState, useCallback } from 'react'
import './App.css'

import Navbar       from './components/Navbar/Navbar'
import Sidebar      from './components/Sidebar/Sidebar'
import Editor       from './components/Editor/Editor'
import ResultsPanel from './components/ResultsPanel/ResultsPanel'
import Footer       from './components/Footer/Footer'

import { analyzeText } from './services/api'

export default function App() {
  const [text,    setText]   = useState('')
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

  return (
    <div className="app">
      <Navbar />

      {/* Hero section */}
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero__eyebrow">Universidad de Guayaquil · IA</p>
        <h1 className="hero__title" id="hero-title">
          Detecta si un texto fue<br />
          escrito por <span>Inteligencia Artificial</span>
        </h1>
        <p className="hero__subtitle">
          Motor neuronal basado en mStyleDistance entrenado para detectar textos en español
          generados por modelos como GPT-4, Gemini o LLaMA con 98% de precisión.
        </p>
      </section>

      {/* Main detector */}
      <main id="detector" className="detector" aria-label="Detector de texto IA">
        <div className="detector__grid">
          {/* Left: Sidebar info */}
          <Sidebar />

          {/* Right: Editor + Results */}
          <div className="detector__workspace">
            <Editor
              text={text}
              onChange={setText}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
            <ResultsPanel loading={loading} result={result} error={error} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
