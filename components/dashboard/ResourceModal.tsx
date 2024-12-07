// components/ResourceModal.tsx
import { useState } from 'react'
import { Resource } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResourceModalProps {
  onSubmit: (resource: Omit<Resource, "id" | "addedAt" | "userId" | "ideaId" | "stepId">) => Promise<void>
}

export default function ResourceModal({ onSubmit }: ResourceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resource, setResource] = useState({
    title: '',
    url: '',
    type: 'inspiration' as Resource['type'],
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onSubmit(resource)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Resource</DialogTitle>
        <DialogDescription>
          Add helpful resources for this step
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Resource title"
            value={resource.title}
            onChange={e => setResource(prev => ({
              ...prev,
              title: e.target.value
            }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://"
            value={resource.url}
            onChange={e => setResource(prev => ({
              ...prev,
              url: e.target.value
            }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={resource.type}
            onValueChange={value => setResource(prev => ({
              ...prev,
              type: value as Resource['type']
            }))}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inspiration">Inspiration</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this resource..."
            value={resource.notes}
            onChange={e => setResource(prev => ({
              ...prev,
              notes: e.target.value
            }))}
          />
        </div>
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
            'Add Resource'
          )}
        </Button>
      </form>
    </DialogContent>
  )
}