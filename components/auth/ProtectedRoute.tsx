"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 