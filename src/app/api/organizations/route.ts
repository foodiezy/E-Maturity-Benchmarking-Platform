import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
  }
}
