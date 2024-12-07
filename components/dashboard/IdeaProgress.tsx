// components/dashboard/IdeaProgress.tsx
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { format } from "date-fns"
import { useState } from "react"
import { Step, Idea } from "@/lib/types"

const defaultSteps: Omit<Step, "completedAt" | "isCompleted">[] = [
  {
    id: "ideation",
    name: "Define Core Idea",
  },
  {
    id: "planning",
    name: "Plan Requirements",
  },
  {
    id: "design",
    name: "Design & Mockups",
  },
  {
    id: "development",
    name: "Core Development",
  },
  {
    id: "testing",
    name: "Testing & QA",
  },
  {
    id: "launch",
    name: "Launch & Share",
  }
]

interface IdeaProgressProps {
  idea: Idea
  onUpdateProgress?: (steps: Step[]) => void
}

export function IdeaProgressBar({ steps }: { steps: Step[] }) {
  const completedSteps = steps.filter(step => step.isCompleted).length
  const progress = Math.round((completedSteps / steps.length) * 100)
  
  return (
    <div className="w-full space-y-1">
      <Progress value={progress} className="h-1" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{completedSteps}/{steps.length} completed</span>
        <span>{progress}%</span>
      </div>
    </div>
  )
}

export function IdeaProgressSheet({ idea, onUpdateProgress }: IdeaProgressProps) {
  const [steps, setSteps] = useState<Step[]>(() => {
    if (idea.steps?.length > 0) {
      return idea.steps;
    }
    // Initialize with default steps if none exist
    return defaultSteps.map(step => ({
      ...step,
      isCompleted: false,
      completedAt: null
    }));
  })

  const handleStepToggle = (stepId: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? {
        ...step,
        isCompleted: !step.isCompleted,
        completedAt: !step.isCompleted ? new Date() : null
      } : step
    )
    setSteps(updatedSteps)
    onUpdateProgress?.(updatedSteps)
  }

  const progress = Math.round((steps.filter(step => step.isCompleted).length / steps.length) * 100)

  return (
    <>
      <SheetHeader>
        <SheetTitle>Project Progress</SheetTitle>
        <SheetDescription>
          Track milestones for {idea.name}
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Label>Overall Progress</Label>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <ScrollArea className="h-[70vh] mt-6">
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3 py-2">
              <Checkbox
                id={step.id}
                checked={step.isCompleted}
                onCheckedChange={() => handleStepToggle(step.id)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={step.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {step.name}
                  </Label>
                  {step.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(step.completedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}