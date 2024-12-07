export type Step = {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAt: Date | null;
};

export const defaultSteps: Step[] = [
  { id: "idea", name: "Define Core Idea", isCompleted: false, completedAt: null },
  { id: "research", name: "Research & Planning", isCompleted: false, completedAt: null },
  { id: "design", name: "Design & Mockups", isCompleted: false, completedAt: null },
  { id: "mvp", name: "Build MVP", isCompleted: false, completedAt: null },
  { id: "testing", name: "Testing & Feedback", isCompleted: false, completedAt: null },
  { id: "launch", name: "Launch & Share", isCompleted: false, completedAt: null }
]

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
