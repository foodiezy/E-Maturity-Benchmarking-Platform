import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, organizationName, organizationId } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required registration fields.' }, { status: 400 })
    }

    // Must provide either an existing org to join OR a new org name
    if (!organizationId && !organizationName) {
      return NextResponse.json({ error: 'Please select an existing organisation or enter a new one.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'This email is already securely linked to an AIMM tracker account.' }, { status: 400 })
    }

    let orgId: string

    if (organizationId) {
      // Join an existing organisation
      const existingOrg = await prisma.organization.findUnique({ where: { id: organizationId } })
      if (!existingOrg) {
        return NextResponse.json({ error: 'Selected organisation does not exist.' }, { status: 400 })
      }
      orgId = existingOrg.id
    } else {
      // Create a new organisation
      const org = await prisma.organization.create({
        data: { name: organizationName }
      })
      orgId = org.id
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        organizationId: orgId
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error("Signup Database Error:", error)
    return NextResponse.json({ error: 'Platform Error. Please try again.' }, { status: 500 })
  }
}
