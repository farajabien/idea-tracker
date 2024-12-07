"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Idea, ProjectCategory } from "@/lib/types"
import { Eye, MousePointerClick, ExternalLink, Github, ArrowUpRight } from "lucide-react"
import FeaturedProjectsSkeleton from "./FeaturedProjectsSkeleton"
import { getPublicProjects } from "@/app/api/firebaseApi"

interface FeaturedProjectsProps {
  projects?: Idea[]
  limit?: number
  category?: ProjectCategory
}


export default function FeaturedProjects({ 
  projects: initialProjects, 
  limit = 6,
  category 
}: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<Idea[]>(initialProjects || [])
  const [loading, setLoading] = useState(!initialProjects)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialProjects) {
      const loadProjects = async () => {
        try {
          const data = await getPublicProjects(limit, category)
          setProjects(data)
        } catch (err) {
          setError("Failed to load featured projects")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      loadProjects()
    }
  }, [initialProjects, limit, category])

  if (loading) return <FeaturedProjectsSkeleton />
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg group">
                  <Link 
                    href={`/project/${project.id}`}
                    className="hover:text-primary inline-flex items-center gap-1"
                  >
                    {project.name}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </CardTitle>
                <Badge variant={
                  project.status === "Completed" ? "default" :
                  project.status === "In Progress" ? "secondary" :
                  "outline"
                }>
                  {project.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                by{" "}
                <Link 
                  href={`/builder/${project.userId}`}
                  className="hover:text-primary"
                >
                  {project.builderProfile?.twitter || "Anonymous Builder"}
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.metrics?.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.metrics?.clicks || 0}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2 pt-4">
              {project.productionUrl && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={project.productionUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </Link>
                </Button>
              )}
              {project.builderProfile?.github && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://github.com/${project.builderProfile.github}`} target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center text-muted-foreground">
          No projects found
        </div>
      )}
    </div>
  )
}