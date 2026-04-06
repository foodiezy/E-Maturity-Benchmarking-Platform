import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AnalyticsCharts from '@/components/AnalyticsCharts'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage({ searchParams }: { searchParams: { orgId?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect('/api/auth/signin')
  
  const user = session.user as any
  


  let orgId = searchParams.orgId || user.organizationId

  // If consultant has no linked org, pick the first one for MVP testing purposes
  if (!orgId && ['CONSULTANT', 'ADMIN'].includes(user.role)) {
    const firstOrg = await prisma.organization.findFirst()
    if (firstOrg) orgId = firstOrg.id
  }

  if (!orgId) return <div className="p-10 text-center text-slate-500">No Organization Found for analytics.</div>

  const org = await prisma.organization.findUnique({ where: { id: orgId } })

  const assessments = await prisma.assessment.findMany({
    where: { 
      organizationId: orgId,
      status: 'COMPLETED'
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              dimension: true
            }
          }
        }
      }
    }
  })

  // Format data for Recharts client component
  const processedData = assessments.map((a: any) => ({
    id: a.id,
    jobLevel: a.jobLevel || 'Unknown',
    department: a.department || 'Unknown',
    answers: a.answers.map((ans: any) => ({
      dimensionName: ans.question.dimension.name,
      score: ans.score
    }))
  }))

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        {/* Dynamic decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl mix-blend-overlay"></div>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            Demographic Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-indigo-200 max-w-2xl font-medium leading-relaxed">
            Real-time maturity reporting for <strong className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{org?.name}</strong>. Compare findings across seniority levels and identify perception gaps.
          </p>
        </div>
      </div>

      <AnalyticsCharts rawData={processedData} />
    </div>
  )
}
