import { ProjectCategory, Step } from "./types"
import { v4 as uuidv4 } from 'uuid'

// Base steps that every project should have
const baseSteps: Step[] = [
  {
    id: uuidv4(),
    name: "Project Setup",
    description: "Initialize project and set up development environment",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "1 day",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Documentation",
    description: "Create project documentation and README",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "1 day",
    resources: []
  }
]

const webAppSteps: Step[] = [
  {
    id: uuidv4(),
    name: "UI/UX Design",
    description: "Design user interface and user experience",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "2-3 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Frontend Development",
    description: "Implement user interface and client-side functionality",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "5-7 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Backend Development",
    description: "Set up server, database, and API endpoints",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "5-7 days",
    resources: []
  }
]

const websiteSteps: Step[] = [
  {
    id: uuidv4(),
    name: "Content Strategy",
    description: "Plan website content and structure",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "2-3 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Design",
    description: "Create website design and branding",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "3-4 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Development",
    description: "Build and test the website",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "4-5 days",
    resources: []
  }
]

const mobileAppSteps: Step[] = [
  {
    id: uuidv4(),
    name: "App Design",
    description: "Design mobile app UI/UX",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "3-4 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Core Development",
    description: "Implement core app functionality",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "7-10 days",
    resources: []
  },
  {
    id: uuidv4(),
    name: "Testing",
    description: "Test on different devices and platforms",
    isCompleted: false,
    completedAt: null,
    estimatedDuration: "3-4 days",
    resources: []
  }
]

// Helper function to combine base steps with template steps
const combineSteps = (templateSteps: Step[]): Step[] => {
  return [
    ...baseSteps,
    ...templateSteps,
    {
      id: uuidv4(),
      name: "Testing & QA",
      description: "Final testing and quality assurance",
      isCompleted: false,
      completedAt: null,
      estimatedDuration: "2-3 days",
      resources: []
    },
    {
      id: uuidv4(),
      name: "Deployment",
      description: "Deploy project to production",
      isCompleted: false,
      completedAt: null,
      estimatedDuration: "1-2 days",
      resources: []
    }
  ]
}

export const getTemplateByType = (category: ProjectCategory): Step[] => {
  switch (category) {
    case "Web App":
      return combineSteps(webAppSteps)
    case "Website":
      return combineSteps(websiteSteps)
    case "Mobile App":
      return combineSteps(mobileAppSteps)
    case "Chrome Extension":
      return combineSteps([
        {
          id: uuidv4(),
          name: "Extension Design",
          description: "Design extension UI and functionality",
          isCompleted: false,
          completedAt: null,
          estimatedDuration: "2-3 days",
          resources: []
        },
        {
          id: uuidv4(),
          name: "Implementation",
          description: "Build extension functionality",
          isCompleted: false,
          completedAt: null,
          estimatedDuration: "4-5 days",
          resources: []
        }
      ])
    default:
      return combineSteps([
        {
          id: uuidv4(),
          name: "Planning",
          description: "Define project scope and requirements",
          isCompleted: false,
          completedAt: null,
          estimatedDuration: "2-3 days",
          resources: []
        },
        {
          id: uuidv4(),
          name: "Implementation",
          description: "Build core functionality",
          isCompleted: false,
          completedAt: null,
          estimatedDuration: "5-7 days",
          resources: []
        }
      ])
  }
}