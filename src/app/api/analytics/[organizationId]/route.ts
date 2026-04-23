import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { organizationId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userRole = session.user.role
    const userOrgId = session.user.organizationId
    if (userRole !== 'CONSULTANT' && userRole !== 'ADMIN' && userOrgId !== params.organizationId) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const assessments = await prisma.assessment.findMany({
      where: { 
        organizationId: params.organizationId,
        status: 'COMPLETED'
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                dimension: true
              }
            }
          }
        }
      }
    })

    const processedData = assessments.map((a: any) => ({
      id: a.id,
      jobLevel: a.jobLevel || 'Unknown',
      department: a.department || 'Unknown',
      createdAt: a.createdAt,
      answers: a.answers.map((ans: any) => ({
        dimensionName: ans.question.dimension.name,
        score: ans.score
      }))
    }))

    return NextResponse.json({ assessments: processedData })

  } catch (error) {
    console.error("API Error in Analytics:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
