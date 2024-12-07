// components/dashboard/DashboardClient.tsx
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IdeaList from "./IdeaList"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"

export default function DashboardClient() {
  const [selectedTab, setSelectedTab] = useState("all")



  return (
    <main className="container py-6">
      <DashboardHeader />
      
      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
        {/* Sidebar */}
        <div className="md:col-span-1 lg:col-span-2">
          <Sidebar className="rounded-lg border p-4" />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 lg:col-span-4">
          <Tabs 
            defaultValue="all" 
            className="space-y-4"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList>
              <TabsTrigger value="all">All Ideas</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <IdeaList filter="all" />
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              <IdeaList filter="in-progress" />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <IdeaList filter="completed" />
            </TabsContent>
            
            <TabsContent value="public" className="space-y-4">
              <IdeaList filter="public" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}