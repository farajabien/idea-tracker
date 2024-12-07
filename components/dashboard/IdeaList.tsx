"use client"

import React, { useEffect, useState } from "react"
import { Table, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lock, Globe, ExternalLink } from "lucide-react"
import { getIdeas, updateIdea } from "@/app/api/firebaseApi"
import { Idea, ProjectStatus, Step } from "@/lib/types"
import {  formatDistanceToNow } from "date-fns"
import LoginForm from "../auth/LoginForm"
import { useAuth } from "../providers/AuthProvider"
import { toast } from "sonner"
import { Progress } from "../ui/progress"

import ManageIdeaSheet from "./ManageIdeaSheet"

interface IdeaListProps {
  filter?: "all" | "in-progress" | "completed" | "public"
}

const statusColors: Record<ProjectStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-green-100 text-green-700"
}



export default function IdeaList({ filter = "all" }: IdeaListProps) {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        const data = await getIdeas()
        
        const filteredData = filter === "all" 
          ? data
          : data.filter(idea => {
              switch (filter) {
                case "in-progress":
                  return idea.status === "In Progress"
                case "completed":
                  return idea.status === "Completed"
                case "public":
                  return idea.isPublic
                default:
                  return true
              }
            })

        setIdeas(filteredData)
      } catch (err) {
        console.error("Error fetching ideas:", err)
        setError(err instanceof Error ? err.message : "Failed to load ideas")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [user, filter])

  if (!user) {

    return (
      <div className="text-center p-4 text-muted-foreground">
        Please sign in to view your ideas

        <LoginForm/>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={() => setLoading(true)} 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    )
  }

  const getProgress = (steps: Step[]) => {
    if (!steps || steps.length === 0) return 0
    return Math.round((steps.filter(step => step.isCompleted).length / steps.length) * 100)
  }

  const handleProgressUpdate = async (idea: Idea, updatedSteps: Step[]) => {
    try {
      const allCompleted = updatedSteps.every(step => step.isCompleted)
      const wasCompleted = idea.status === "Completed"
      const someCompleted = updatedSteps.some(step => step.isCompleted)
      
      // Determine new status with proper type
      const newStatus: ProjectStatus = allCompleted ? "Completed" 
        : someCompleted ? "In Progress" 
        : "Not Started"
  
      // Ensure metrics object maintains all required fields
      const updatedMetrics = {
        views: idea.metrics?.views ?? 0,
        clicks: idea.metrics?.clicks ?? 0,
        lastUpdated: new Date(),
        ...(allCompleted && !wasCompleted ? {
          completedAt: new Date(),
          timeToComplete: Math.round(
            (new Date().getTime() - new Date(idea.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          )
        } : {}),
        ...(idea.metrics?.completedAt ? { completedAt: idea.metrics.completedAt } : {}),
        ...(idea.metrics?.timeToComplete ? { timeToComplete: idea.metrics.timeToComplete } : {})
      }
  
      // Create properly typed update object
      const ideaUpdates: Partial<Idea> = {
        steps: updatedSteps,
        status: newStatus,
        metrics: updatedMetrics
      }
  
      // Update in database
      await updateIdea(idea.id, ideaUpdates)
      
      // Update local state with proper typing
      setIdeas(ideas.map(i => 
        i.id === idea.id 
          ? { ...i, ...ideaUpdates } 
          : i
      ))
      
      toast.success("Progress updated")
    } catch (error) {
      console.error("Error updating progress:", error)
      toast.error("Failed to update progress")
    }
  }
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Visibility</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading ideas...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : ideas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="text-center p-4 text-muted-foreground">
                  No ideas found. Create your first idea!
                </div>
              </TableCell>
            </TableRow>
          ) : (
            ideas.map((idea) => (
              <TableRow key={idea.id}>
                <TableCell>
                  <div className="space-y-2">
                    <div className="font-medium">{idea.name}</div>
                    <Progress 
                      value={getProgress(idea.steps || [])} 
                      className="h-1 w-full"
                    />
                  </div>
                </TableCell>
                <TableCell>{idea.category}</TableCell>
                <TableCell>
                  <Badge className={statusColors[idea.status]}>
                    {idea.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {idea.metrics?.lastUpdated && 
                    formatDistanceToNow(new Date(idea.metrics.lastUpdated), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {idea.isPublic ? (
                    <Globe className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-slate-600" />
                  )}
                </TableCell>
                <TableCell>
                <div className="flex items-center gap-2">
    <ManageIdeaSheet 
      idea={idea}
      onUpdateProgress={handleProgressUpdate}
    />
    {idea.productionUrl && (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => window.open(idea.productionUrl, '_blank')}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    )}
  </div>                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}