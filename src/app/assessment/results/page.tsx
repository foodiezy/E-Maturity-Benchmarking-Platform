import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PersonalResultsDirectory() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  const userId = (session.user as any).id

  // SECURE QUERY: Fetch only assessments where userId strictly matches the logged in user
  const myAssessments = await prisma.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      maturityModel: true,
      answers: true
    }
  })

  const getColors = (val: number) => {
    if (val < 2.0) return 'text-red-600 bg-red-50 border-red-100 group-hover:border-red-300'
    if (val < 3.0) return 'text-orange-600 bg-orange-50 border-orange-100 group-hover:border-orange-300'
    if (val < 4.0) return 'text-amber-600 bg-amber-50 border-amber-100 group-hover:border-amber-300'
    return 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:border-emerald-300'
  }

  const getTextColors = (val: number) => {
    if (val < 2.0) return 'text-red-700'
    if (val < 3.0) return 'text-orange-700'
    if (val < 4.0) return 'text-amber-700'
    return 'text-emerald-700'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/assessment" className="text-slate-400 hover:text-indigo-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-100">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Past Results</h1>
          <p className="text-slate-500 font-medium">Review your securely isolated assessment history.</p>
        </div>
      </div>

      <div className="grid gap-5">
        {myAssessments.map((req: any) => {
          const totalScore = req.answers.reduce((acc: number, a: any) => acc + a.score, 0)
          const avgScoreNum = req.answers.length > 0 ? (totalScore / req.answers.length) : 0
          const avgScore = avgScoreNum.toFixed(1)
          
          return (
            <Link href={`/assessment/results/${req.id}`} key={req.id} className={`block group bg-white border-2 border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer ${getColors(avgScoreNum)}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <div>
                  <h3 className="font-bold text-2xl text-slate-800 transition-colors uppercase tracking-tight">{req.maturityModel.name}</h3>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold tracking-wide shadow-sm">
                      {req.jobLevel || 'Unknown Role'}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:border-l sm:border-slate-200/50 sm:pl-8">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 shadow-sm">My Score</div>
                    <div className={`text-4xl font-black tracking-tighter ${getTextColors(avgScoreNum)}`}>{avgScore} <span className="text-lg text-slate-400">/ 5</span></div>
                  </div>
                  <div className={`text-slate-300 transition-colors bg-white border border-slate-100 p-3 rounded-full shadow-sm group-hover:scale-110 ${getTextColors(avgScoreNum)}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {myAssessments.length === 0 && (
           <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm mt-4">
             <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800">No Tests Found</h3>
             <p className="text-slate-500 font-medium mt-1">You must complete an assessment before anything appears here.</p>
           </div>
        )}
      </div>
    </div>
  )
}
