import { ProjectCategory } from "@/lib/types"
import { 
    Globe, 
    Smartphone, 
    Chrome, 
    ServerCrash, 
    Terminal, 
    Library, 
    Code 
  } from "lucide-react"
  export const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case "Web App":
        return <Globe className="mx-auto h-6 w-6" />
      case "Mobile App":
        return <Smartphone className="mx-auto h-6 w-6" />
      case "Chrome Extension":
        return <Chrome className="mx-auto h-6 w-6" />
      case "API":
        return <ServerCrash className="mx-auto h-6 w-6" />
      case "CLI Tool":
        return <Terminal className="mx-auto h-6 w-6" />
      case "Library":
        return <Library className="mx-auto h-6 w-6" />
      default:
        return <Code className="mx-auto h-6 w-6" />
    }
  }