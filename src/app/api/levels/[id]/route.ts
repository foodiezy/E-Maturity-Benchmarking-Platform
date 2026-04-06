import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await req.json()
    const updated = await prisma.levelDescription.update({
      where: { id: params.id },
      data: { name, description }
    })
    return NextResponse.json(updated)
  } catch(e) {
    return NextResponse.json({ error: 'Level update failed' }, { status: 500 })
  }
}
