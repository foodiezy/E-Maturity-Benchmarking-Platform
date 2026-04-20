import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from 'next/link'
import PersonalAnalyticsChart from '@/components/PersonalAnalyticsChart'
import { VisualData } from 'undraw-react'

export const dynamic = 'force-dynamic'

export default async function PersonalResultDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  // Find the exact assessment requested
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.id },
    include: {
      maturityModel: true,
      answers: {
        include: {
          question: {
            include: { dimension: true }
          }
        }
      }
    }
  })

  // HARD SECURITY GATE: If assessment doesn't exist, or it doesn't belong to this exact user, explicitly deny.
  // We throw a 404 (notFound) so malicious actors can't even confirm if the ID exists.
  if (!assessment || assessment.userId !== (session.user as any).id) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-2 border-black pb-8">
        <div className="flex items-center gap-4">
          <Link href="/assessment/results" className="text-black hover:bg-black hover:text-white transition-colors border-2 border-black p-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase">Personal Footprint</h1>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-2">{assessment.maturityModel.name} — {new Date(assessment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="hidden md:block w-full max-w-[160px] grayscale contrast-200 opacity-80">
          <VisualData color="#000000" style={{ height: '100px' }} />
        </div>
      </div>

      <div className="bg-white border-2 border-black p-4 sm:p-8">
        {/* Pass the fully hydrated single-user assessment to the visualizer */}
        <PersonalAnalyticsChart rawData={assessment as any} />
      </div>
    </div>
  )
}
