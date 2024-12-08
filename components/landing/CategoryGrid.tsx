import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCategory } from "@/lib/types";
import { getCategoryIcon } from "@/components/ui/icons";

export default function CategoryGrid({ categories }: { categories: ProjectCategory[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category} href={`/projects/category/${category.toLowerCase()}`}>
          <Card
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30"
            aria-label={`View projects in ${category}`}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-sm">{category}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-2xl text-primary">
              {getCategoryIcon(category)}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

