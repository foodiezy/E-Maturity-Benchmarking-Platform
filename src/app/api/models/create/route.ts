import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const newModel = await prisma.maturityModel.create({
      data: {
        name: 'New Custom Model',
        description: 'A newly created maturity assessment model outline.',
        version: '1.0'
      }
    })
    return NextResponse.json({ success: true, id: newModel.id })
  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 })
  }
}
