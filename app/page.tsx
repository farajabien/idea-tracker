import Link from "next/link";
import { getPublicProjects, getTopBuilders } from "@/app/api/firebaseApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopBuilders from "@/components/landing/TopBuilders";
import FeaturedProjects from "@/components/landing/FeaturedProjects";
import { ProjectCategory } from "@/lib/types";
import { getCategoryIcon } from "@/components/ui/icons";
import { 
  Lightbulb, ScrollText, Flag, Code, TestTube, 
  Rocket, ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const buildingSteps = [
  {
    icon: Lightbulb,
    title: "Ideate",
    description: "Define your core idea and target audience",
  },
  {
    icon: ScrollText,
    title: "Plan",
    description: "Research the market and plan your roadmap",
  },
  {
    icon: Flag,
    title: "Design",
    description: "Create mockups and user flows",
  },
  {
    icon: Code,
    title: "Build",
    description: "Develop your MVP with core features",
  },
  {
    icon: TestTube,
    title: "Test",
    description: "Gather feedback and iterate",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Ship your product to the world",
  },
];

export default async function LandingPage() {
  const [topProjects, topBuilders] = await Promise.all([
    getPublicProjects(6),
    getTopBuilders(5),
  ]);

  const categories: ProjectCategory[] = [
    "Web App", "Mobile App", "Chrome Extension",
    "API", "CLI Tool", "Library",
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Track Your Ideas, Share Your Builds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The platform for indie builders to track projects from idea to
            launch, and showcase their successful builds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Start Building</Button>
            </Link>
            <Link href="#featured">
              <Button size="lg" variant="outline">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Building Journey Section */}
      <section className="py-16">
        <div className="container space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Your Building Journey
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Track your progress from idea to launch with our structured roadmap.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Progress Bar */}
            <div className="absolute top-14 left-0 right-0 h-1 bg-border">
              <div className="absolute left-0 h-full bg-primary" style={{ width: "100%" }} />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {buildingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    {/* Connector Line */}
                    {index < buildingSteps.length - 1 && (
                      <ArrowRight className="absolute -right-6 top-12 text-muted-foreground hidden lg:block" />
                    )}
                    
                    {/* Step Card */}
                    <Card className="relative">
                      <CardContent className="pt-8 px-4 pb-6 text-center">
                        <div className={cn(
                          "absolute -top-8 left-1/2 -translate-x-1/2",
                          "w-16 h-16 rounded-full flex items-center justify-center",
                          "bg-primary text-primary-foreground",
                          "border-4 border-background"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold mt-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="featured" className="py-16 container">
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Featured Projects
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Discover successful projects from our builder community.
            </p>
          </div>
          <FeaturedProjects projects={topProjects} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="container space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Find projects by type and technology.
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Top Builders */}
      <section className="py-16 container">
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center">Top Builders</h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Meet our most successful indie builders.
            </p>
          </div>
          <TopBuilders builders={topBuilders} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of indie builders and start tracking your next
            big idea.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
// Extracted CategoryGrid Component
function CategoryGrid({ categories }: { categories: ProjectCategory[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category} href={`/projects/category/${category.toLowerCase()}`}>
          <Card
            className="hover:shadow-lg hover:scale-105 transition-transform duration-200"
            aria-label={`View projects in ${category}`}
          >
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
  );
}
