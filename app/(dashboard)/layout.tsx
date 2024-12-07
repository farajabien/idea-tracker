// app/(dashboard)/layout.tsx
import { Metadata } from "next"

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
        {/* You can add a dashboard-specific header/navigation here */}
        <main className="flex-1">{children}</main>
        {/* You can add a dashboard-specific footer here */}
      </div>
    </div>
  )
}