import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, maturityModelId } = await req.json()
    const dim = await prisma.dimension.create({
      data: { name, maturityModelId }
    })
    // Scaffold initial levels 1-5 automatically to save the consultant time
    await prisma.levelDescription.createMany({
      data: [1,2,3,4,5].map(level => ({
        dimensionId: dim.id,
        level,
        name: `Level ${level}`,
        description: `Description for level ${level}`
      }))
    })
    return NextResponse.json(dim)
  } catch(e) {
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 })
  }
}
