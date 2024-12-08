// app/(dashboard)/layout.tsx
import { Metadata } from "next"
import { LayoutDashboard, FolderKanban, User } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | Idea Tracker",
  description: "Track and manage your project ideas",
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>
        {/* Mobile Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="flex justify-around items-center h-16">
            <Link href="/dashboard" className="flex flex-col items-center p-2">
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link href="/projects" className="flex flex-col items-center p-2">
              <FolderKanban className="h-5 w-5" />
              <span className="text-xs">Projects</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center p-2">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}