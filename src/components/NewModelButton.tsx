'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewModelButton() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/models/create', { method: 'POST' })
      const data = await res.json()
      if (data.id) {
        router.push(`/consultant/model/${data.id}`)
        router.refresh()
      }
    } catch(e) {
      alert('Failed to create new model.')
      setIsCreating(false)
    }
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={isCreating}
      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold shadow-md shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
    >
      {isCreating ? 'Scaffolding...' : '+ New Model'}
    </button>
  )
}
