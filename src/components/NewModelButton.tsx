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
      className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
    >
      {isCreating ? 'Scaffolding...' : '+ New Model'}
    </button>
  )
}
