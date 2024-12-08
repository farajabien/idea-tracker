"use client"

import React, { useEffect, useState } from "react"
import { Table, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lock, Globe, ExternalLink, Eye, Clock, Trash2 } from "lucide-react"
import { getIdeas, updateIdea } from "@/app/api/firebaseApi"
import { Idea, ProjectStatus, Step } from "@/lib/types"
import {  formatDistanceToNow } from "date-fns"
import LoginForm from "../auth/LoginForm"
import { useAuth } from "../providers/AuthProvider"
import { toast } from "sonner"
import { Progress } from "../ui/progress"

import ManageIdeaSheet from "./ManageIdeaSheet"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import DeleteIdeaDialog from "./DeleteIdeaDialog"

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
  const [deleteIdea, setDeleteIdea] = useState<{ id: string; name: string } | null>(null)

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

  const handleProgressUpdate = async (idea: Idea, steps: Step[]) => {
    try {
      const allCompleted = steps.every(step => step.isCompleted)
      const wasCompleted = idea.status === "Completed"
      const someCompleted = steps.some(step => step.isCompleted)

      // Determine new status
      const newStatus: ProjectStatus = allCompleted ? "Completed" 
        : someCompleted ? "In Progress" 
        : "Not Started"
  
      // Create clean metrics object
      const metrics = {
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

      // Create the update object
      const ideaUpdates: Partial<Idea> = {
        steps,
        status: newStatus,
        metrics: {
          ...metrics,
          progress: {
            currentStep: idea.metrics?.progress?.currentStep ?? 0,
            totalSteps: idea.metrics?.progress?.totalSteps ?? 0,
            completedSteps: idea.metrics?.progress?.completedSteps ?? 0,
            lastUpdated: new Date()
          }
        }
      }
  
      await updateIdea(idea.id, ideaUpdates)
      // Update local state
      setIdeas(ideas.map(i => 
        i.id === idea.id 
          ? { ...i, ...ideaUpdates }
          : i
      ))
      
    } catch (error) {
      console.error("Error updating progress:", error)
      toast.error("Failed to update progress")
      throw error
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Table for desktop */}
      <div className="hidden md:block rounded-md border">
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
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6}>
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
                        onUpdateProgress={(idea, steps) => handleProgressUpdate(idea, steps)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteIdea({ id: idea.id, name: idea.name })}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {idea.productionUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(idea.productionUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards for mobile */}
      <div className="grid gap-4 md:hidden">
        {ideas.map((idea) => (
          <Card key={idea.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{idea.name}</CardTitle>
                <Badge className={statusColors[idea.status]}>
                  {idea.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{idea.metrics?.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDistanceToNow(new Date(idea.metrics?.lastUpdated || Date.now()), { addSuffix: true })}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex gap-2 w-full">
                <ManageIdeaSheet 
                  idea={idea}
                  onUpdateProgress={(idea, steps) => handleProgressUpdate(idea, steps)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteIdea({ id: idea.id, name: idea.name })}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {idea.productionUrl && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(idea.productionUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <DeleteIdeaDialog
        ideaId={deleteIdea?.id || ""}
        ideaName={deleteIdea?.name || ""}
        open={!!deleteIdea}
        onOpenChange={(open) => !open && setDeleteIdea(null)}
        onDeleted={() => {
          setIdeas(ideas.filter(i => i.id !== deleteIdea?.id))
        }}
      />
    </div>
  )
}