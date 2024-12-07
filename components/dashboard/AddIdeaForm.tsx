"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { addIdea } from "@/app/api/firebaseApi"
import { ProjectCategory } from "@/lib/types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Web App", "Mobile App", "Chrome Extension", "API", "CLI Tool", "Library", "Other"] as const),
  projectType: z.enum(["personal", "client"] as const),
  isPublic: z.boolean().default(false),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AddIdeaFormProps {
  onSuccess?: () => void
}

export default function AddIdeaForm({ onSuccess }: AddIdeaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Web App",
      projectType: "personal",
      isPublic: false,
      tags: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : []

      await addIdea({
        name: data.name,
        description: data.description,
        category: data.category,
        projectType: data.projectType,
        isPublic: data.isPublic,
        tags,
        status: "Not Started",
        steps: [],
        metrics: {
          views: 0,
          clicks: 0,
          lastUpdated: new Date(),
        },
      })
      
      toast.success("Idea added successfully!")
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to add idea. Please try again.")
      console.error("Error adding idea:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories: ProjectCategory[] = [
    "Web App",
    "Mobile App",
    "Chrome Extension",
    "API",
    "CLI Tool",
    "Library",
    "Other",
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of your idea..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal Project</SelectItem>
                    <SelectItem value="client">Client Project</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="react, typescript, api (comma separated)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add comma-separated tags to help categorize your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Make Public</FormLabel>
                <FormDescription>
                  Allow others to see this project on your profile
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Idea"
          )}
        </Button>
      </form>
    </Form>
  )
}