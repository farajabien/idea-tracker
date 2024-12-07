"use client"

import { defaultSteps, Idea, Step } from '@/lib/types'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Trophy, Flag, Lightbulb, ScrollText, Code, TestTube, Rocket } from 'lucide-react'

interface MyRoadmapProps {
  idea: Idea
  onUpdateProgress: (idea: Idea, steps: Step[]) => Promise<void>
}

const stepIcons = {
  idea: Lightbulb,
  research: ScrollText,
  design: Flag,
  mvp: Code,
  testing: TestTube,
  launch: Rocket
}

export default function MyRoadmap({ idea, onUpdateProgress }: MyRoadmapProps) {
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

  const steps = idea.steps || defaultSteps
  
  return (
    <div className="relative pl-8 my-4">
      {/* Vertical Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

      {steps.map((step, index) => {
        const Icon = stepIcons[step.id as keyof typeof stepIcons] || Trophy
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className={cn(
            "relative mb-8",
            !isLast && "pb-8"
          )}>
            {/* Connection Line */}
            <div className={cn(
              "absolute -left-8 top-0 bottom-0 w-px",
              step.isCompleted ? "bg-primary" : "bg-muted"
            )} />

            {/* Step Node */}
            <div className={cn(
              "absolute -left-10 rounded-full p-2",
              step.isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Step Content */}
            <div className={cn(
              "ml-4 p-4 rounded-lg border transition-colors",
              step.isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-muted",
              "hover:border-primary/50"
            )}>
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
                    {step.completedAt && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(step.completedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getStepDescription(step.id)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStepDescription(stepId: string): string {
  switch (stepId) {
    case 'idea':
      return 'Define the core concept and target audience'
    case 'research':
      return 'Analyze market and plan requirements'
    case 'design':
      return 'Create mockups and user flows'
    case 'mvp':
      return 'Build the core functionality'
    case 'testing':
      return 'Test features and gather feedback'
    case 'launch':
      return 'Deploy and share with the world'
    default:
      return ''
  }
}