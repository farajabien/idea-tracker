import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BuildingStep {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function BuildingJourney({ steps }: { steps: BuildingStep[] }) {
  return (
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
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <ArrowRight className="absolute -right-6 top-12 text-muted-foreground hidden lg:block" />
                  )}
                  
                  {/* Step Card */}
                  <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-8 px-4 pb-6 text-center">
                      <div className={cn(
                        "absolute -top-8 left-1/2 -translate-x-1/2",
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        "bg-primary text-primary-foreground",
                        "border-4 border-background shadow-lg"
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
  );
}

