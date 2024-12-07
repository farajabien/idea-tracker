export type Step = {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  completedAt: Date | null;
};

export const defaultSteps: Step[] = [
  { 
    id: "idea", 
    name: "Define the Core Idea", 
    description: "Outline the problem you're solving and the solution you're offering.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "validation", 
    name: "Validate Your Idea", 
    description: "Gather feedback, validate demand, and refine your concept based on insights.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "planning", 
    name: "Research & Planning", 
    description: "Plan features, technology stack, and roadmap for your project.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "prototyping", 
    name: "Create Mockups or Prototypes", 
    description: "Design initial wireframes or prototypes to visualize your idea.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "development", 
    name: "Build the MVP", 
    description: "Develop the core features of your product with minimal scope.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "testing", 
    name: "Test & Iterate", 
    description: "Test your MVP with real users, gather feedback, and improve.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "launch", 
    name: "Launch Your Product", 
    description: "Ship your MVP to your audience and start building traction.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "promote", 
    name: "Promote & Share", 
    description: "Promote your product to reach your target audience through social media, forums, or communities.", 
    isCompleted: false, 
    completedAt: null 
  },
  { 
    id: "analyze", 
    name: "Track & Analyze", 
    description: "Monitor engagement, user feedback, and performance metrics to plan next steps.", 
    isCompleted: false, 
    completedAt: null 
  }
];


export type ProjectType = "personal" | "client";
export type ProjectVisibility = "public" | "private";
export type ProjectStatus = "Not Started" | "In Progress" | "Completed";

export type ProjectCategory = 
  | "Web App" 
  | "Mobile App" 
  | "Chrome Extension" 
  | "API" 
  | "CLI Tool" 
  | "Library" 
  | "Other";

export type Idea = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  status: ProjectStatus;
  steps: Step[];
  isPublic: boolean;
  projectType?: ProjectType;
  productionUrl?: string;
  description?: string;
  category?: ProjectCategory;
  tags?: string[];
  metrics?: {
    views: number;
    clicks: number;
    lastUpdated: Date;
    completedAt?: Date;
    timeToComplete?: number; // in days
  };
  builderProfile?: {
    twitter?: string;
    github?: string;
    website?: string;
    bio?: string;
    skills?: string[];
  };
};

export type Resource = {
  id: string;
  ideaId: string;
  userId: string;
  title: string;
  url: string;
  addedAt: Date;
  type?: "inspiration" | "tutorial" | "tool" | "documentation" | "other";
  notes?: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  displayName?: string;
  photoURL?: string;
  preferences?: {
    emailNotifications: boolean;
    publicProfile: boolean;
    theme: "light" | "dark" | "system";
  };
};

export type BuilderStats = {
  userId: string;
  builderName: string;
  completedProjects: number;
  totalViews: number;
  totalClicks: number;
  projectCategories: ProjectCategory[];
  lastShipped: Date;
  averageTimeToComplete?: number;
  mostUsedTechnologies?: string[];
  streak?: number; // consecutive days/weeks with shipped projects
  rank?: number; // leaderboard position
};

export type LeaderboardFilter = {
  category?: ProjectCategory;
  timeFrame: "all" | "week" | "month" | "year";
  sortBy: "views" | "clicks" | "completed" | "recent";
  projectType?: ProjectType;
};
