import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newMsg = await prisma.contactMessage.create({
      data: { name, email, message }
    })

    return NextResponse.json({ success: true, messageId: newMsg.id })
  } catch(err) {
    console.error('Contact API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
