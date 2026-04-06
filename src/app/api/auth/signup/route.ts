import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, organizationName } = await req.json()

    if (!name || !email || !password || !organizationName) {
      return NextResponse.json({ error: 'Please provide all required registration fields.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'This email is already securely linked to an AIMM tracker account.' }, { status: 400 })
    }

    const org = await prisma.organization.create({
      data: { name: organizationName }
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        organizationId: org.id
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error("Signup Database Error:", error)
    return NextResponse.json({ error: 'Platform Error. Please try again.' }, { status: 500 })
  }
}
