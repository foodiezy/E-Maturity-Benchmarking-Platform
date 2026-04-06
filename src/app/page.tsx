import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl mix-blend-multiply"></div>
      
      <div className="z-10 text-center px-4 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
          Measure Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            Digital Maturity
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 mb-10 leading-relaxed">
          The Adaptive Integrated Maturity Model (AIMM) allows organizations to benchmark their capabilities across People, Innovation, and processes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/consultant" className="px-8 py-4 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-1 transition-all duration-200 font-semibold text-lg ring-1 ring-primary-500/50">
            Consultant Portal
          </Link>
          <Link href="/assessment" className="px-8 py-4 bg-white text-slate-700 rounded-xl shadow border border-slate-200 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-200 font-semibold text-lg ring-1 ring-black/5">
            Take Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}
