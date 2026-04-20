import { prisma } from '@/lib/prisma'
import RiskRegisterClient from '@/components/RiskRegisterClient'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation'
import { Warning } from 'undraw-react'

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
    <div className="max-w-[90rem] mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b-2 border-black pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">Risk & Mitigation Plan</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm mt-3 max-w-lg">Centralised tracking of operational and maturity risks across all client organisations.</p>
        </div>
        <div className="w-full max-w-[200px] grayscale contrast-200 opacity-80">
          <Warning color="#000000" style={{ height: '130px' }} />
        </div>
      </div>
      <RiskRegisterClient organizations={organizations} />
    </div>
  )
}
