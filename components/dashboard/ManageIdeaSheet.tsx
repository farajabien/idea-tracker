"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Globe, Lock } from "lucide-react"
import {  Idea, Step } from "@/lib/types"

import MyRoadmap from "./MyRoadmap"

interface ManageIdeaSheetProps {
  idea: Idea
  onUpdateProgress: (idea: Idea, steps: Step[]) => Promise<void>
}

export default function ManageIdeaSheet({ idea, onUpdateProgress }: ManageIdeaSheetProps) {
  const getProgress = (steps: Step[]) => {
    if (!steps || steps.length === 0) return 0
    return Math.round((steps.filter(step => step.isCompleted).length / steps.length) * 100)
  }


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="space-y-1">
          <SheetTitle>Manage Project</SheetTitle>
          <SheetDescription>
            Track progress and manage settings for {idea.name}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="progress" className="mt-6">
          <TabsList>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Overall Progress</Label>
                <span className="text-sm text-muted-foreground">
                  {getProgress(idea.steps || [])}%
                </span>
              </div>
              <Progress value={getProgress(idea.steps || [])} className="h-2" />
            </div>

            <ScrollArea className="h-[60vh] pr-4">
             <MyRoadmap idea={idea} onUpdateProgress={onUpdateProgress}/>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <p className="text-sm text-muted-foreground mt-1">{idea.category || 'Not set'}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{idea.description || 'No description'}</p>
              </div>
              {idea.productionUrl && (
                <div>
                  <Label>Production URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(idea.productionUrl, '_blank')}
                      className="h-8 px-2"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Visibility</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {idea.isPublic ? (
                      <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-green-600" />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="h-4 w-4 text-slate-600" />
                        Private
                      </span>
                    )}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {idea.isPublic ? 'Make Private' : 'Make Public'}
                </Button>
              </div>

              <div>
                <Label>Builder Profile</Label>
                <div className="space-y-2 mt-2">
                  {idea.builderProfile?.twitter && (
                    <p className="text-sm">Twitter: @{idea.builderProfile.twitter}</p>
                  )}
                  {idea.builderProfile?.github && (
                    <p className="text-sm">GitHub: {idea.builderProfile.github}</p>
                  )}
                  {idea.builderProfile?.website && (
                    <p className="text-sm">Website: {idea.builderProfile.website}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}