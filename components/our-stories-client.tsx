"use client"

import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen } from "lucide-react"

interface StoryContent {
  year?: string
  title: string
  description: string
  image: string
  name?: string
  position?: string
  category?: string
  stats?: string
}

interface CompanyStory {
  id: string
  title: string
  icon: React.ReactNode
  content: StoryContent[]
}

interface OurStoriesClientProps {
  stories: CompanyStory[]
}

export function OurStoriesClient({ stories }: OurStoriesClientProps) {
  const [activeTab, setActiveTab] = useState(stories[0]?.id || "journey")

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-full">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Our Stories
          </h2>
        </div>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover the journey, people, and impact behind our sustainable plastic alternatives
        </p>
        <div className="mt-6 w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-gray-50 rounded-xl shadow-inner" aria-label="Company story categories">
          {stories.map((story) => (
            <TabsTrigger 
              key={story.id} 
              value={story.id} 
              className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 data-[state=active]:border-green-200"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{story.icon}</span>
              <span className="hidden sm:inline">{story.title}</span>
              <span className="sm:hidden">{story.title.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {stories.map((story) => (
          <TabsContent key={story.id} value={story.id} className="mt-8">
            {story.id === "journey" && (
              <div className="relative">
                <div className="absolute left-[31px] top-12 bottom-12 w-1 bg-gradient-to-b from-green-200 via-green-300 to-green-200 hidden lg:block rounded-full"></div>
                <div className="space-y-8 sm:space-y-12">
                  {story.content.map((item, index) => (
                    <div key={index} className="group flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                      <div className="lg:w-1/4 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-6 mb-6 lg:mb-0">
                        <div className="relative">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm sm:text-lg z-10 flex-shrink-0 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
                            {item.year}
                          </div>
                          <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-200 animate-ping opacity-20"></div>
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl text-center lg:text-left text-gray-800 group-hover:text-green-600 transition-colors duration-300">{item.title}</h3>
                      </div>
                      <div className="lg:w-3/4">
                        <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-green-50">
                          <CardContent className="p-0">
                            <div className="grid lg:grid-cols-2">
                              <div className="aspect-video lg:aspect-square overflow-hidden relative">
                                <OptimizedImage
                                  src={item.image}
                                  alt={`${item.year}: ${item.title} - ${item.description}`}
                                  width={400}
                                  height={400}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="p-6 sm:p-8 flex items-center">
                                <div>
                                  <div className="w-8 h-1 bg-green-400 mb-4 rounded-full transition-all duration-300 group-hover:w-12"></div>
                                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {story.id === "team" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {story.content.map((member, index) => (
                  <Card key={index} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50 transform hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
                            <OptimizedImage
                              src={member.image}
                              alt={`${member.name} - ${member.role}`}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-200 animate-pulse opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>
                        <div className="w-12 h-1 bg-green-400 mb-4 rounded-full transition-all duration-300 group-hover:w-16"></div>
                        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors duration-300">{member.name}</h3>
                        <p className="text-green-600 font-semibold mb-4 text-lg">{member.role}</p>
                        <p className="text-gray-600 text-base leading-relaxed">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {story.id === "achievements" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {story.content.map((item, index) => (
                  <Card key={index} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50 transform hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
                            <BookOpen className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-green-200 animate-ping opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </div>
                        <div className="w-12 h-1 bg-green-400 mb-4 mx-auto rounded-full transition-all duration-300 group-hover:w-16"></div>
                        <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors duration-300">{item.title}</h3>
                        <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4 transition-all duration-300 group-hover:bg-green-200">{item.year}</div>
                        <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {story.id === "impact" && (
              <div className="grid sm:grid-cols-2 gap-8">
                {story.content.map((item, index) => (
                  <Card key={index} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50 transform hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="aspect-video overflow-hidden relative">
                        <OptimizedImage
                          src={item.image}
                          alt={item.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="w-12 h-1 bg-green-400 mb-4 rounded-full transition-all duration-300 group-hover:w-16"></div>
                        <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">{item.title}</h3>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}