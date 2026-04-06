'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Invalid credentials. Please verify your email and password.")
      setIsLoading(false)
    } else {
      router.push('/consultant')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mx-4">
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-indigo-600 rounded-3xl mb-8 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Organization Logon</h1>
        <p className="text-slate-500 font-medium mb-8">Sign in to your AIMM provider account</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
              placeholder="admin@aimm.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Secure Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all hover:-translate-y-0.5 mt-4 text-lg tracking-wide"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Not registered with us yet?{' '}
          <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
            Create an Organisation Account
          </a>
        </div>
      </div>
    </div>
  )
}
