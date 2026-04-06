'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to register account.")
        setIsLoading(false)
      } else {
        router.push('/auth/signin?registered=true')
      }
    } catch(err) {
      setError("Network err. Please check connection.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center -mx-4 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-emerald-600 rounded-3xl mb-8 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create your tracker</h1>
        <p className="text-slate-500 font-medium mb-8">Register your Organisation for AIMM tracking guidance.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Organisation Name</label>
            <input 
              type="text" 
              value={form.organizationName}
              onChange={e => setForm({...form, organizationName: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Contact Person / Rep</label>
            <input 
              type="text" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
              placeholder="john@acme.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Secure Password</label>
            <input 
              type="password" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5 text-lg tracking-wide"
            >
              {isLoading ? 'Encrypting & Saving...' : 'Register Organisation'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already part of the AIMM network?{' '}
          <a href="/auth/signin" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">
            Sign In here
          </a>
        </div>
      </div>
    </div>
  )
}
