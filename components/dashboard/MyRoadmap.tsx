"use client"

import { defaultSteps, Idea, Step, Resource } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { 
  Trophy, Flag, Lightbulb, ScrollText, Code, 
  TestTube, Rocket, Plus, Link as LinkIcon, 
  BookOpen, FileCode, BookMarked, 
  Wrench, Trash2, ChevronDown, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { addResource } from '@/app/api/firebaseApi'
import ResourceModal from './ResourceModal'
import { toast } from 'sonner'
import { useState } from 'react'

interface MyRoadmapProps {
  idea: Idea
  onUpdateProgress: (idea: Idea, steps: Step[]) => Promise<void>
  onDeleteResource?: (resourceId: string) => Promise<void>
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

export default function MyRoadmap({ idea, onUpdateProgress, onDeleteResource }: MyRoadmapProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const [activeResourceStep, setActiveResourceStep] = useState<string | null>(null)

  const steps = idea.steps || defaultSteps
  const completedSteps = steps.filter(s => s.isCompleted).length

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

const handleStepToggle = async (stepId: string) => {
  try {
    const updatedSteps = steps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          isCompleted: !s.isCompleted,
          completedAt: !s.isCompleted ? new Date() : null
        };
      }
      return s;
    });

    await onUpdateProgress(idea, updatedSteps);
    
    // Only update UI after successful API call
    setActiveStep(stepId);
  } catch (error) {
    console.error('Failed to update step:', error);
    toast.error('Failed to update step status');
  }
};
  


  const handleAddResource = async (
    stepId: string,
    resourceData: Omit<Resource, "id" | "addedAt" | "userId" | "ideaId" | "stepId">
  ) => {
    try {
      await addResource(idea.id, stepId, resourceData)
      setResourceModalOpen(false)
      setActiveResourceStep(null)
      toast.success('Resource added successfully')
    } catch (error) {
      console.error('Failed to add resource:', error)
      toast.error('Failed to add resource')
    }
  }

  // Summary stats component
  const StatsSection = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-2xl font-bold">{completedSteps}/{steps.length}</div>
        <div className="text-sm text-muted-foreground">Steps Completed</div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-2xl font-bold">{idea.resources?.length || 0}</div>
        <div className="text-sm text-muted-foreground">Total Resources</div>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <div className="text-2xl font-bold">
          {new Set(idea.resources?.map(r => r.stepId)).size}
        </div>
        <div className="text-sm text-muted-foreground">Steps with Resources</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <StatsSection />

      {/* Progress Bar */}
      <div className="relative h-2 bg-border rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
          style={{ width: `${(completedSteps / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons] || Trophy
          const isExpanded = expandedSteps.has(step.id)
          const resources = idea.resources?.filter(r => r.stepId === step.id) || []

          return (
            <Collapsible
              key={step.id}
              open={isExpanded}
              onOpenChange={() => toggleStep(step.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "p-4 rounded-lg border transition-colors",
                  step.isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-muted",
                  "hover:border-primary/50"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        step.isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        step.id === activeStep && "font-bold" 
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={step.id}
                          checked={step.isCompleted}
                          onCheckedChange={() => handleStepToggle(step.id)}
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="text-left">
                          <Label className="font-medium">{step.name}</Label>
                          {resources.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {resources.length} resource{resources.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.completedAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(
                            //@ts-expect-error time value is in micro seconds
                            step.completedAt * 1000), 'MMM dd')}
                        </span>
                      )}
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-2 ml-11 pl-4 border-l space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Resources Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">Resources</h4>
                        {resources.length > 0 && (
                          <Badge variant="secondary">
                            {resources.length}
                          </Badge>
                        )}
                      </div>
                      <Dialog open={resourceModalOpen && activeResourceStep === step.id}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveResourceStep(step.id)
                              setResourceModalOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Resource
                          </Button>
                        </DialogTrigger>
                        {resourceModalOpen && activeResourceStep === step.id && (
                          <ResourceModal 
                            onSubmit={async (resource) => {
                              await handleAddResource(step.id, resource)
                            }}
                          />
                        )}
                      </Dialog>
                    </div>

                    {resources.length > 0 ? (
                      <div className="space-y-2">
                        {resources.map((resource) => {
                          const TypeIcon = resourceTypeIcons[resource.type || 'other']
                          return (
                            <div
                              key={resource.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted group"
                            >
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 hover:text-primary truncate"
                                onClick={e => e.stopPropagation()}
                              >
                                {resource.title}
                              </a>
                              <Badge variant="secondary" className="opacity-50 group-hover:opacity-100">
                                {resource.type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (onDeleteResource) {
                                    toast.promise(
                                      onDeleteResource(resource.id),
                                      {
                                        loading: 'Deleting resource...',
                                        success: 'Resource deleted',
                                        error: 'Failed to delete resource'
                                      }
                                    )
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No resources added yet
                      </p>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}