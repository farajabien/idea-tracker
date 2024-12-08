"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddIdeaDialog from "./AddIdeaDialog"
import { UserNav } from "./UserNav"

export default function DashboardHeader() {
  const [showAddIdea, setShowAddIdea] = useState(false)

  return (
    <div className="flex h-16 items-center px-4 border-b gap-4 mb-4 md:mb-8">
      <div className="flex flex-1 items-center">
        <Link href="/dashboard" className="font-semibold">
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          onClick={() => setShowAddIdea(true)} 
          size="sm"
          className="px-2 md:px-4"
        >
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">New Idea</span>
        </Button>
        <UserNav />
      </div>

      <AddIdeaDialog 
        open={showAddIdea} 
        onOpenChange={setShowAddIdea}
      />
    </div>
  )
}
