import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ConsultantLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  // Restrict standard users from the consultant area
  if (session.user.role === 'USER') {
    redirect('/assessment')
  }

  return <>{children}</>
}
