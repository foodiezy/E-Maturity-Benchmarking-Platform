import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewModelButton from '@/components/NewModelButton'

export const dynamic = 'force-dynamic'

export default async function ConsultantDashboard() {
  const models = await prisma.maturityModel.findMany({
    include: {
      dimensions: {
        include: {
          questions: true,
          levelDescriptions: true,
        }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Consultant Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage and view Maturity Models, logic constraints, and overall analytics.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/consultant/analytics" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </Link>
          <NewModelButton />
        </div>
      </div>

      <div className="grid gap-6">
        {models.map(model => (
          <Link href={`/consultant/model/${model.id}`} key={model.id} className="block bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                  <span className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  {model.name}
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 align-middle ml-2">
                    v{model.version}
                  </span>
                </h2>
                <p className="text-slate-600 mt-2">{model.description}</p>
              </div>
              <div className="text-sm font-medium text-primary-600 border border-primary-100 bg-primary-50 px-4 py-2 rounded-lg transition-colors group-hover:bg-primary-600 group-hover:text-white shadow-sm flex items-center gap-2">
                Edit Matrix <span className="font-bold">&rarr;</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {model.dimensions.map(dim => (
                <div key={dim.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100 group hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 text-lg">{dim.name}</h3>
                    <span className="h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                      {dim.questions.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Question Bank Preview</div>
                    {dim.questions.map(q => (
                      <div key={q.id} className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm leading-relaxed">
                        {q.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Maturity Level Mappings</h3>
              <div className="flex flex-wrap gap-2">
                {model.dimensions[0]?.levelDescriptions.sort((a,b)=>a.level - b.level).map(lvl => (
                  <div key={lvl.id} className="flex flex-col bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg min-w-[120px]">
                    <span className="text-xs text-slate-500 font-medium mb-1">Level {lvl.level}</span>
                    <span className="text-sm font-semibold text-slate-800">{lvl.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {models.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No Assessment Models Found</h3>
            <p className="mt-2 text-slate-500">Database might not be seeded or configured correctly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
