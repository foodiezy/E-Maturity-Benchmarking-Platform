import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from 'next/link'
import PersonalAnalyticsChart from '@/components/PersonalAnalyticsChart'

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
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="flex items-center gap-4">
        <Link href="/assessment/results" className="text-slate-400 hover:text-indigo-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-100">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal footprint: <span className="text-indigo-600">{assessment.maturityModel.name}</span></h1>
          <p className="text-slate-500 font-medium">Completed on {new Date(assessment.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-8">
        {/* Pass the fully hydrated single-user assessment to the visualizer */}
        <PersonalAnalyticsChart rawData={assessment as any} />
      </div>
    </div>
  )
}
