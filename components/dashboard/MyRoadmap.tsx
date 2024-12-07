"use client"

import { defaultSteps, Idea, Step, Resource } from '@/lib/types'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { 
  Trophy, Flag, Lightbulb, ScrollText, Code, 
  TestTube, Rocket, Plus, Link as LinkIcon, 
   BookOpen, FileCode, BookMarked, 
   Wrench
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '../ui/textarea'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { addResource } from '@/app/api/firebaseApi'

interface MyRoadmapProps {
  idea: Idea
  onUpdateProgress: (idea: Idea, steps: Step[]) => Promise<void>
  onAddResource?: (stepId: string, resource: Omit<Resource, "id" | "addedAt" | "userId">) => Promise<void>
  onDeleteResource?:  (resourceId: string) => Promise<void>
}

const stepIcons = {
  idea: Lightbulb,
  validation: ScrollText,
  planning: Flag,
  prototyping: Code,
  development: FileCode,
  testing: TestTube,
  launch: Rocket,
  promote: BookMarked,
  analyze: Trophy,
}

const resourceTypeIcons = {
  inspiration: Lightbulb,
  tutorial: BookOpen,
  tool: Wrench,
  documentation: FileCode,
  other: LinkIcon,
}

export default function MyRoadmap({ idea, onUpdateProgress, onAddResource, onDeleteResource }: MyRoadmapProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    type: 'inspiration' as Resource['type'],
    notes: ''
  })

  const handleStepToggle = async (stepId: string) => {
    const updatedSteps = (idea.steps || defaultSteps).map(s =>
      s.id === stepId ? {
        ...s,
        isCompleted: !s.isCompleted,
        completedAt: !s.isCompleted ? new Date() : null
      } : s
    )
    await onUpdateProgress(idea, updatedSteps)
  }

  const handleAddResource = async (stepId: string, resourceData: Omit<Resource, "id" | "addedAt" | "userId" | "ideaId" | "stepId">) => {
    if (onAddResource) {

    await addResource(idea.id, stepId, resourceData);
 
      setNewResource({
        title: '',
        url: '',
        type: 'inspiration',
        notes: ''
      })
      setActiveStep(null)
    }
  }

  const steps = idea.steps || defaultSteps

  return (
    <div className="space-y-8">
      {/* Horizontal Progress Dots */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-border" />
        <div 
          className={cn("absolute top-4 left-0 h-px bg-primary transition-all duration-500",
            activeStep ? "bg-primary-500" : ""
          )}
          style={{ 
            width: `${(steps.filter(s => s.isCompleted).length / steps.length) * 100}%` 
          }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const Icon = stepIcons[step.id as keyof typeof stepIcons] || Trophy
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  "transition-colors duration-300",
                  step.isCompleted 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border bg-background text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground mt-1 text-center">
                  {step.name.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-8">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

        {steps.map((step, index) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons] || Trophy
          const isLast = index === steps.length - 1
          const resources = idea.resources?.filter(r => r.stepId === step.id) || []

          return (
            <div key={step.id} className={cn(
              "relative mb-8",
              !isLast && "pb-8"
            )}>
              <div className={cn(
                "absolute -left-8 top-0 bottom-0 w-px",
                step.isCompleted ? "bg-primary" : "bg-muted"
              )} />

              <div className={cn(
                "absolute -left-10 rounded-full p-2",
                step.isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>

              <div className={cn(
                "ml-4 p-4 rounded-lg border transition-colors",
                step.isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-muted",
                "hover:border-primary/50"
              )}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={step.id}
                      checked={step.isCompleted}
                      onCheckedChange={() => handleStepToggle(step.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={step.id}
                          className={cn(
                            "font-medium cursor-pointer",
                            step.isCompleted && "text-primary"
                          )}
                        >
                          {step.name}
                        </Label>
                        <span className="text-xs text-muted-foreground">
  {step.completedAt && (
    <span>
      {format(new Date(Number(step.completedAt) / 1000), 'MMM dd, yyyy')}
    </span>
  )}
</span>


                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Resources Section */}
                  <div className="pl-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Resources</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Resource
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Resource</DialogTitle>
                            <DialogDescription>
                              Add helpful resources for this step
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                placeholder="Resource title"
                                value={newResource.title}
                                onChange={e => setNewResource({
                                  ...newResource,
                                  title: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <Input
                                placeholder="https://"
                                value={newResource.url}
                                onChange={e => setNewResource({
                                  ...newResource,
                                  url: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={newResource.type}
                                onValueChange={value => setNewResource({
                                  ...newResource,
                                  type: value as Resource['type']
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
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
                              <Label>Notes</Label>
                              <Textarea
                                placeholder="Add notes about this resource..."
                                value={newResource.notes}
                                onChange={e => setNewResource({
                                  ...newResource,
                                  notes: e.target.value
                                })}
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleAddResource(step.id, newResource)}
                            >
                              Add Resource
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {resources.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {resources.map((resource) => {
                          const TypeIcon = resourceTypeIcons[resource.type || 'other']
                          return (
                            <div
                              key={resource.id}
                              className="flex items-start space-x-2 text-sm"
                            >
                              <TypeIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary"
                                  >
                                    {resource.title}
                                  </a>
                                  <Badge variant="secondary">
                                    {resource.type}
                                  </Badge>
                                  <Button onClick={() => onDeleteResource && onDeleteResource(resource.id)}>
                                    Delete
                                  </Button>
                                </div>
                                {resource.notes && (
                                  <p className="text-muted-foreground mt-1">
                                    {resource.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No resources added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}