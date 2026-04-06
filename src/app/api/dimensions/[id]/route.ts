import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json()
    const updated = await prisma.dimension.update({
      where: { id: params.id },
      data: { name }
    })
    return NextResponse.json(updated)
  } catch(e) {
    return NextResponse.json({ error: 'Dimension rename failed' }, { status: 500 })
  }
}
