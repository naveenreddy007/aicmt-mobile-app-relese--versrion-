import { z } from "zod"

// Journey Milestone Schema
export const JourneyMilestoneSchema = z.object({
  year: z.string().min(1, "Year is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or empty"),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
})

export type JourneyMilestone = {
  id: string
  year: string
  title: string
  description: string
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Team Member Schema
export const TeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  image_url: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or empty"),
  category: z.string().default("team"),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
})

export type TeamMember = {
  id: string
  name: string
  position: string | null
  description: string | null
  image_url: string | null
  category: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Achievement Schema
export const AchievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or empty"),
  year: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
})

export type Achievement = {
  id: string
  title: string
  description: string
  image_url: string | null
  year: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Impact Story Schema
export const ImpactStorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or empty"),
  stats: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
})

export type ImpactStory = {
  id: string
  title: string
  description: string
  image_url: string | null
  stats: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Combined Stories Type for the frontend component
export type StoriesData = {
  journey: JourneyMilestone[]
  team: TeamMember[]
  achievements: Achievement[]
  impact: ImpactStory[]
}

// Story Categories for filtering and organization
export const STORY_CATEGORIES = {
  TEAM: {
    LEADERSHIP: 'leadership',
    TEAM: 'team',
    ADVISORS: 'advisors',
  },
  ACHIEVEMENT: {
    CERTIFICATION: 'certification',
    AWARD: 'award',
    MILESTONE: 'milestone',
  },
  IMPACT: {
    ENVIRONMENTAL: 'environmental',
    SOCIAL: 'social',
    ECONOMIC: 'economic',
    INDUSTRY: 'industry',
  },
} as const

// Form data types for creating/updating
export type JourneyMilestoneFormData = z.infer<typeof JourneyMilestoneSchema>
export type TeamMemberFormData = z.infer<typeof TeamMemberSchema>
export type AchievementFormData = z.infer<typeof AchievementSchema>
export type ImpactStoryFormData = z.infer<typeof ImpactStorySchema>