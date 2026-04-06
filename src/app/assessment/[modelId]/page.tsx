import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AssessmentWizard from '@/components/AssessmentWizard'

export const dynamic = 'force-dynamic'

export default async function TakeAssessment({ params }: { params: { modelId: string } }) {
  const model = await prisma.maturityModel.findUnique({
    where: { id: params.modelId },
    include: {
      dimensions: {
        include: {
          questions: true,
          levelDescriptions: true
        }
      }
    }
  })

  if (!model) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-primary-50 border border-indigo-100 rounded-2xl">
        <h1 className="text-3xl font-extrabold text-indigo-950">{model.name}</h1>
        <p className="mt-2 text-indigo-800 font-medium">{model.description}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 sm:p-10">
        <AssessmentWizard model={model} />
      </div>
    </div>
  )
}
