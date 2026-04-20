'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type OrgPickerProps = {
  organizations: { id: string; name: string; assessmentCount: number }[]
  currentOrgId: string
}

export default function OrgPicker({ organizations, currentOrgId }: OrgPickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (orgId: string) => {
    router.push(`/consultant/analytics?orgId=${orgId}`)
  }

  if (organizations.length <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <label className="text-xs font-black uppercase tracking-widest text-neutral-400 whitespace-nowrap">
        Organisation
      </label>
      <select
        value={currentOrgId}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-black border-2 border-neutral-700 text-white px-5 py-3 font-bold text-sm focus:border-white focus:outline-none transition-colors appearance-none rounded-none min-w-[200px]"
      >
        {organizations.map(org => (
          <option key={org.id} value={org.id}>
            {org.name} — {org.assessmentCount} assessment{org.assessmentCount !== 1 ? 's' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
