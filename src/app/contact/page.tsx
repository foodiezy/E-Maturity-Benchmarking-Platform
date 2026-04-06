'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) setIsSuccess(true)
      else setErrorMsg("Failed to send message. Please try again.")
    } catch(err) {
      setErrorMsg("An unexpected error occurred.")
    }
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner shadow-green-200">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Message Sent!</h2>
        <p className="text-xl text-slate-600 max-w-lg mx-auto">Thank you for reaching out. A consultant will review your message and get back to you shortly.</p>
        <div className="mt-12">
          <button onClick={() => {setIsSuccess(false); setFormData({name:'', email:'', message:''})}} className="px-8 py-4 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors shadow-sm">
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="mt-3 text-lg text-slate-600">Have questions about our AIMM maturity assessments? We're here to help.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl font-medium text-sm">
            {errorMsg}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 focus:bg-white transition-all" placeholder="Jane Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 focus:bg-white transition-all" placeholder="jane@example.com" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Your Message</label>
          <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 focus:bg-white transition-all resize-none" placeholder="How can we help you achieve digital maturity?" />
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:hover:-translate-y-0 shadow-lg shadow-primary-600/30 transition-all hover:-translate-y-0.5">
          {isSubmitting ? 'Sending securely...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
