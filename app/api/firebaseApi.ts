import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, query, where, getDoc, increment, orderBy,limit as firebaseLimit } from "firebase/firestore";
import { auth } from "../../lib/firebase";
import { BuilderStats, defaultSteps, Idea, ProjectCategory, Resource, Step } from "../../lib/types";
import { db } from "../../lib/firebase";

// Add a custom error type
export class ApiError extends Error {
  constructor(
    message: string,
    public code: 'AUTH' | 'PERMISSION' | 'NOT_FOUND' | 'VALIDATION' | 'SERVER',
    public userMessage: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper for consistent error handling
const handleError = (error: unknown): never => {
  console.error(error);
  
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    if (error.message.includes('permission')) {
      throw new ApiError(error.message, 'PERMISSION', 'You don\'t have permission to perform this action');
    }
    if (error.message.includes('not found')) {
      throw new ApiError(error.message, 'NOT_FOUND', 'The requested resource was not found');
    }
    if (error.message.includes('logged in')) {
      throw new ApiError(error.message, 'AUTH', 'Please sign in to continue');
    }
  }

  throw new ApiError('An unexpected error occurred', 'SERVER', 'Something went wrong. Please try again later');
};

// Helper function to get current user ID or throw error
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in");
  return user.uid;
};

// Add a new idea
export const addIdea = async (
  idea: Omit<Idea, "id" | "createdAt" | "userId" | "steps">
) => {
  const userId = getCurrentUserId();
  const newIdeaRef = doc(collection(db, "ideas"));

  const ideaWithDefaults = {
    ...idea,
    id: newIdeaRef.id,
    userId,
    createdAt: new Date(),
    steps: defaultSteps,
  };

  await setDoc(newIdeaRef, ideaWithDefaults);
  return ideaWithDefaults;
};

// Get all ideas for current user
export const getIdeas = async (): Promise<Idea[]> => {
  const userId = getCurrentUserId();
  const ideasQuery = query(
    collection(db, "ideas"), 
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(ideasQuery);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    
    // Convert Firestore Timestamps to Dates
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      metrics: data.metrics ? {
        ...data.metrics,
        lastUpdated: data.metrics.lastUpdated?.toDate() || new Date(),
        completedAt: data.metrics.completedAt?.toDate() || null
      } : {
        views: 0,
        clicks: 0,
        lastUpdated: new Date()
      },
      steps: data.steps || [],
      status: data.status || "Not Started",
      isPublic: !!data.isPublic,
    } as Idea;
  });
};

// Update an idea (with ownership check)
export const updateIdea = async (id: string, updates: Partial<Idea>) => {
  try {
    const userId = getCurrentUserId();
    const ideaRef = doc(db, "ideas", id);
    const ideaDoc = await getDoc(ideaRef);
    const idea = ideaDoc.data() as Idea;
    
    if (!idea) {
      throw new ApiError('Idea not found', 'NOT_FOUND', 'This project no longer exists');
    }
    
    if (idea.userId !== userId) {
      throw new ApiError('Permission denied', 'PERMISSION', 'You can only edit your own projects');
    }
    
    await updateDoc(ideaRef, updates);
  } catch (error) {
    handleError(error);
  }
};

// Delete an idea (with ownership check)
export const deleteIdea = async (id: string) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", id);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to delete this idea");
  }
  
  await deleteDoc(ideaRef);
};

// Add a new resource with stepId
export const addResource = async (
  ideaId: string,
  stepId: string,
  resource: Omit<Resource, "id" | "addedAt" | "userId" | "ideaId" | "stepId">
) => {
  const userId = getCurrentUserId();
  
  // First verify idea ownership
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (!idea) {
    throw new ApiError('Idea not found', 'NOT_FOUND', 'This project no longer exists');
  }
  
  if (idea.userId !== userId) {
    throw new ApiError('Permission denied', 'PERMISSION', 'You can only add resources to your own projects');
  }

  // Create new resource
  const newResourceRef = doc(collection(db, "resources"));
  const resourceWithDefaults = {
    ...resource,
    id: newResourceRef.id,
    userId,
    ideaId,
    stepId,
    addedAt: new Date(),
  };

  await setDoc(newResourceRef, resourceWithDefaults);
  return resourceWithDefaults;
};

// Get all resources for a specific step
export const getStepResources = async (ideaId: string, stepId: string): Promise<Resource[]> => {
  const userId = getCurrentUserId();
  const resourceQuery = query(
    collection(db, "resources"), 
    where("ideaId", "==", ideaId),
    where("stepId", "==", stepId),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(resourceQuery);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      addedAt: data.addedAt?.toDate() || new Date()
    } as Resource;
  });
};

// Get all resources for an idea, grouped by step
export const getIdeaResources = async (ideaId: string): Promise<{ [stepId: string]: Resource[] }> => {
  const userId = getCurrentUserId();
  const resourceQuery = query(
    collection(db, "resources"), 
    where("ideaId", "==", ideaId),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(resourceQuery);
  const resources = snapshot.docs.map(doc => ({
    ...doc.data(),
    addedAt: doc.data().addedAt?.toDate() || new Date()
  } as Resource));

  // Group resources by stepId
  return resources.reduce((acc, resource) => {
    if (!acc[resource.stepId]) {
      acc[resource.stepId] = [];
    }
    acc[resource.stepId].push(resource);
    return acc;
  }, {} as { [stepId: string]: Resource[] });
};

// Delete a resource with ownership checks
export const deleteResource = async (ideaId: string, resourceId: string) => {
  const userId = getCurrentUserId();
  const resourceRef = doc(db, "resources", resourceId);
  const resourceDoc = await getDoc(resourceRef);
  
  if (!resourceDoc.exists()) {
    throw new ApiError('Resource not found', 'NOT_FOUND', 'This resource no longer exists');
  }
  
  const resource = resourceDoc.data() as Resource;
  
  if (resource.userId !== userId || resource.ideaId !== ideaId) {
    throw new ApiError('Permission denied', 'PERMISSION', 'You can only delete your own resources');
  }
  
  await deleteDoc(resourceRef);
};

// Update a resource
export const updateResource = async (
  ideaId: string,
  resourceId: string,
  updates: Partial<Omit<Resource, "id" | "userId" | "ideaId" | "stepId" | "addedAt">>
) => {
  const userId = getCurrentUserId();
  const resourceRef = doc(db, "resources", resourceId);
  const resourceDoc = await getDoc(resourceRef);
  
  if (!resourceDoc.exists()) {
    throw new ApiError('Resource not found', 'NOT_FOUND', 'This resource no longer exists');
  }
  
  const resource = resourceDoc.data() as Resource;
  
  if (resource.userId !== userId || resource.ideaId !== ideaId) {
    throw new ApiError('Permission denied', 'PERMISSION', 'You can only update your own resources');
  }
  
  await updateDoc(resourceRef, {
    ...updates,
    lastUpdated: new Date()
  });
};



// Get all resources for an idea (with ownership check)
export const getResourcesForIdea = async (ideaId: string): Promise<Resource[]> => {
  const userId = getCurrentUserId();
  const resourceQuery = query(
    collection(db, "resources"), 
    where("ideaId", "==", ideaId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(resourceQuery);
  return snapshot.docs.map(doc => doc.data() as Resource);
};



// Add a step to an idea (with ownership check)
export const addStep = async (ideaId: string, step: Step) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to modify this idea");
  }
  
  await updateDoc(ideaRef, {
    steps: arrayUnion(step),
  });
};

// Update a step in an idea (with ownership check)
export const updateStep = async (ideaId: string, step: Step) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to modify this idea");
  }
  
  const updatedSteps = idea.steps.map(s => s.id === step.id ? step : s);
  
  await updateDoc(ideaRef, {
    steps: updatedSteps,
  });
};


// Update project visibility
export const updateProjectVisibility = async (ideaId: string, isPublic: boolean) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to update this idea");
  }

  await updateDoc(ideaRef, { 
    isPublic,
    "metrics.lastUpdated": new Date()
  });
};

// Update production URL and mark as completed
export const updateProductionUrl = async (ideaId: string, url: string) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to update this idea");
  }

  await updateDoc(ideaRef, { 
    productionUrl: url,
    status: "Completed",
    "metrics.lastUpdated": new Date()
  });
};

// Get public projects for leaderboard
export const getPublicProjects = async (limit = 20, category?: string) => {
  let projectsQuery = query(
    collection(db, "ideas"),
    where("isPublic", "==", true),
    where("status", "==", "Completed"),
    orderBy("metrics.lastUpdated", "desc"),
    firebaseLimit(limit)
  );

  if (category) {
    projectsQuery = query(
      projectsQuery,
      where("category", "==", category)
    );
  }

  const snapshot = await getDocs(projectsQuery);
  return snapshot.docs.map(doc => doc.data() as Idea);
};

// Get projects by category
export const getProjectsByCategory = async (category: string, limit = 20) => {
  const projectsQuery = query(
    collection(db, "ideas"),
    where("isPublic", "==", true),
    where("category", "==", category),
    where("status", "==", "Completed"),
    where("productionUrl", "!=", null),
    orderBy("metrics.views", "desc"),
    orderBy("metrics.lastUpdated", "desc"),
    firebaseLimit(limit)

  )

  const snapshot = await getDocs(projectsQuery);
  return snapshot.docs.map(doc => doc.data() as Idea);
};

// Track project view
export const trackProjectView = async (ideaId: string) => {
  const ideaRef = doc(db, "ideas", ideaId);
  await updateDoc(ideaRef, {
    "metrics.views": increment(1),
    "metrics.lastUpdated": new Date()
  });
};

// Track project click (e.g., when someone clicks the production URL)
export const trackProjectClick = async (ideaId: string) => {
  const ideaRef = doc(db, "ideas", ideaId);
  await updateDoc(ideaRef, {
    "metrics.clicks": increment(1),
    "metrics.lastUpdated": new Date()
  });
};

// Update builder profile
export const updateBuilderProfile = async (ideaId: string, profile: Idea["builderProfile"]) => {
  const userId = getCurrentUserId();
  const ideaRef = doc(db, "ideas", ideaId);
  const ideaDoc = await getDoc(ideaRef);
  const idea = ideaDoc.data() as Idea;
  
  if (idea.userId !== userId) {
    throw new Error("You don't have permission to update this idea");
  }

  await updateDoc(ideaRef, { 
    builderProfile: profile,
    "metrics.lastUpdated": new Date()
  });
};


export const getBuilderStats = async (userId: string): Promise<BuilderStats> => {
  const projectsQuery = query(
    collection(db, "ideas"),
    where("userId", "==", userId),
    where("isPublic", "==", true),
    where("status", "==", "Completed")
  );

  const snapshot = await getDocs(projectsQuery);
  const projects = snapshot.docs.map(doc => doc.data() as Idea);

  // Handle categories with proper type safety
  const categorySet = new Set<ProjectCategory>();
  projects.forEach(project => {
    if (project.category) {
      categorySet.add(project.category);
    }
  });

  const stats: BuilderStats = {
    userId,
    builderName: projects[0]?.builderProfile?.twitter || "Anonymous Builder",
    completedProjects: projects.length,
    totalViews: projects.reduce((sum, project) => sum + (project.metrics?.views || 0), 0),
    totalClicks: projects.reduce((sum, project) => sum + (project.metrics?.clicks || 0), 0),
    projectCategories: Array.from(categorySet),
    lastShipped: projects.reduce((latest, project) => 
      project.metrics?.lastUpdated ? (project.metrics.lastUpdated > latest ? project.metrics.lastUpdated : latest) : latest,
      new Date(0)
    )
  };

  return stats;
};

// Get top builders
export const getTopBuilders = async (limit = 10): Promise<BuilderStats[]> => {
  const buildersQuery = query(
    collection(db, "ideas"),
    where("isPublic", "==", true),
    where("status", "==", "Completed"),
    orderBy("metrics.views", "desc"),
    firebaseLimit(limit)

  )

  const snapshot = await getDocs(buildersQuery);
  const projects = snapshot.docs.map(doc => doc.data() as Idea);
  
  // Group by userId and calculate stats
  const builderMap = new Map<string, BuilderStats>();
  
  projects.forEach(project => {
    if (!builderMap.has(project.userId)) {
      builderMap.set(project.userId, {
        userId: project.userId,
        builderName: project.builderProfile?.twitter || "Anonymous Builder",
        completedProjects: 0,
        totalViews: 0,
        totalClicks: 0,
        projectCategories: [],
        lastShipped: new Date(0)
      });
    }

    const stats = builderMap.get(project.userId)!;
    stats.completedProjects++;
    stats.totalViews += project.metrics?.views || 0;
    stats.totalClicks += project.metrics?.clicks || 0;
    if (project.category) {
      stats.projectCategories = Array.from(new Set([...stats.projectCategories, project.category]));
    }
    if (project.metrics?.lastUpdated && project.metrics.lastUpdated > stats.lastShipped) {
      stats.lastShipped = project.metrics.lastUpdated;
    }
  });

  return Array.from(builderMap.values())
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, limit);
};