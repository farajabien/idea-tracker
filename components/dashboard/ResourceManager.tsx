"use client"

import { useState, useEffect } from "react"
import { addResource, getResourcesForIdea, deleteResource } from "../../app/api/firebaseApi"
import { Resource } from "../../lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ResourceManagerProps {
  ideaId: string
  stepId: string
}

export default function ResourceManager({ ideaId, stepId }: ResourceManagerProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    type: "inspiration" as Resource["type"],
    notes: ""
  })

  useEffect(() => {
    fetchResources()
  }, [ideaId, stepId])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const data = await getResourcesForIdea(ideaId)
      setResources(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load resources")
    } finally {
      setLoading(false)
    }
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await addResource(ideaId, stepId, newResource)
      await fetchResources()
      setNewResource({
        title: "",
        url: "",
        type: "inspiration",
        notes: ""
      })
      toast.success("Resource added successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add resource")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(ideaId, resourceId)
      await fetchResources()
      toast.success("Resource deleted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete resource")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Resource Form */}
      <form onSubmit={handleAddResource} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            placeholder="Resource title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={newResource.url}
            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
            placeholder="https://"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={newResource.type}
            onValueChange={(value) => setNewResource({ ...newResource, type: value as Resource["type"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inspiration">Inspiration</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={newResource.notes}
            onChange={(e) => setNewResource({ ...newResource, notes: e.target.value })}
            placeholder="Add any helpful notes..."
            className="h-20"
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Resource
        </Button>
      </form>

      {/* Resources List */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No resources added yet
          </p>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{resource.title}</h4>
                    </div>
                    {resource.notes && (
                      <p className="text-sm text-muted-foreground">
                        {resource.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this resource? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}