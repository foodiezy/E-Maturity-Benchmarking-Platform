'use client'

import React, { useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

export default function PersonalAnalyticsChart({ rawData }: { rawData: any }) {

  const { radarData, barData } = useMemo(() => {
    // rawData is a single assessment object with answers populated
    const answers = rawData.answers || []
    
    // Group scores by dimension
    const dimScores: Record<string, { total: number, count: number }> = {}

    answers.forEach((ans: any) => {
      const dimName = ans.question.dimension.name
      if (!dimScores[dimName]) {
         dimScores[dimName] = { total: 0, count: 0 }
      }
      dimScores[dimName].total += ans.score
      dimScores[dimName].count += 1
    })

    const extractedRadar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Score: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2))
    }))

    const extractedBar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Score: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2))
    }))

    return { radarData: extractedRadar, barData: extractedBar }
  }, [rawData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
          <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-2 text-sm font-medium">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600">{entry.name}:</span>
                <span className="text-slate-900 font-bold ml-auto pl-4">{entry.value}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-12">
      {radarData.length > 0 ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Radar Footprint */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
               <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">My Maturity Footprint</h3>
                  <p className="text-sm text-slate-500 font-medium">Your multidimensional e-Maturity mapping shape.</p>
               </div>
               <div className="h-80 w-full mt-auto">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                     <PolarGrid stroke="#e2e8f0" />
                     <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                     <Radar name="My Score" dataKey="Score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                     <Tooltip content={<CustomTooltip />} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Dimensional Bar Score */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
               <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Dimension Breakdown</h3>
                  <p className="text-sm text-slate-500 font-medium">Your isolated average score per dimension category.</p>
               </div>
               <div className="h-80 w-full mt-auto">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 50 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="dimension" 
                       tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                       axisLine={{ stroke: '#e2e8f0' }}
                       tickLine={false}
                       angle={-45}
                       textAnchor="end"
                       height={70}
                     />
                     <YAxis 
                       domain={[0, 5]} 
                       tick={{ fill: '#64748b', fontSize: 12 }} 
                       axisLine={false}
                       tickLine={false}
                       tickCount={6}
                     />
                     <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                     <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                     <Bar dataKey="Score" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>
      ) : (
         <div className="flex flex-col items-center justify-center p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Data Not Processed</h3>
            <p className="mt-3 text-slate-500 font-medium max-w-sm">We could not calculate visual metrics for this assessment. It may lack dimension data.</p>
         </div>
      )}
    </div>
  )
}
