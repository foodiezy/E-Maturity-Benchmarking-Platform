import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AnalyticsCharts from '@/components/AnalyticsCharts'
import OrgPicker from '@/components/OrgPicker'
import { SetupAnalytics } from 'undraw-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage({ searchParams }: { searchParams: { orgId?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect('/api/auth/signin')
  
  const user = session.user

  // Fetch all organizations with their completed assessment counts for the picker
  const allOrgs = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { assessments: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const orgPickerData = allOrgs.map(o => ({
    id: o.id,
    name: o.name,
    assessmentCount: o._count.assessments
  }))
  
  // Determine which org to display
  let orgId = searchParams.orgId || user.organizationId

  // If consultant has no linked org, pick the first one with assessments, or just the first one
  if (!orgId && ['CONSULTANT', 'ADMIN'].includes(user.role)) {
    const orgWithData = orgPickerData.find(o => o.assessmentCount > 0)
    orgId = orgWithData?.id || allOrgs[0]?.id
  }

  if (!orgId) return <div className="p-10 text-center font-black uppercase tracking-widest border-2 border-black m-8">No Organization Found for analytics.</div>

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
    <div className="max-w-7xl mx-auto">
      <div className="bg-black border-2 border-black p-8 sm:p-12 text-white">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="relative z-10 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
              <span className="inline-block px-4 py-2 bg-white text-black font-black tracking-widest uppercase text-xs self-start">
                Demographic Insights
              </span>
              {/* Org Picker for consultants/admins */}
              {['CONSULTANT', 'ADMIN'].includes(user.role) && orgPickerData.length > 1 && (
                <OrgPicker organizations={orgPickerData} currentOrgId={orgId} />
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 uppercase">Analytics Dashboard</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 max-w-2xl leading-relaxed">
              Real-time maturity reporting for <strong className="text-white underline underline-offset-4 decoration-2 mx-1">{org?.name}</strong>. 
              Compare findings across seniority levels and identify perception gaps.
              <span className="block mt-2 text-neutral-500">{assessments.length} completed assessment{assessments.length !== 1 ? 's' : ''} from this organisation.</span>
            </p>
          </div>
          <div className="hidden lg:block w-full max-w-[200px] grayscale contrast-200 invert opacity-40 flex-shrink-0">
            <SetupAnalytics color="#000000" style={{ height: '160px' }} />
          </div>
        </div>
      </div>

      <AnalyticsCharts rawData={processedData} />
    </div>
  )
}
