#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Supabase configuration
const SUPABASE_URL = 'https://ylqpagsrjmoelausmtku.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscXBhZ3Nyam1vZWxhdXNtdGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMyMjc2MSwiZXhwIjoyMDYyODk4NzYxfQ.M7Wj2_gEGipgGEkFlthOjU4gZoa4EGt1BO2IAYBc5HQ'

class DatabaseSeeder {
  private supabase

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  }

  private log(message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  async seedJourneyMilestones() {
    this.log('Seeding journey_milestones table...')
    
    const milestones = [
      {
        year: '2018',
        title: 'Company Founded',
        description: 'AICMT International was established with a vision to revolutionize sustainable packaging solutions.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20office%20building%20startup%20company%20founding%20sustainable%20business%20corporate%20headquarters&image_size=landscape_16_9',
        display_order: 1,
        is_active: true
      },
      {
        year: '2018',
        title: 'First Biodegradable Product Launch',
        description: 'Launched our first line of 100% biodegradable packaging materials made from agricultural waste.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=biodegradable%20packaging%20products%20eco%20friendly%20materials%20sustainable%20product%20launch%20green%20innovation&image_size=landscape_16_9',
        display_order: 2,
        is_active: true
      },
      {
        year: '2019',
        title: 'ISO 14001 Certification',
        description: 'Achieved ISO 14001 environmental management certification, demonstrating our commitment to sustainability.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ISO%20certification%20ceremony%20environmental%20management%20award%20business%20achievement%20sustainability%20recognition&image_size=landscape_16_9',
        display_order: 3,
        is_active: true
      },
      {
        year: '2020',
        title: 'International Expansion',
        description: 'Expanded operations to serve clients across Southeast Asia and established partnerships in 5 countries.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=international%20business%20expansion%20global%20partnerships%20world%20map%20corporate%20growth%20southeast%20asia&image_size=landscape_16_9',
        display_order: 4,
        is_active: true
      },
      {
        year: '2021',
        title: 'R&D Center Establishment',
        description: 'Opened state-of-the-art research and development facility focused on innovative sustainable materials.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20research%20development%20laboratory%20scientists%20sustainable%20materials%20innovation%20facility%20technology&image_size=landscape_16_9',
        display_order: 5,
        is_active: true
      },
      {
        year: '2022',
        title: 'Carbon Neutral Achievement',
        description: 'Achieved carbon neutrality across all operations through renewable energy and offset programs.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=carbon%20neutral%20facility%20renewable%20energy%20solar%20panels%20green%20building%20sustainability%20achievement&image_size=landscape_16_9',
        display_order: 6,
        is_active: true
      },
      {
        year: '2023',
        title: 'B-Corp Certification',
        description: 'Certified as a B-Corporation, meeting highest standards of social and environmental performance.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=B%20Corporation%20certification%20social%20environmental%20performance%20business%20ethics%20sustainable%20company%20award&image_size=landscape_16_9',
        display_order: 7,
        is_active: true
      },
      {
        year: '2024',
        title: '1 Million Tons Milestone',
        description: 'Reached milestone of preventing 1 million tons of plastic waste through our sustainable alternatives.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=environmental%20impact%20milestone%20plastic%20waste%20reduction%20sustainable%20packaging%20achievement%20celebration&image_size=landscape_16_9',
        display_order: 8,
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('journey_milestones')
        .insert(milestones)
      
      if (error) {
        this.log(`Error seeding journey_milestones: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${milestones.length} journey milestones`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding journey_milestones: ${error}`, 'error')
      return false
    }
  }

  async seedTeamMembers() {
    this.log('Seeding team_members table...')
    
    const teamMembers = [
      {
        name: 'Dr. Rajesh Kumar',
        position: 'Chief Executive Officer',
        description: 'Visionary leader with 15+ years in sustainable technology. PhD in Environmental Engineering from IIT Delhi. Former sustainability consultant for Fortune 500 companies.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20indian%20male%20CEO%20in%20business%20suit%20confident%20smile%20office%20background&image_size=portrait_4_3',
        category: 'leadership',
        display_order: 1,
        is_active: true
      },
      {
        name: 'Sarah Chen',
        position: 'Chief Technology Officer',
        description: 'Innovation expert specializing in biodegradable materials. MS in Materials Science from MIT. Led development of 20+ patented sustainable packaging solutions.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20asian%20female%20CTO%20in%20lab%20coat%20modern%20laboratory%20background&image_size=portrait_4_3',
        category: 'leadership',
        display_order: 2,
        is_active: true
      },
      {
        name: 'Michael Rodriguez',
        position: 'Head of Operations',
        description: 'Operations excellence leader with expertise in lean manufacturing. MBA from Wharton. Optimized production efficiency by 40% while maintaining zero-waste principles.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20hispanic%20male%20operations%20manager%20in%20industrial%20setting%20manufacturing%20background&image_size=portrait_4_3',
        category: 'operations',
        display_order: 3,
        is_active: true
      },
      {
        name: 'Dr. Aisha Patel',
        position: 'Director of Research & Development',
        description: 'Biochemistry expert focused on plant-based materials. PhD in Biochemistry from Oxford. Published 50+ research papers on sustainable packaging innovations.',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20indian%20female%20scientist%20in%20lab%20coat%20research%20laboratory%20background&image_size=portrait_4_3',
        category: 'research',
        display_order: 4,
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('team_members')
        .insert(teamMembers)
      
      if (error) {
        this.log(`Error seeding team_members: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${teamMembers.length} team members`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding team_members: ${error}`, 'error')
      return false
    }
  }

  async seedAchievements() {
    this.log('Seeding achievements table...')
    
    const achievements = [
      {
        title: 'ISO 14001:2015 Environmental Management Certification',
        description: 'Internationally recognized certification for environmental management systems, demonstrating our commitment to reducing environmental impact.',
        year: '2019',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ISO%2014001%20environmental%20management%20certification%20award%20ceremony%20business%20achievement&image_size=landscape_16_9',
        display_order: 1,
        is_active: true
      },
      {
        title: 'B-Corporation Certification',
        description: 'Certified B-Corp meeting highest standards of verified social and environmental performance, public transparency, and legal accountability.',
        year: '2023',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=B%20Corporation%20certification%20social%20environmental%20performance%20sustainable%20business&image_size=landscape_16_9',
        display_order: 2,
        is_active: true
      },
      {
        title: 'Asia Packaging Innovation Award 2023',
        description: 'Recognized for breakthrough biodegradable packaging technology that reduces plastic waste by 95% compared to traditional alternatives.',
        year: '2023',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=packaging%20innovation%20award%20trophy%20ceremony%20industry%20recognition%20sustainable%20materials&image_size=landscape_16_9',
        display_order: 3,
        is_active: true
      },
      {
        title: 'Carbon Neutral Certification',
        description: 'Achieved carbon neutrality across all operations through renewable energy adoption and verified carbon offset programs.',
        year: '2022',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=carbon%20neutral%20certification%20renewable%20energy%20environmental%20sustainability&image_size=landscape_16_9',
        display_order: 4,
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('achievements')
        .insert(achievements)
      
      if (error) {
        this.log(`Error seeding achievements: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${achievements.length} achievements`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding achievements: ${error}`, 'error')
      return false
    }
  }

  async seedImpactStories() {
    this.log('Seeding impact_stories table...')
    
    const impactStories = [
      {
        title: 'Reducing Ocean Plastic by 50,000 Tons Annually',
        description: 'Our biodegradable packaging solutions have prevented 50,000 tons of plastic waste from entering oceans each year.',
        stats: '50,000 tons plastic waste prevented, 2.5M marine animals protected, 15 coastal communities benefited',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=clean%20ocean%20with%20marine%20life%20sustainable%20packaging%20floating%20biodegradable%20materials%20underwater%20scene&image_size=landscape_16_9',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Empowering 500 Women Entrepreneurs',
        description: 'Our community program has trained and supported 500 women to start sustainable packaging businesses in rural areas.',
        stats: '500 women entrepreneurs, 2,000 jobs created, $2.5M in community income generated',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=group%20of%20diverse%20women%20working%20in%20sustainable%20packaging%20workshop%20rural%20setting%20empowerment%20training&image_size=landscape_16_9',
        display_order: 2,
        is_active: true
      },
      {
        title: 'Agricultural Waste to Packaging Revolution',
        description: 'Converting 100,000 tons of agricultural waste into valuable packaging materials, creating circular economy solutions.',
        stats: '100,000 tons agricultural waste converted, 5,000 farmers benefited, 30% increase in farmer income',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=farmers%20with%20agricultural%20waste%20being%20converted%20to%20packaging%20materials%20circular%20economy%20rural%20landscape&image_size=landscape_16_9',
        display_order: 3,
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('impact_stories')
        .insert(impactStories)
      
      if (error) {
        this.log(`Error seeding impact_stories: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${impactStories.length} impact stories`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding impact_stories: ${error}`, 'error')
      return false
    }
  }

  async seedMediaLibrary() {
    this.log('Seeding media_library table...')
    
    const mediaItems = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        filename: 'facility-manufacturing-001.jpg',
        original_name: 'manufacturing-facility.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20sustainable%20manufacturing%20facility%20with%20advanced%20equipment&image_size=landscape_16_9',
        file_size: 2048000,
        mime_type: 'image/jpeg',
        alt_text: 'Modern manufacturing facility with sustainable production equipment',
        caption: 'State-of-the-Art Manufacturing Facility',
        category: 'facility',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        filename: 'facility-laboratory-001.jpg',
        original_name: 'research-laboratory.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20research%20laboratory%20with%20scientists%20working%20on%20biodegradable%20materials&image_size=landscape_16_9',
        file_size: 1856000,
        mime_type: 'image/jpeg',
        alt_text: 'Research laboratory with scientists working on biodegradable materials',
        caption: 'Research and Development Laboratory',
        category: 'facility',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        filename: 'facility-testing-001.jpg',
        original_name: 'quality-control-center.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=quality%20control%20testing%20center%20with%20advanced%20equipment&image_size=landscape_16_9',
        file_size: 1920000,
        mime_type: 'image/jpeg',
        alt_text: 'Quality control testing center with advanced equipment',
        caption: 'Quality Control Testing Center',
        category: 'facility',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        filename: 'products-food-packaging-001.jpg',
        original_name: 'biodegradable-food-packaging.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=collection%20of%20biodegradable%20food%20packaging%20products%20eco%20friendly&image_size=landscape_16_9',
        file_size: 1728000,
        mime_type: 'image/jpeg',
        alt_text: 'Collection of biodegradable food packaging products',
        caption: 'Biodegradable Food Packaging Collection',
        category: 'products',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        filename: 'products-shopping-bags-001.jpg',
        original_name: 'compostable-shopping-bags.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=compostable%20shopping%20bags%20made%20from%20plant%20based%20materials&image_size=landscape_16_9',
        file_size: 1664000,
        mime_type: 'image/jpeg',
        alt_text: 'Compostable shopping bags made from plant-based materials',
        caption: 'Compostable Shopping Bags',
        category: 'products',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        filename: 'products-material-samples-001.jpg',
        original_name: 'sustainable-material-samples.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=samples%20of%20sustainable%20packaging%20materials%20different%20textures&image_size=landscape_16_9',
        file_size: 1792000,
        mime_type: 'image/jpeg',
        alt_text: 'Samples of sustainable packaging materials showing different textures',
        caption: 'Sustainable Material Samples',
        category: 'products',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        filename: 'events-awards-2023-001.jpg',
        original_name: 'asia-packaging-awards.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=team%20receiving%20Asia%20Packaging%20Innovation%20Award%20at%20ceremony&image_size=landscape_16_9',
        file_size: 2112000,
        mime_type: 'image/jpeg',
        alt_text: 'AICMT team receiving Asia Packaging Innovation Award at ceremony',
        caption: 'Asia Packaging Innovation Awards 2023',
        category: 'events',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        filename: 'events-conference-2024-001.jpg',
        original_name: 'sustainability-conference.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=CEO%20presenting%20at%20International%20Sustainability%20Conference&image_size=landscape_16_9',
        file_size: 1984000,
        mime_type: 'image/jpeg',
        alt_text: 'CEO presenting at International Sustainability Conference',
        caption: 'Sustainability Conference 2024',
        category: 'events',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        filename: 'events-team-building-001.jpg',
        original_name: 'team-building-workshop.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=team%20building%20workshop%20diverse%20employees%20collaborating&image_size=landscape_16_9',
        file_size: 1856000,
        mime_type: 'image/jpeg',
        alt_text: 'Team building workshop with diverse employees collaborating',
        caption: 'Team Building and Training Workshop',
        category: 'events',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        filename: 'processes-biodegradation-001.jpg',
        original_name: 'biodegradation-testing.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=laboratory%20biodegradation%20testing%20process%20scientific%20equipment&image_size=landscape_16_9',
        file_size: 1920000,
        mime_type: 'image/jpeg',
        alt_text: 'Laboratory biodegradation testing process with scientific equipment',
        caption: 'Biodegradation Process Testing',
        category: 'facility',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        filename: 'processes-raw-material-001.jpg',
        original_name: 'raw-material-processing.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20waste%20processing%20machinery%20sustainable%20materials&image_size=landscape_16_9',
        file_size: 2048000,
        mime_type: 'image/jpeg',
        alt_text: 'Agricultural waste processing machinery for sustainable materials',
        caption: 'Raw Material Processing',
        category: 'facility',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        filename: 'processes-quality-assurance-001.jpg',
        original_name: 'quality-assurance-inspection.jpg',
        file_path: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=quality%20assurance%20worker%20inspecting%20products%20manufacturing%20facility&image_size=landscape_16_9',
        file_size: 1792000,
        mime_type: 'image/jpeg',
        alt_text: 'Quality assurance worker inspecting products in manufacturing facility',
        caption: 'Quality Assurance Inspection',
        category: 'facility',
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('media_library')
        .insert(mediaItems)
      
      if (error) {
        this.log(`Error seeding media_library: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${mediaItems.length} media items`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding media_library: ${error}`, 'error')
      return false
    }
  }

  async seedGallery() {
    this.log('Seeding gallery table...')
    
    const galleryItems = [
      {
        media_id: '550e8400-e29b-41d4-a716-446655440001',
        category: 'facility',
        title: 'State-of-the-Art Manufacturing Facility',
        description: 'Our modern production facility equipped with latest sustainable manufacturing technology.',
        alt_text: 'Modern manufacturing facility with sustainable production equipment',
        display_order: 1,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440002',
        category: 'facility',
        title: 'Research and Development Laboratory',
        description: 'Advanced R&D lab where we develop innovative biodegradable packaging solutions.',
        alt_text: 'Research laboratory with scientists working on biodegradable materials',
        display_order: 2,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440003',
        category: 'facility',
        title: 'Quality Control Testing Center',
        description: 'Comprehensive testing facility ensuring highest quality standards for all our products.',
        alt_text: 'Quality control testing center with advanced equipment',
        display_order: 3,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440004',
        category: 'products',
        title: 'Biodegradable Food Packaging Collection',
        description: 'Our premium line of biodegradable food packaging products for various applications.',
        alt_text: 'Collection of biodegradable food packaging products',
        display_order: 4,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440005',
        category: 'products',
        title: 'Compostable Shopping Bags',
        description: 'Durable and completely compostable shopping bags made from plant-based materials.',
        alt_text: 'Compostable shopping bags made from plant-based materials',
        display_order: 5,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440006',
        category: 'products',
        title: 'Sustainable Material Samples',
        description: 'Various samples of our innovative sustainable packaging materials and their applications.',
        alt_text: 'Samples of sustainable packaging materials showing different textures',
        display_order: 6,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440007',
        category: 'events',
        title: 'Asia Packaging Innovation Awards 2023',
        description: 'AICMT team receiving the prestigious Asia Packaging Innovation Award for breakthrough technology.',
        alt_text: 'AICMT team receiving Asia Packaging Innovation Award at ceremony',
        display_order: 7,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440008',
        category: 'events',
        title: 'Sustainability Conference 2024',
        description: 'Our CEO presenting at the International Sustainability Conference on circular economy solutions.',
        alt_text: 'CEO presenting at International Sustainability Conference',
        display_order: 8,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440009',
        category: 'events',
        title: 'Team Building and Training Workshop',
        description: 'Annual team building event focused on sustainability practices and innovation collaboration.',
        alt_text: 'Team building workshop with diverse employees collaborating',
        display_order: 9,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440010',
        category: 'facility',
        title: 'Biodegradation Process Testing',
        description: 'Laboratory process showing the biodegradation timeline of our packaging materials.',
        alt_text: 'Laboratory biodegradation testing process with scientific equipment',
        display_order: 10,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440011',
        category: 'facility',
        title: 'Raw Material Processing',
        description: 'Converting agricultural waste into high-quality biodegradable packaging materials.',
        alt_text: 'Agricultural waste processing machinery for sustainable materials',
        display_order: 11,
        is_active: true
      },
      {
        media_id: '550e8400-e29b-41d4-a716-446655440012',
        category: 'facility',
        title: 'Quality Assurance Inspection',
        description: 'Rigorous quality control process ensuring every product meets our high standards.',
        alt_text: 'Quality assurance worker inspecting products in manufacturing facility',
        display_order: 12,
        is_active: true
      }
    ]

    try {
      const { error } = await this.supabase
        .from('gallery')
        .insert(galleryItems)
      
      if (error) {
        this.log(`Error seeding gallery: ${error.message}`, 'error')
        return false
      }
      
      this.log(`Successfully seeded ${galleryItems.length} gallery items`, 'success')
      return true
    } catch (error) {
      this.log(`Error seeding gallery: ${error}`, 'error')
      return false
    }
  }

  async seedAll() {
    this.log('Starting database seeding process...', 'info')
    
    const results = {
      journeyMilestones: await this.seedJourneyMilestones(),
      teamMembers: await this.seedTeamMembers(),
      achievements: await this.seedAchievements(),
      impactStories: await this.seedImpactStories(),
      mediaLibrary: await this.seedMediaLibrary(),
      gallery: await this.seedGallery()
    }
    
    const successCount = Object.values(results).filter(Boolean).length
    const totalCount = Object.keys(results).length
    
    if (successCount === totalCount) {
      this.log(`✅ All ${totalCount} tables seeded successfully!`, 'success')
    } else {
      this.log(`⚠️ ${successCount}/${totalCount} tables seeded successfully`, 'warning')
    }
    
    return results
  }
}

// Run the seeder
const seeder = new DatabaseSeeder()
seeder.seedAll().then(() => {
  process.exit(0)
}).catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})