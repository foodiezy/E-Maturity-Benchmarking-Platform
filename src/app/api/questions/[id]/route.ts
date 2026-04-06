import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.question.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch(e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
