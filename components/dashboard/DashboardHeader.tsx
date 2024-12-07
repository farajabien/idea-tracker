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
    <div className="flex h-16 items-center px-4 border-b gap-4 mb-8">
      <div className="flex flex-1">
        <Link href="/dashboard" className="font-semibold">
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={() => setShowAddIdea(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Idea
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
