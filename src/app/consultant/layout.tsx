import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ConsultantLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  // Security Enforcer: If not logged in, or if logged in but specifically only a 'USER'
  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  const userObj = session.user as any
  
  // Hard block standard users from ever rendering any page inside '/consultant'
  if (userObj.role === 'USER') {
    redirect('/assessment') // Redirect standard respondents to their designated assessment hub
  }

  // If role is CONSULTANT or ADMIN, cleanly render the requested page
  return <>{children}</>
}
