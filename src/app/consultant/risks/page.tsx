import { prisma } from '@/lib/prisma'
import RiskRegisterClient from '@/components/RiskRegisterClient'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RisksPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect('/auth/signin')
  }

  const organizations = await prisma.organization.findMany({
    include: { risks: { orderBy: { createdAt: 'desc' } } }
  })
  
  return (
    <div className="max-w-[90rem] mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Project Risk & Mitigation Plan</h1>
        <p className="text-slate-600 font-medium text-lg">Centralised tracking of operational and maturity risks across all client organisations.</p>
      </div>
      <RiskRegisterClient organizations={organizations} />
    </div>
  )
}
