"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getIdeas, getBuilderStats } from "@/app/api/firebaseApi"
import { BuilderStats, Idea } from "@/lib/types"
import { Loader2, LayoutDashboard, GitFork, CheckCircle, Globe, Eye, MousePointer } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "../providers/AuthProvider"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export default function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [stats, setStats] = useState<BuilderStats | null>(null)

  useEffect(() => {
    let mounted = true

    const loadStats = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        console.log("Fetching stats for user:", user.uid)
        const [userIdeas, builderStats] = await Promise.all([
          getIdeas(),
          getBuilderStats(user.uid)
        ])

        if (!mounted) return

        console.log("Fetched data:", { userIdeas, builderStats })
        setIdeas(userIdeas)
        setStats(builderStats)
      } catch (error) {
        console.error("Error loading stats:", error)
        if (mounted) {
          setError("Failed to load statistics")
        }
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const totalIdeas = ideas.length
  const inProgress = ideas.filter(idea => idea.status === "In Progress").length
  const completed = ideas.filter(idea => idea.status === "Completed").length
  const public_ = ideas.filter(idea => idea.isPublic).length

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Statistics
          </h2>
          <div className="space-y-1">
            <Card className="border-none shadow-none">
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-medium">Total Ideas</div>
                    <div className="text-lg font-bold">{totalIdeas}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none">
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <GitFork className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-medium">In Progress</div>
                    <div className="text-lg font-bold">{inProgress}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none">
              <CardContent className="p-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-medium">Completed</div>
                    <div className="text-lg font-bold">{completed}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator className="my-4" />
        {stats && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Engagement
            </h2>
            <div className="space-y-1">
              <Card className="border-none shadow-none">
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">Public Projects</div>
                      <div className="text-lg font-bold">{public_}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none">
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">Total Views</div>
                      <div className="text-lg font-bold">{stats.totalViews}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none">
                <CardContent className="p-2">
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">Total Clicks</div>
                      <div className="text-lg font-bold">{stats.totalClicks}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}