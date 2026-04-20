'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Authentication } from "undraw-react"

type OrgOption = { id: string; name: string; _count: { users: number } }

export default function SignUp() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Organisation mode toggle
  const [orgMode, setOrgMode] = useState<'join' | 'create'>('join')
  const [organizations, setOrganizations] = useState<OrgOption[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [orgsLoading, setOrgsLoading] = useState(true)

  // Fetch existing organisations on mount
  useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then((data: OrgOption[]) => {
        setOrganizations(data)
        // If no orgs exist yet, default to "create" mode
        if (!data || data.length === 0) {
          setOrgMode('create')
        }
        setOrgsLoading(false)
      })
      .catch(() => {
        setOrgMode('create')
        setOrgsLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate org selection
    if (orgMode === 'join' && !selectedOrgId) {
      setError('Please select an organisation to join.')
      setIsLoading(false)
      return
    }
    if (orgMode === 'create' && !form.organizationName.trim()) {
      setError('Please enter your organisation name.')
      setIsLoading(false)
      return
    }
    
    try {
      const body: any = {
        name: form.name,
        email: form.email,
        password: form.password,
      }

      if (orgMode === 'join') {
        body.organizationId = selectedOrgId
      } else {
        body.organizationName = form.organizationName
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-16 -mx-4 py-12">
      <div className="hidden lg:flex flex-1 w-full max-w-md justify-center grayscale contrast-200">
        <Authentication color="#000000" style={{ height: '300px' }} />
      </div>

      <div className="bg-white p-8 sm:p-12 w-full max-w-md border-2 border-black flex-1">
        <h1 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase">Register</h1>
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-8">Join or register your Organisation for tracking guidance.</p>
        
        {error && <div className="bg-black text-white p-4 mb-6 font-black uppercase tracking-widest text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organisation Mode Toggle */}
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-3 uppercase tracking-widest">Organisation</label>
            <div className="flex border-2 border-black">
              <button
                type="button"
                onClick={() => setOrgMode('join')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                  orgMode === 'join'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
                disabled={organizations.length === 0}
              >
                Join Existing
              </button>
              <button
                type="button"
                onClick={() => setOrgMode('create')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors border-l-2 border-black ${
                  orgMode === 'create'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                Register New
              </button>
            </div>
          </div>

          {/* Join Existing Org */}
          {orgMode === 'join' && (
            <div>
              <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Select Organisation</label>
              {orgsLoading ? (
                <div className="w-full px-5 py-4 bg-neutral-100 border-2 border-neutral-300 text-neutral-400 text-sm font-bold">Loading organisations...</div>
              ) : (
                <select
                  value={selectedOrgId}
                  onChange={e => setSelectedOrgId(e.target.value)}
                  className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors font-bold appearance-none"
                  required
                >
                  <option value="" disabled>— Select your organisation —</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org._count.users} member{org._count.users !== 1 ? 's' : ''})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Create New Org */}
          {orgMode === 'create' && (
            <div>
              <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Organisation Name</label>
              <input 
                type="text" 
                value={form.organizationName}
                onChange={e => setForm({...form, organizationName: e.target.value})}
                className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
                placeholder="e.g. Acme Corp"
                required={orgMode === 'create'}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Contact Person</label>
            <input 
              type="text" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
              placeholder="john@acme.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white font-black py-5 uppercase tracking-widest text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Registering...' : orgMode === 'join' ? 'Join Organisation' : 'Register Organisation'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">
          Already part of the network?{' '}
          <Link href="/auth/signin" className="text-black hover:underline underline-offset-4 decoration-2">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
