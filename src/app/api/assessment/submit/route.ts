import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { modelId, answers, jobLevel, department } = await req.json()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to your AIMM company account to save these results.' }, { status: 401 })
    }
    const userObj = session.user as any
    
    let orgId = userObj.organizationId;
    if (!orgId) {
      if (userObj.role === 'CONSULTANT') {
        const fallbackOrg = await prisma.organization.findFirst();
        if (fallbackOrg) {
          orgId = fallbackOrg.id;
        } else {
          return NextResponse.json({ error: 'No organization available to link this assessment to' }, { status: 400 })
        }
      } else {
        return NextResponse.json({ error: 'User does not belong to an organization' }, { status: 400 })
      }
    }

    const assessment = await prisma.assessment.create({
      data: {
        organizationId: orgId,
        userId: userObj.id,
        maturityModelId: modelId,
        status: 'COMPLETED',
        jobLevel,
        department
      }
    })

    const answerRecords = Object.entries(answers).map(([questionId, score]) => ({
      assessmentId: assessment.id,
      questionId,
      score: Number(score)
    }))

    await prisma.answer.createMany({
      data: answerRecords
    })

    return NextResponse.json({ success: true, assessmentId: assessment.id })
  } catch (error) {
    console.error("API Error in Submit:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
