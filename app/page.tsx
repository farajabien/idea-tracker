import Link from "next/link"
import { getPublicProjects, getTopBuilders } from "@/app/api/firebaseApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TopBuilders from "@/components/landing/TopBuilders"
import FeaturedProjects from "@/components/landing/FeaturedProjects"
import { ProjectCategory } from "@/lib/types"
import { getCategoryIcon } from "@/components/ui/icons"

export const revalidate = 3600 // Revalidate every hour

export default async function LandingPage() {
  const [topProjects, topBuilders] = await Promise.all([
    getPublicProjects(6),
    getTopBuilders(5)
  ])

  const categories: ProjectCategory[] = [
    "Web App",
    "Mobile App",
    "Chrome Extension",
    "API",
    "CLI Tool",
    "Library"
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Track Your Ideas, Share Your Builds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The platform for indie builders to track projects from idea to launch, and showcase their successful builds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Start Building</Button>
            </Link>
            <Link href="#featured">
              <Button size="lg" variant="outline">View Projects</Button>
            </Link>
          </div>
        </div>
      </section>

    {/* Featured Projects */}
<section id="featured" className="py-16 container">
  <div className="space-y-8">
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-center">Featured Projects</h2>
      <p className="text-muted-foreground text-center max-w-2xl">
        Discover the latest projects from our community of indie builders
      </p>
    </div>
    <FeaturedProjects projects={topProjects} />
  </div>
</section>

{/* Categories */}
<section className="py-16 bg-muted">
  <div className="container space-y-8">
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-center">Browse by Category</h2>
      <p className="text-muted-foreground text-center max-w-2xl">
        Find projects by type and technology
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category} href={`/projects/category/${category.toLowerCase()}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-sm">{category}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl text-muted-foreground">
              {getCategoryIcon(category)}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Top Builders */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold mb-8 text-center">Top Builders</h2>
        <TopBuilders builders={topBuilders} />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of indie builders and start tracking your next big idea.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
