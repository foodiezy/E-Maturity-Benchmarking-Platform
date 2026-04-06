import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { organizationId, description, status, probability, impact, mitigationPlan } = await req.json()
    const risk = await prisma.risk.create({
      data: {
        organizationId,
        description,
        status,
        probability: Number(probability),
        impact: Number(impact),
        mitigationPlan
      }
    })
    return NextResponse.json({ success: true, risk })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if(id) {
       await prisma.risk.delete({ where: { id } })
       return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  } catch(error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
