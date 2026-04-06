import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ResultsDashboard() {
  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: true,
      user: true,
      maturityModel: true,
      answers: true
    }
  })

  const getColors = (val: number) => {
    if (val < 2.0) return 'text-red-600 bg-red-50 border-red-100 group-hover:border-red-300'
    if (val < 3.0) return 'text-orange-600 bg-orange-50 border-orange-100 group-hover:border-orange-300'
    if (val < 4.0) return 'text-amber-600 bg-amber-50 border-amber-100 group-hover:border-amber-300'
    if (val < 4.8) return 'text-blue-600 bg-blue-50 border-blue-100 group-hover:border-blue-300'
    return 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:border-emerald-300'
  }

  const getTextColors = (val: number) => {
    if (val < 2.0) return 'text-red-600'
    if (val < 3.0) return 'text-orange-600'
    if (val < 4.0) return 'text-amber-600'
    if (val < 4.8) return 'text-blue-600'
    return 'text-emerald-600'
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Client Analytics & Results</h1>
        <p className="mt-3 text-lg text-slate-500 font-medium">Review submitted assessments and analyze mathematically-derived maturity scores.</p>
      </div>

      <div className="grid gap-5">
        {assessments.map((req: any) => {
          const totalScore = req.answers.reduce((acc: number, a: any) => acc + a.score, 0)
          const avgScoreNum = req.answers.length > 0 ? (totalScore / req.answers.length) : 0
          const avgScore = avgScoreNum.toFixed(1)
          
          return (
            <Link href={`/consultant/results/${req.id}`} key={req.id} className={`block group bg-white border-2 border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer ${getColors(avgScoreNum)}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <div>
                  <h3 className="font-extrabold text-3xl text-slate-800 transition-colors uppercase tracking-tight">{req.organization.name}</h3>
                  <p className="text-sm text-slate-600 font-semibold mt-2">
                    Submitted by {req.user.name || req.user.email}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold tracking-wide shadow-sm">
                      {req.maturityModel.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:border-l sm:border-slate-200/50 sm:pl-8">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Global Score</div>
                    <div className={`text-5xl font-black tracking-tighter ${getTextColors(avgScoreNum)}`}>{avgScore} <span className="text-xl text-slate-400">/ 5</span></div>
                  </div>
                  <div className={`text-slate-300 transition-colors bg-white border border-slate-100 p-4 rounded-full shadow-sm group-hover:scale-110 ${getTextColors(avgScoreNum)}`}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
        {assessments.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
             </div>
             <h3 className="text-2xl font-extrabold text-slate-800">No Analytics Available Yet</h3>
             <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">When your clients complete an evaluation using the Assessment Engine, their deep scoring data will automatically sync here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
