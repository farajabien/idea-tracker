"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BuilderStats } from "@/lib/types"
import { Trophy, Eye, MousePointerClick, ArrowUpRight, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TopBuildersProps {
  builders: BuilderStats[]
}

export default function TopBuilders({ builders }: TopBuildersProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {builders.map((builder, index) => (
          <Card key={builder.userId} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg group">
                  <Link 
                    href={`/builder/${builder.userId}`}
                    className="hover:text-primary inline-flex items-center gap-1"
                  >
                    {builder.builderName}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </CardTitle>
                {index < 3 && (
                  <Trophy className={
                    index === 0 ? "text-yellow-500" :
                    index === 1 ? "text-gray-400" :
                    "text-amber-600"
                  } />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{builder.totalViews.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{builder.totalClicks.toLocaleString()} clicks</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {builder.completedProjects} completed
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(builder.lastShipped), { addSuffix: true })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {builder.projectCategories.map(category => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            {builder.streak && builder.streak > 0 && (
              <CardFooter className="pt-4">
                <div className="w-full text-center text-sm text-muted-foreground">
                  🔥 {builder.streak} day shipping streak
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {builders.length === 0 && (
        <div className="text-center text-muted-foreground">
          No builders found
        </div>
      )}
    </div>
  )
}