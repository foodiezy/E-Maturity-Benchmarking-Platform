import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, version } = await req.json()
    const updated = await prisma.maturityModel.update({
      where: { id: params.id },
      data: { name, description, version }
    })
    return NextResponse.json(updated)
  } catch(e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.maturityModel.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch(e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
