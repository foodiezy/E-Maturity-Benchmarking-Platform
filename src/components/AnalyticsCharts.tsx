'use client'

import { useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

export default function AnalyticsCharts({ rawData }: { rawData: any[] }) {
  
  const { radarData, barData, pieData, roles, sCurveData } = useMemo(() => {
    const dimScores: Record<string, {total: number, count: number}> = {}
    const dimRoleScores: Record<string, Record<string, {total: number, count: number}>> = {}
    const roleCounts: Record<string, number> = {}
    const roleSet = new Set<string>()

    rawData.forEach(assessment => {
      const role = assessment.jobLevel || 'Unknown'
      roleSet.add(role)
      
      if (!roleCounts[role]) roleCounts[role] = 0
      roleCounts[role] += 1
      
      assessment.answers.forEach((ans: any) => {
        const dim = ans.dimensionName
        
        if (!dimScores[dim]) dimScores[dim] = { total: 0, count: 0 }
        dimScores[dim].total += ans.score
        dimScores[dim].count += 1
        
        if (!dimRoleScores[dim]) dimRoleScores[dim] = {}
        if (!dimRoleScores[dim][role]) dimRoleScores[dim][role] = { total: 0, count: 0 }
        dimRoleScores[dim][role].total += ans.score
        dimRoleScores[dim][role].count += 1
      })
    })

    const pie = Object.keys(roleCounts).map(role => ({
      name: role,
      value: roleCounts[role]
    }))

    const radar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Average: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2)),
      Target: 4.5 // Baseline target for AIMM benchmarking
    }))

    // S-Curve Data: Cumulative maturity progression across dimensions
    const sCurveData = Object.keys(dimScores)
      .sort() // Ensure consistent order: Capability, Innovation, People
      .map((dim, index, arr) => {
        const avg = Number((dimScores[dim].total / dimScores[dim].count).toFixed(2));
        return {
          name: dim,
          Maturity: avg,
          Cumulative: Number((arr.slice(0, index + 1).reduce((acc, d) => acc + (dimScores[d].total / dimScores[d].count), 0) / (index + 1)).toFixed(2))
        };
      });

    const bar = Object.keys(dimRoleScores).map(dim => {
      const entry: any = { dimension: dim }
      Array.from(roleSet).forEach(r => {
        if (dimRoleScores[dim][r]) {
          entry[r] = Number((dimRoleScores[dim][r].total / dimRoleScores[dim][r].count).toFixed(2))
        } else {
          entry[r] = 0
        }
      })
      return entry
    })

    return { radarData: radar, barData: bar, pieData: pie, roles: Array.from(roleSet), sCurveData }
  }, [rawData])

  if (rawData.length === 0) {
    return <div className="p-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl mt-8">
      <h3 className="text-xl font-bold text-slate-800">No Assessment Data Available</h3>
      <p className="text-slate-500 mt-2">Users need to complete the assessment before analytics can be generated.</p>
    </div>
  }

  const colors = ['#10b981', '#f59e0b', '#4f46e5', '#ec4899', '#8b5cf6']

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 group">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Overall Maturity Footprint</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-sm">Organizational average across all dimensions to quickly identify core strengths.</p>
        
        <div className="h-[350px] w-full bg-slate-50/50 rounded-2xl p-4 group-hover:bg-indigo-50/10 transition-colors">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3"/>
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#334155', fontSize: 13, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
              <Radar name="Org Average" dataKey="Average" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.2} />
              <Tooltip wrapperClassName="custom-tooltip shadow-2xl rounded-xl border-0 !bg-white/95 backdrop-blur-sm" />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 group">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Perception Gap Analysis</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-sm">Compare dimension scores by job level to identify alignment or disconnects.</p>
        
        <div className="h-[350px] w-full bg-slate-50/50 rounded-2xl p-4 group-hover:bg-indigo-50/10 transition-colors">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dimension" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} label={{ value: 'Maturity Dimensions', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Average Score (0-5)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} wrapperClassName="custom-tooltip shadow-2xl rounded-xl border-0 !bg-white/95 backdrop-blur-sm" />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {roles.map((role: string, idx: number) => (
                 <Bar 
                    key={role} 
                    dataKey={role} 
                    name={role}
                    fill={colors[idx % colors.length]} 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40} 
                  />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 group lg:col-span-2 xl:col-span-1">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Respondent Demographics</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-sm">Distribution of assessment participants by job level.</p>
        
        <div className="h-[350px] w-full bg-slate-50/50 rounded-2xl p-4 group-hover:bg-indigo-50/10 transition-colors flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip wrapperClassName="custom-tooltip shadow-2xl rounded-xl border-0 !bg-white/95 backdrop-blur-sm" />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 group lg:col-span-2">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">AIMM Maturity S-Curve</h3>
        <p className="text-sm text-slate-500 mb-8 max-w-sm">Visualizing the cumulative maturity progression across the PICaMM dimensions.</p>
        
        <div className="h-[400px] w-full bg-slate-50/50 rounded-2xl p-6 group-hover:bg-indigo-50/10 transition-colors">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 13, fontWeight: 700 }} />
              <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <Tooltip wrapperClassName="custom-tooltip shadow-2xl rounded-xl border-0 !bg-white/95 backdrop-blur-sm" />
              <Legend verticalAlign="top" align="right" />
              <Area type="monotone" dataKey="Maturity" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorMaturity)" />
              <Area type="monotone" dataKey="Cumulative" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
