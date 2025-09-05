"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  Users, 
  Trophy, 
  MapPin, 
  Heart, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff
} from "lucide-react"

interface StoryItem {
  id: string
  title: string
  type: 'journey' | 'team' | 'achievement' | 'impact'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface StoriesDashboardProps {
  journeyMilestones: any[]
  teamMembers: any[]
  achievements: any[]
  impactStories: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function StoriesDashboard({ 
  journeyMilestones, 
  teamMembers, 
  achievements, 
  impactStories 
}: StoriesDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Combine all stories for unified management
  const allStories: StoryItem[] = [
    ...journeyMilestones.map(item => ({ ...item, type: 'journey' as const })),
    ...teamMembers.map(item => ({ ...item, type: 'team' as const })),
    ...achievements.map(item => ({ ...item, type: 'achievement' as const })),
    ...impactStories.map(item => ({ ...item, type: 'impact' as const }))
  ]

  // Filter stories based on search and filters
  const filteredStories = allStories.filter(story => {
    const matchesSearch = story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
    const matchesType = filterType === "all" || story.type === filterType
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && story.is_active) ||
      (filterStatus === "inactive" && !story.is_active)
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Analytics data
  const typeDistribution = [
    { name: 'Journey', value: journeyMilestones.length, color: '#0088FE' },
    { name: 'Team', value: teamMembers.length, color: '#00C49F' },
    { name: 'Achievements', value: achievements.length, color: '#FFBB28' },
    { name: 'Impact', value: impactStories.length, color: '#FF8042' }
  ]

  const statusData = [
    { 
      name: 'Journey', 
      active: journeyMilestones.filter(item => item.is_active).length,
      inactive: journeyMilestones.filter(item => !item.is_active).length
    },
    { 
      name: 'Team', 
      active: teamMembers.filter(item => item.is_active).length,
      inactive: teamMembers.filter(item => !item.is_active).length
    },
    { 
      name: 'Achievements', 
      active: achievements.filter(item => item.is_active).length,
      inactive: achievements.filter(item => !item.is_active).length
    },
    { 
      name: 'Impact', 
      active: impactStories.filter(item => item.is_active).length,
      inactive: impactStories.filter(item => !item.is_active).length
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journey': return <MapPin className="h-4 w-4" />
      case 'team': return <Users className="h-4 w-4" />
      case 'achievement': return <Trophy className="h-4 w-4" />
      case 'impact': return <Heart className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'journey': return 'bg-blue-100 text-blue-800'
      case 'team': return 'bg-green-100 text-green-800'
      case 'achievement': return 'bg-yellow-100 text-yellow-800'
      case 'impact': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="manage">Manage All</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allStories.length}</div>
                <p className="text-xs text-muted-foreground">
                  {allStories.filter(s => s.is_active).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journey Milestones</CardTitle>
                <MapPin className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{journeyMilestones.length}</div>
                <p className="text-xs text-muted-foreground">
                  {journeyMilestones.filter(item => item.is_active).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {teamMembers.filter(item => item.is_active).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allStories.filter(story => {
                    const updatedAt = new Date(story.updated_at)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return updatedAt > weekAgo
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Breakdown of story types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active vs Inactive</CardTitle>
                <CardDescription>Status breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="active" stackId="a" fill="#22c55e" name="Active" />
                      <Bar dataKey="inactive" stackId="a" fill="#ef4444" name="Inactive" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>Detailed insights into your stories content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Most Active Category</p>
                  <p className="text-2xl font-bold">
                    {typeDistribution.reduce((max, item) => 
                      item.value > max.value ? item : max
                    ).name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold">
                    {allStories.length > 0 
                      ? Math.round((allStories.filter(s => s.is_active).length / allStories.length) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Average per Category</p>
                  <p className="text-2xl font-bold">
                    {Math.round(allStories.length / 4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Stories Management</CardTitle>
              <CardDescription>Search, filter, and manage all your stories in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="journey">Journey</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-2">
                {filteredStories.map((story) => (
                  <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(story.type)}
                      <div>
                        <p className="font-medium">{story.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getTypeColor(story.type)}>
                            {story.type}
                          </Badge>
                          <Badge variant={story.is_active ? "default" : "secondary"}>
                            {story.is_active ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        {story.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredStories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No stories found matching your criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
