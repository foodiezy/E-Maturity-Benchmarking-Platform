import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Maturity Benchmarking Suite',
  description: 'AIMM Assessment Platform for Organizational Maturity',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                      E-Maturity Bench
                    </span>
                  </div>
                  <nav className="flex space-x-2 items-center">
                    <a href="/" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                    {session ? (
                      <>
                        <a href="/consultant" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Consultant Dashboard</a>
                        <a href="/consultant/results" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Analytics</a>
                        <a href="/consultant/risks" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Risk Register</a>
                        <a href="/api/auth/signout" className="ml-2 px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors border border-slate-200 shadow-sm">Sign Out</a>
                      </>
                    ) : (
                      <a href="/auth/signin" className="ml-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-bold transition-colors border border-primary-100 shadow-sm">Log-on to Provider</a>
                    )}
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="bg-white border-t border-slate-200 mt-auto">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} E-Maturity Benchmarking Suite. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
