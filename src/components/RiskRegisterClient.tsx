'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RiskRegisterClient({ organizations }: { organizations: any[] }) {
  const router = useRouter()
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '')
  
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ description: '', status: 'Open', probability: 5, impact: 5, mitigationPlan: '' })

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!selectedOrgId) return alert("Select an organisation first.")
    
    const res = await fetch('/api/risks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, organizationId: selectedOrgId })
    })

    if(res.ok) {
      setShowAdd(false)
      setForm({ description: '', status: 'Open', probability: 5, impact: 5, mitigationPlan: '' })
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this risk log?")) return
    await fetch(`/api/risks?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  // Exact math logic matching user's Excel model
  const getRiskCategory = (prob: number, impact: number) => {
    const score = prob * impact
    if (score >= 80) return { label: 'Jeopardy', desc: 'Immanent Closure - Requires immediate attention', bg: 'bg-red-800 text-white', dot: 'bg-red-400' }
    if (score >= 60) return { label: 'High', desc: 'Disruption likely - Requires attention and managed', bg: 'bg-red-500 text-white', dot: 'bg-red-200' }
    if (score >= 50) return { label: 'Medium', desc: 'Possible disruption - Needs to be managed', bg: 'bg-amber-500 text-white', dot: 'bg-amber-200' }
    return { label: 'Low', desc: 'No disruption likely - Needs to be monitored', bg: 'bg-emerald-500 text-white', dot: 'bg-emerald-200' }
  }

  const activeOrg = organizations.find((o:any) => o.id === selectedOrgId)
  const risks = activeOrg?.risks || []

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Organisation Context</label>
          <select 
            value={selectedOrgId} 
            onChange={e => setSelectedOrgId(e.target.value)}
            className="w-full sm:w-96 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/20 outline-none"
          >
            {organizations.map((org:any) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 whitespace-nowrap"
        >
          + Log New Risk
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl animate-in slide-in-from-top-4 duration-300 border border-slate-800">
          <h2 className="text-xl font-bold mb-6">Log New Risk Incidence</h2>
          <form onSubmit={handleAddRisk} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Risk Description</label>
              <input required type="text" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Budget overruns during implementation" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Probability (1-10)</label>
              <input required type="number" min="1" max="10" value={form.probability} onChange={e=>setForm({...form, probability: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-black text-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Impact (1-10)</label>
              <input required type="number" min="1" max="10" value={form.impact} onChange={e=>setForm({...form, impact: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-black text-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mitigation Plan</label>
              <textarea required rows={3} value={form.mitigationPlan} onChange={e=>setForm({...form, mitigationPlan: e.target.value})} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Action plan to reduce or control this risk..." />
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">Save Risk Log</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Risk Description</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Score</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">RRAG Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Mitigation Plan</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {risks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No active risks registered for this organisation.
                  </td>
                </tr>
              ) : risks.map((r:any) => {
                const cat = getRiskCategory(r.probability, r.impact)
                const percent = r.probability * r.impact
                
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-slate-800 w-1/4">
                      {r.description}
                      <div className="text-xs font-semibold text-slate-400 mt-1 uppercase">Logged: {new Date(r.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-slate-900">{percent}%</span>
                        <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">{r.probability} Prob × {r.impact} Imp</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 w-64">
                      <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${cat.bg}`}>
                        <div className={`w-2 h-2 rounded-full ${cat.dot} animate-pulse`} />
                        <div>
                          <div className="font-extrabold text-sm tracking-wide">{cat.label} Risk</div>
                          <div className="text-[0.65rem] opacity-90 font-medium leading-tight mt-0.5">{cat.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium leading-relaxed">
                      {r.mitigationPlan}
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 font-bold text-sm">
                        Dismiss
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
