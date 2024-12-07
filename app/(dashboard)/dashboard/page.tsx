// app/(dashboard)/page.tsx
import { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardClient from "@/components/dashboard/DashboardClient"

export const metadata: Metadata = {
  title: "Dashboard | Idea Tracker",
  description: "Track and manage your project ideas",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardClient />
    </ProtectedRoute>
  )
}