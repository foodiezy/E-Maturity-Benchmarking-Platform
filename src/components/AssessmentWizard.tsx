'use client'

import { useState, useEffect } from 'react'

export default function AssessmentWizard({ model }: { model: any }) {
  const [currentDimIdx, setCurrentDimIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  
  // Demographics state
  const [showDemographics, setShowDemographics] = useState(true)
  const [jobLevel, setJobLevel] = useState('')
  const [department, setDepartment] = useState('')

  // Scroll to top when dimension changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentDimIdx])

  const dimension = model.dimensions[currentDimIdx]
  if (!dimension) return null

  const isLast = currentDimIdx === model.dimensions.length - 1

  const handleScore = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }))
  }

  const handleNext = () => {
    if (!isLast) setCurrentDimIdx(p => p + 1)
  }

  const handlePrev = () => {
    if (currentDimIdx > 0) setCurrentDimIdx(p => p - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          answers, // { [questionId]: score }
          jobLevel,
          department
        })
      })
      if (res.ok) setIsDone(true)
      else alert("Failed to submit assessment")
    } catch(err) {
      alert("Error submitting assessment")
    }
    setIsSubmitting(false)
  }

  if (isDone) {
    return (
      <div className="text-center py-20 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-iner shadow-green-200">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Assessment Completed!</h2>
        <p className="text-xl text-slate-600 max-w-lg mx-auto">Your responses have been successfully recorded. The consultant will review your comprehensive maturity score!</p>
        <div className="mt-12">
          <a href="/assessment" className="px-8 py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const currentQIds = dimension.questions.map((q: any) => q.id)
  const allAnswered = currentQIds.every((id: string) => answers[id] !== undefined)

  if (showDemographics) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Before we begin</h2>
          <p className="text-lg text-slate-500">Please provide your role details so we can accurately segment the maturity findings.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">What is your Job Level?</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700"
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
            >
              <option value="" disabled>Select Job Level</option>
              <option value="Senior Management">Senior Management (C-Suite, VP, Director)</option>
              <option value="Management">Management (Manager, Lead, Supervisor)</option>
              <option value="Workforce">Workforce (Individual Contributor, Staff)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">What is your Department?</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled>Select Department</option>
              <option value="IT/Technology">IT / Technology</option>
              <option value="Operations">Operations</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Sales/Marketing">Sales & Marketing</option>
              <option value="Product">Product</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={() => setShowDemographics(false)}
              disabled={!jobLevel || !department}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 ease-out fill-mode-both" key={dimension.id}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary-500 uppercase bg-primary-50 px-2 py-1 rounded">
            Part {currentDimIdx + 1} of {model.dimensions.length}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{dimension.name} Benchmarking</h2>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl whitespace-nowrap">
          {dimension.questions.length} Metrics
        </div>
      </div>

      <div className="space-y-8">
        {dimension.questions.map((q: any, i: number) => (
          <div key={q.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary-300 transition-colors shadow-sm">
            <p className="text-[1.1rem] font-semibold text-slate-800 mb-6 flex gap-3 leading-relaxed">
              <span className="text-primary-500 bg-primary-50 w-8 h-8 flex-shrink-0 flex justify-center items-center rounded-lg">{i+1}</span>
              <span className="mt-1">{q.text}</span>
            </p>
            <div className="flex flex-wrap grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {[1, 2, 3, 4, 5].map(score => {
                const isSelected = answers[q.id] === score;
                const desc = dimension.levelDescriptions.find((l:any) => l.level === score)?.name || `Level ${score}`
                
                const cardBg = score === 1 ? 'border-red-200 bg-red-50 text-red-900 border-2' :
                               score === 2 ? 'border-orange-200 bg-orange-50 text-orange-900 border-2' :
                               score === 3 ? 'border-amber-200 bg-amber-50 text-amber-900 border-2' :
                               score === 4 ? 'border-blue-200 bg-blue-50 text-blue-900 border-2' :
                                             'border-emerald-200 bg-emerald-50 text-emerald-900 border-2'
                const hoverBg = score === 1 ? 'hover:bg-red-50 hover:border-red-300' :
                                score === 2 ? 'hover:bg-orange-50 hover:border-orange-300' :
                                score === 3 ? 'hover:bg-amber-50 hover:border-amber-300' :
                                score === 4 ? 'hover:bg-blue-50 hover:border-blue-300' :
                                              'hover:bg-emerald-50 hover:border-emerald-300'
                const badgeColor = score === 1 ? 'text-red-600' :
                                   score === 2 ? 'text-orange-600' :
                                   score === 3 ? 'text-amber-600' :
                                   score === 4 ? 'text-blue-600' :
                                                 'text-emerald-600'

                return (
                  <button
                    key={score}
                    onClick={() => handleScore(q.id, score)}
                    className={`flex-1 min-w-[140px] py-4 px-4 rounded-xl transition-all font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                      isSelected 
                        ? `${cardBg} scale-[1.02] shadow-md z-10 relative` 
                        : `border-2 border-slate-200 bg-white text-slate-600 ${hoverBg}`
                    }`}
                  >
                    <div className={`text-2xl font-black mb-1.5 ${isSelected ? badgeColor : 'text-slate-400'}`}>{score}</div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-90">{desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentDimIdx === 0}
          className="w-full sm:w-auto px-8 py-4 font-bold text-slate-600 border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
        >
          Previous Section
        </button>
        
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="w-full sm:w-auto px-10 py-4 font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:translate-y-0 rounded-xl shadow-xl shadow-green-600/30 hover:-translate-y-1 transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Complete & Submit'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="w-full sm:w-auto px-10 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:translate-y-0 rounded-xl shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all"
          >
            Next Section
          </button>
        )}
      </div>
    </div>
  )
}
