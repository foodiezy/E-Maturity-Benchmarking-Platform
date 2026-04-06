import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MatrixEditorClient from '@/components/MatrixEditorClient'

export const dynamic = 'force-dynamic'

export default async function EditModelPage({ params }: { params: { modelId: string } }) {
  const model = await prisma.maturityModel.findUnique({
    where: { id: params.modelId },
    include: {
      dimensions: {
        include: { questions: true, levelDescriptions: true }
      }
    }
  })

  if (!model) notFound()

  return <MatrixEditorClient initialModel={model} />
}
