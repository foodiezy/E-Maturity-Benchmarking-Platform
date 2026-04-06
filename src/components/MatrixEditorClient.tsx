'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MatrixEditorClient({ initialModel }: { initialModel: any }) {
  const router = useRouter()
  const [model, setModel] = useState(initialModel)
  
  // Modal states
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [detailsForm, setDetailsForm] = useState({ name: model.name, description: model.description || '', version: model.version })
  
  const [isAddingDimension, setIsAddingDimension] = useState(false)
  const [dimName, setDimName] = useState('')

  const [editingDimension, setEditingDimension] = useState<any>(null)
  const [editingLevel, setEditingLevel] = useState<any>(null)

  const handleUpdateDetails = async () => {
    const res = await fetch(`/api/models/${model.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(detailsForm)
    })
    if(res.ok) {
      setModel({...model, ...detailsForm})
      setIsEditingDetails(false)
      router.refresh()
    } else alert("Failed to update.")
  }

  const handleAddDimension = async () => {
    if(!dimName) return
    const res = await fetch(`/api/dimensions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: dimName, maturityModelId: model.id })
    })
    if(res.ok) {
      setDimName('')
      setIsAddingDimension(false)
      router.refresh()
    }
  }

  const handleUpdateDimension = async () => {
    if(!editingDimension) return
    const res = await fetch(`/api/dimensions/${editingDimension.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: editingDimension.name })
    })
    if(res.ok) {
      setEditingDimension(null)
      router.refresh()
    }
  }

  const handleUpdateLevel = async () => {
    if(!editingLevel) return
    const res = await fetch(`/api/levels/${editingLevel.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: editingLevel.name, description: editingLevel.description })
    })
    if(res.ok) {
      setEditingLevel(null)
      router.refresh()
    }
  }

  const handleAddQuestion = async (dimId: string) => {
    const text = prompt("Enter the new criteria/question text:")
    if(!text) return
    const res = await fetch(`/api/questions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text, dimensionId: dimId })
    })
    if(res.ok) router.refresh()
  }

  const handleDeleteQuestion = async (qId: string) => {
    if(!confirm("Are you sure you want to permanently delete this criteria?")) return
    const res = await fetch(`/api/questions/${qId}`, { method: 'DELETE' })
    if(res.ok) router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Details Modal */}
      {isEditingDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Model Meta</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Title</label>
                <input value={detailsForm.name} onChange={e=>setDetailsForm({...detailsForm, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Version</label>
                <input value={detailsForm.version} onChange={e=>setDetailsForm({...detailsForm, version: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Description</label>
                <textarea value={detailsForm.description} onChange={e=>setDetailsForm({...detailsForm, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" rows={4} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={()=>setIsEditingDetails(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleUpdateDetails} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Save Details</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dimension Modal */}
      {isAddingDimension && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">New Category / Dimension</h2>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Dimension Name</label>
              <input value={dimName} onChange={e=>setDimName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" placeholder="e.g. Innovation" autoFocus />
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={()=>setIsAddingDimension(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddDimension} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Create Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dimension Modal */}
      {editingDimension && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Rename Category</h2>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1 block">New Dimension Name</label>
              <input value={editingDimension.name} onChange={e=>setEditingDimension({...editingDimension, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" autoFocus />
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={()=>setEditingDimension(null)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleUpdateDimension} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Level Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Maturity Level {editingLevel.level}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Level Title</label>
                <input value={editingLevel.name} onChange={e=>setEditingLevel({...editingLevel, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1 block">Detailed Description / Criteria</label>
                <textarea value={editingLevel.description} onChange={e=>setEditingLevel({...editingLevel, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20" rows={5} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={()=>setEditingLevel(null)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleUpdateLevel} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Save Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <a href="/consultant" className="text-sm font-semibold text-primary-600 hover:text-primary-800 mb-3 inline-flex items-center gap-1 transition-colors">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{model.name}</h1>
          <p className="mt-2 text-lg text-slate-600 font-medium">{model.description} (v{model.version})</p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>setIsEditingDetails(true)} className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 bg-white rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all focus:ring-4 focus:ring-slate-100">
            Edit Details
          </button>
          <button onClick={()=>setIsAddingDimension(true)} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-primary-500/20">
            + Add Dimension
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {model.dimensions.map((dim: any) => (
          <div key={dim.id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">{dim.name}</h2>
              <button onClick={()=>setEditingDimension({id: dim.id, name: dim.name})} className="text-sm font-bold text-indigo-700 hover:bg-indigo-100 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-lg shadow-sm transition-colors">
                Rename Category
              </button>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Question Bank</h3>
                <button onClick={() => handleAddQuestion(dim.id)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-md hover:underline flex items-center gap-1 cursor-pointer transition-colors">
                  + Add Question
                </button>
              </div>
              <ul className="space-y-3 mb-10">
                {dim.questions.map((q: any) => (
                  <li key={q.id} className="text-base text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between group hover:border-indigo-200 transition-colors shadow-sm">
                    <span className="font-medium pr-4">{q.text}</span>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-sm text-slate-400 font-bold hover:text-red-600 opacity-0 md:opacity-100 transition-opacity">Remove</button>
                  </li>
                ))}
                {dim.questions.length === 0 && <li className="text-sm text-slate-400 font-medium italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center shadow-sm">No criteria mapped yet.</li>}
              </ul>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Maturity Scale Matrix</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {dim.levelDescriptions.sort((a:any,b:any)=>a.level - b.level).map((lvl:any) => {
                  const cardBg = lvl.level === 1 ? 'border-red-200 bg-red-50 hover:border-red-400 text-red-950' :
                                 lvl.level === 2 ? 'border-orange-200 bg-orange-50 hover:border-orange-400 text-orange-950' :
                                 lvl.level === 3 ? 'border-amber-200 bg-amber-50 hover:border-amber-400 text-amber-950' :
                                 lvl.level === 4 ? 'border-blue-200 bg-blue-50 hover:border-blue-400 text-blue-950' :
                                                   'border-emerald-200 bg-emerald-50 hover:border-emerald-400 text-emerald-950'
                  const badgeBg = lvl.level === 1 ? 'bg-red-200 text-red-900' :
                                  lvl.level === 2 ? 'bg-orange-200 text-orange-900' :
                                  lvl.level === 3 ? 'bg-amber-200 text-amber-900' :
                                  lvl.level === 4 ? 'bg-blue-200 text-blue-900' :
                                                    'bg-emerald-200 text-emerald-900'
                  return (
                  <div key={lvl.id} onClick={() => setEditingLevel({id: lvl.id, level: lvl.level, name: lvl.name, description: lvl.description})} className={`p-5 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border-2 ${cardBg}`}>
                    <span className={`text-xs font-black mb-2 px-2.5 py-1 rounded-md ${badgeBg}`}>LEVEL {lvl.level}</span>
                    <strong className="font-extrabold mb-3 text-lg leading-tight">{lvl.name}</strong>
                    <span className="text-sm font-medium opacity-80">{lvl.description}</span>
                  </div>
                )})}
              </div>
            </div>
          </div>
        ))}
        {model.dimensions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
            <h3 className="text-2xl font-extrabold text-slate-800">Matrix is Empty</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-md mx-auto text-lg">Initialize your matrix by adding a dimension parameter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
