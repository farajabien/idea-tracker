"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/AuthProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Github, Globe, Twitter } from "lucide-react"

export default function ProfilePageClient() {
  const { user } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [preferences, setPreferences] = useState({
    theme: "system",
    emailNotifications: true,
    publicProfile: true
  })

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      // Add your profile update logic here
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile",{description: error?.toString()})
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <div className="container py-10">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-lg">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue={user.displayName || ""} />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                </div>

                <div>
                  <Label>Social Links</Label>
                  <div className="space-y-2 mt-1.5">
                    <div className="flex items-center space-x-2">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Twitter handle" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="GitHub username" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Website URL" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your account preferences and settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your projects
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your profile
                      </p>
                    </div>
                    <Switch
                      checked={preferences.publicProfile}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, publicProfile: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}