import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AssessmentDirectory() {
  const models = await prisma.maturityModel.findMany({
    include: {
      _count: {
        select: { dimensions: true }
      }
    }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-indigo-900/5 p-8 rounded-3xl border border-indigo-900/10 backdrop-blur-sm">
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Available Assessments</h1>
          <p className="text-lg text-slate-500 font-medium">Select an e-Maturity model below to begin your evaluation.</p>
        </div>
        <Link 
          href="/assessment/results" 
          className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-sm border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View My Past Results
        </Link>
      </div>

      <div className="grid gap-6">
        {models.map(model => (
          <div key={model.id} className="bg-white border hover:border-indigo-300 border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row justify-between items-center group">
            <div className="space-y-2 mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-slate-800">{model.name}</h2>
              <p className="text-slate-600">{model.description}</p>
              <div className="flex gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                  Version {model.version}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                  {model._count.dimensions} Dimensions
                </span>
              </div>
            </div>
            
            <Link 
              href={`/assessment/${model.id}`} 
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-center font-semibold text-lg whitespace-nowrap"
            >
              Start Evaluation &rarr;
            </Link>
          </div>
        ))}
        {models.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No Assessment Models Available</h3>
            <p className="mt-2 text-slate-500">Please check back later or contact your consultant.</p>
          </div>
        )}
      </div>
    </div>
  )
}
