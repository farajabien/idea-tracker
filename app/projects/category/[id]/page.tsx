// app/projects/category/[id]/page.tsx
import { Metadata } from "next"
import { getProjectsByCategory } from "@/app/api/firebaseApi"
import { ProjectCategory } from "@/lib/types"
import FeaturedProjects from "@/components/landing/FeaturedProjects"
import { Separator } from "@/components/ui/separator"
import { getCategoryIcon } from "@/components/ui/icons"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  // Convert URL-safe category ID back to proper format
  const category = decodeURIComponent(params.id)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") as ProjectCategory

  return {
    title: `${category} Projects | Idea Tracker`,
    description: `Discover ${category} projects built by indie developers and makers.`
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Convert URL param to proper category format
  const category = decodeURIComponent(params.id)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") as ProjectCategory

  const projects = await getProjectsByCategory(category)

  return (
    <main className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-lg">
          {getCategoryIcon(category)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{category} Projects</h1>
          <p className="text-muted-foreground">
            Discover what builders are creating in this category
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {projects.length} projects
            </p>
          </div>
          {/* Add filter/sort options here if needed */}
        </div>

        <FeaturedProjects 
          projects={projects}
          category={category}
        />
      </div>
    </main>
  )
}