// components/dashboard/DashboardClient.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IdeaList from "./IdeaList"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getIdeas } from "@/app/api/firebaseApi"
import { Idea } from "@/lib/types"

interface DashboardStats {
  totalIdeas: number;
  completedIdeas: number;
  inProgressIdeas: number;
  publicIdeas: number;
}

type FilterValue = 'all' | 'in-progress' | 'completed' | 'public';

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    completedIdeas: 0,
    inProgressIdeas: 0,
    publicIdeas: 0
  });

  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('all');

  const handleValueChange = (value: string) => {
    setSelectedFilter(value as FilterValue);
  };

  useEffect(() => {
    const calculateStats = (ideas: Idea[]) => {
      setStats({
        totalIdeas: ideas.length,
        completedIdeas: ideas.filter(i => i.status === "Completed").length,
        inProgressIdeas: ideas.filter(i => i.status === "In Progress").length,
        publicIdeas: ideas.filter(i => i.isPublic).length
      });
    };

    // Get ideas and calculate stats
    getIdeas().then(calculateStats);
  }, []);

  return (
    <main className="container py-6 px-4 md:px-6">
      <DashboardHeader />
      
      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
        {/* Sidebar - Hidden on mobile, shown as bottom sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden w-full mb-4">
              <Menu className="h-4 w-4 mr-2" />
              View Stats
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <Sidebar className="h-full overflow-auto" />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-1 lg:col-span-2">
          <Sidebar className="rounded-lg border p-4 sticky top-4" />
        </div>

        {/* Main Content - Full width on mobile */}
        <div className="md:col-span-3 lg:col-span-4">
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalIdeas}</div>
              </CardContent>
            </Card>
            
            {/* Add similar cards for other stats */}
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="space-y-4"
            value={selectedFilter}
            onValueChange={handleValueChange}
          >
            <TabsList className="w-full flex">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="in-progress" className="flex-1">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Done</TabsTrigger>
              <TabsTrigger value="public" className="flex-1">Public</TabsTrigger>
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