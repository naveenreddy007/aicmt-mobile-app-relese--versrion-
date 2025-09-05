import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Trophy, MapPin, Heart, BarChart3, Settings, FileText } from "lucide-react"
import {
  getJourneyMilestones,
  getTeamMembers,
  getAchievements,
  getImpactStories,
} from "@/app/actions/stories"
import { JourneyMilestonesTable } from "@/components/admin/stories/journey-milestones-table"
import { TeamMembersTable } from "@/components/admin/stories/team-members-table"
import { AchievementsTable } from "@/components/admin/stories/achievements-table"
import { ImpactStoriesTable } from "@/components/admin/stories/impact-stories-table"
import { StoriesDashboard } from "@/components/admin/stories/stories-dashboard"

export const dynamic = "force-dynamic"

interface StoryStats {
  journey: number
  team: number
  achievements: number
  impact: number
}

async function getStoryStats(): Promise<StoryStats> {
  try {
    const [journey, team, achievements, impact] = await Promise.all([
      getJourneyMilestones(),
      getTeamMembers(),
      getAchievements(),
      getImpactStories(),
    ])

    return {
      journey: journey.length,
      team: team.length,
      achievements: achievements.length,
      impact: impact.length,
    }
  } catch (error) {
    console.error("Error fetching story stats:", error)
    return {
      journey: 0,
      team: 0,
      achievements: 0,
      impact: 0,
    }
  }
}

function StoryStatsCard({ stats }: { stats: StoryStats }) {
  const sections = [
    {
      title: "Journey Milestones",
      count: stats.journey,
      icon: MapPin,
      href: "/admin/stories/journey",
      description: "Key moments in our company's journey",
      color: "bg-blue-500",
    },
    {
      title: "Team Members",
      count: stats.team,
      icon: Users,
      href: "/admin/stories/team",
      description: "Our talented team and leadership",
      color: "bg-green-500",
    },
    {
      title: "Achievements",
      count: stats.achievements,
      icon: Trophy,
      href: "/admin/stories/achievements",
      description: "Awards, recognitions, and milestones",
      color: "bg-yellow-500",
    },
    {
      title: "Impact Stories",
      count: stats.impact,
      icon: Heart,
      href: "/admin/stories/impact",
      description: "Stories of our positive impact",
      color: "bg-red-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <Card key={section.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {section.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${section.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{section.count}</div>
              <p className="text-xs text-muted-foreground mb-4">
                {section.description}
              </p>
              <Link href={section.href}>
                <Button variant="outline" size="sm" className="w-full">
                  Manage
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function LoadingStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function StoriesAdminPage() {
  const stats = await getStoryStats()
  const [journeyMilestones, teamMembers, achievements, impactStories] = await Promise.all([
    getJourneyMilestones(),
    getTeamMembers(),
    getAchievements(),
    getImpactStories(),
  ])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stories Management</h1>
          <p className="text-muted-foreground">
            Manage your company's journey, team, achievements, and impact stories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            Total: {stats.journey + stats.team + stats.achievements + stats.impact} items
          </Badge>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Suspense fallback={<LoadingStats />}>
        <StoryStatsCard stats={stats} />
      </Suspense>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks for managing your stories content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/stories/journey/new">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  <span className="font-medium">Add Milestone</span>
                  <span className="text-xs text-muted-foreground">Create journey milestone</span>
                </Button>
              </Link>
              <Link href="/admin/stories/team/new">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="h-6 w-6 text-green-500" />
                  <span className="font-medium">Add Team Member</span>
                  <span className="text-xs text-muted-foreground">Add team profile</span>
                </Button>
              </Link>
              <Link href="/admin/stories/achievements/new">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="font-medium">Add Achievement</span>
                  <span className="text-xs text-muted-foreground">Record accomplishment</span>
                </Button>
              </Link>
              <Link href="/admin/stories/impact/new">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="font-medium">Add Impact Story</span>
                  <span className="text-xs text-muted-foreground">Share success story</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Journey ({stats.journey})
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team ({stats.team})
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements ({stats.achievements})
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Impact ({stats.impact})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <StoriesDashboard
              journeyMilestones={journeyMilestones}
              teamMembers={teamMembers}
              achievements={achievements}
              impactStories={impactStories}
            />
          </TabsContent>

          <TabsContent value="journey" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Journey Milestones</h2>
                <p className="text-muted-foreground">
                  Key moments and milestones in your company's journey
                </p>
              </div>
              <Link href="/admin/stories/journey/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </Link>
            </div>
            <JourneyMilestonesTable milestones={journeyMilestones} />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Team Members</h2>
                <p className="text-muted-foreground">
                  Showcase your talented team and leadership
                </p>
              </div>
              <Link href="/admin/stories/team/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </Link>
            </div>
            <TeamMembersTable members={teamMembers} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Achievements</h2>
                <p className="text-muted-foreground">
                  Awards, recognitions, and company milestones
                </p>
              </div>
              <Link href="/admin/stories/achievements/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </Link>
            </div>
            <AchievementsTable achievements={achievements} />
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Impact Stories</h2>
                <p className="text-muted-foreground">
                  Stories of your positive impact and community engagement
                </p>
              </div>
              <Link href="/admin/stories/impact/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Impact Story
                </Button>
              </Link>
            </div>
            <ImpactStoriesTable stories={impactStories} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>About Stories Management</CardTitle>
            <CardDescription>
              This section allows you to manage all content that appears in the "Our Stories" section of your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Journey Milestones</h4>
                <p className="text-sm text-muted-foreground">
                  Key moments and milestones in your company's history and growth.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Team Members</h4>
                <p className="text-sm text-muted-foreground">
                  Profiles of your team members, leadership, and key contributors.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Awards, recognitions, certifications, and major accomplishments.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Impact Stories</h4>
                <p className="text-sm text-muted-foreground">
                  Stories showcasing your positive impact on clients, community, and industry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}