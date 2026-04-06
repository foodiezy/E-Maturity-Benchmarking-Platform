import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReportExportButton from '@/components/ReportExportButton'

export const dynamic = 'force-dynamic'

export default async function ResultAnalyticsPage({ params }: { params: { assessmentId: string } }) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.assessmentId },
    include: {
      organization: true,
      user: true,
      maturityModel: {
        include: {
          dimensions: {
            include: { questions: true, levelDescriptions: true }
          }
        }
      },
      answers: {
        include: { question: true }
      }
    }
  })

  if (!assessment) notFound()

  const getColors = (val: number) => {
    if (val < 2.0) return { text: 'text-red-500', bg: 'bg-red-50', gradient: 'from-red-400 to-red-600', border: 'border-red-100', textDark: 'text-red-950', badge: 'bg-red-200 text-red-800', fill: 'bg-red-600/30' }
    if (val < 3.0) return { text: 'text-orange-500', bg: 'bg-orange-50', gradient: 'from-orange-400 to-orange-600', border: 'border-orange-100', textDark: 'text-orange-950', badge: 'bg-orange-200 text-orange-800', fill: 'bg-orange-600/30' }
    if (val < 4.0) return { text: 'text-amber-500', bg: 'bg-amber-50', gradient: 'from-amber-400 to-amber-600', border: 'border-amber-100', textDark: 'text-amber-950', badge: 'bg-amber-200 text-amber-800', fill: 'bg-amber-600/30' }
    if (val < 4.8) return { text: 'text-blue-500', bg: 'bg-blue-50/70', gradient: 'from-blue-400 to-blue-600', border: 'border-blue-100', textDark: 'text-blue-950', badge: 'bg-blue-200 text-blue-800', fill: 'bg-blue-600/30' }
    return { text: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-400 to-emerald-600', border: 'border-emerald-100', textDark: 'text-emerald-950', badge: 'bg-emerald-200 text-emerald-800', fill: 'bg-emerald-600/30' }
  }

  const dimensionScores = assessment.maturityModel.dimensions.map((dim: any) => {
    const dimAnswers = assessment.answers.filter((a: any) => a.question.dimensionId === dim.id)
    const total = dimAnswers.reduce((sum: number, a: any) => sum + a.score, 0)
    const avgScoreNum = dimAnswers.length > 0 ? (total / dimAnswers.length) : 0
    const avg = avgScoreNum.toFixed(1)
    
    // Finding the level description matching the truncated floor of the average score locally
    const currentLevel = Math.floor(avgScoreNum) || 1
    const descriptor = dim.levelDescriptions.find((l: any) => l.level === currentLevel)

    return {
      dim,
      avg,
      currentLevel,
      descriptor,
      answeredCount: dimAnswers.length,
      colors: getColors(avgScoreNum)
    }
  })

  const overallAvgNum = assessment.answers.length > 0 ? (assessment.answers.reduce((acc: number, a: any) => acc + a.score, 0) / assessment.answers.length) : 0
  const overallAvg = overallAvgNum.toFixed(1)
  const oColors = getColors(overallAvgNum)

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <a href="/consultant/results" className="text-sm font-bold text-slate-600 hover:text-slate-800 inline-flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          &larr; Back to Global Analytics
        </a>
        <ReportExportButton assessment={assessment} dimensionScores={dimensionScores} overallAvg={overallAvg} />
      </div>

      <div className="bg-slate-950 rounded-[2.5rem] p-8 sm:p-14 mb-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8">
          <div>
            <div className={`inline-block font-bold tracking-widest text-xs mb-4 px-3 py-1.5 rounded-md border text-white ${oColors.fill} border-white/20 uppercase shadow-md`}>
              {assessment.maturityModel.name} Results
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">{assessment.organization.name}</h1>
            <p className="text-slate-400 font-semibold text-lg">Survey compiled by {assessment.user.name} on {new Date(assessment.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-baseline gap-4 relative z-10 bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
            <div className={`text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b ${oColors.gradient}`}>{overallAvg}</div>
            <div className={`text-xl font-bold ${oColors.text}`}>/ 5<br/><span className="text-xs uppercase tracking-widest opacity-60 text-slate-400">Global Index</span></div>
          </div>
        </div>
        
        {/* Aesthetic design injections */}
        <div className={`absolute -top-32 -right-32 w-[35rem] h-[35rem] rounded-full blur-[100px] pointer-events-none ${oColors.fill}`}></div>
        <div className="absolute -bottom-24 -left-24 w-[25rem] h-[25rem] bg-slate-800/50 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      <div className="flex items-center gap-3 mb-6 px-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Dimensional Breakdown</h2>
        <div className="h-px bg-slate-200 flex-1 ml-4 mt-2"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {dimensionScores.map(stat => (
          <div key={stat.dim.id} className={`bg-white border-2 ${stat.colors.border} rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group`}>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-6 group-hover:text-slate-950 transition-colors">{stat.dim.name}</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className={`text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br ${stat.colors.gradient}`}>{stat.avg}</span>
                <span className="text-lg font-bold text-slate-400 mb-1.5">/ 5</span>
              </div>
              
              <div className={`${stat.colors.bg} p-5 rounded-2xl border ${stat.colors.border} shadow-inner`}>
                <div className={`text-xs font-black ${stat.colors.text} uppercase tracking-widest mb-3 flex items-center justify-between`}>
                  Stance
                  <span className={`${stat.colors.badge} px-2.5 py-1 rounded-md font-black shadow-sm`}>Level {stat.currentLevel}</span>
                </div>
                <strong className={`text-lg ${stat.colors.textDark} font-extrabold block mb-2 leading-tight`}>{stat.descriptor?.name || 'Unmapped'}</strong>
                <p className={`text-sm ${stat.colors.text} opacity-95 font-medium leading-relaxed`}>
                  {stat.descriptor?.description || 'No maturity definition provided in the Consultant layout for this level.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
               <span>Algorithm Integrity</span>
               <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded shadow-sm">{stat.answeredCount} Data points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
