import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text, dimensionId } = await req.json()
    const q = await prisma.question.create({
      data: { text, dimensionId }
    })
    return NextResponse.json(q)
  } catch(e) {
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 })
  }
}
