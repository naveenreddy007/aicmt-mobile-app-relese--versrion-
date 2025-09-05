"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ArchitectureDiagram() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Technical Architecture</h1>
          <p className="text-gray-500 md:text-xl max-w-[700px]">
            Comprehensive technical architecture for AICMT International's digital platform
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
                <CardDescription>High-level view of the system architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto">
                  <div className="min-w-[600px]">
                    <svg viewBox="0 0 800 500" className="w-full">
                      {/* Client Layer */}
                      <rect
                        x="50"
                        y="50"
                        width="700"
                        height="80"
                        rx="5"
                        fill="#dcfce7"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                      <text x="400" y="90" textAnchor="middle" fontSize="18" fontWeight="bold">
                        Client Layer
                      </text>
                      <rect
                        x="100"
                        y="70"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="160" y="95" textAnchor="middle" fontSize="14">
                        Mobile App
                      </text>
                      <rect
                        x="250"
                        y="70"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="310" y="95" textAnchor="middle" fontSize="14">
                        Web App
                      </text>
                      <rect
                        x="400"
                        y="70"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="460" y="95" textAnchor="middle" fontSize="14">
                        Admin Portal
                      </text>
                      <rect
                        x="550"
                        y="70"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="610" y="95" textAnchor="middle" fontSize="14">
                        PWA
                      </text>

                      {/* Frontend Layer */}
                      <rect
                        x="50"
                        y="150"
                        width="700"
                        height="80"
                        rx="5"
                        fill="#f0fdf4"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                      <text x="400" y="190" textAnchor="middle" fontSize="18" fontWeight="bold">
                        Frontend Layer
                      </text>
                      <rect
                        x="100"
                        y="170"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="160" y="195" textAnchor="middle" fontSize="14">
                        Next.js
                      </text>
                      <rect
                        x="250"
                        y="170"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="310" y="195" textAnchor="middle" fontSize="14">
                        React
                      </text>
                      <rect
                        x="400"
                        y="170"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="460" y="195" textAnchor="middle" fontSize="14">
                        Tailwind CSS
                      </text>
                      <rect
                        x="550"
                        y="170"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="610" y="195" textAnchor="middle" fontSize="14">
                        TypeScript
                      </text>

                      {/* Backend Layer */}
                      <rect
                        x="50"
                        y="250"
                        width="700"
                        height="80"
                        rx="5"
                        fill="#f0fdf4"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                      <text x="400" y="290" textAnchor="middle" fontSize="18" fontWeight="bold">
                        Backend Layer
                      </text>
                      <rect
                        x="100"
                        y="270"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="160" y="295" textAnchor="middle" fontSize="14">
                        Next.js API
                      </text>
                      <rect
                        x="250"
                        y="270"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="310" y="295" textAnchor="middle" fontSize="14">
                        Node.js
                      </text>
                      <rect
                        x="400"
                        y="270"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="460" y="295" textAnchor="middle" fontSize="14">
                        Prisma ORM
                      </text>
                      <rect
                        x="550"
                        y="270"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="610" y="295" textAnchor="middle" fontSize="14">
                        REST API
                      </text>

                      {/* Data Layer */}
                      <rect
                        x="50"
                        y="350"
                        width="700"
                        height="80"
                        rx="5"
                        fill="#f0fdf4"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                      <text x="400" y="390" textAnchor="middle" fontSize="18" fontWeight="bold">
                        Data Layer
                      </text>
                      <rect
                        x="100"
                        y="370"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="160" y="395" textAnchor="middle" fontSize="14">
                        PostgreSQL
                      </text>
                      <rect
                        x="250"
                        y="370"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="310" y="395" textAnchor="middle" fontSize="14">
                        Supabase
                      </text>
                      <rect
                        x="400"
                        y="370"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="460" y="395" textAnchor="middle" fontSize="14">
                        Redis Cache
                      </text>
                      <rect
                        x="550"
                        y="370"
                        width="120"
                        height="40"
                        rx="5"
                        fill="white"
                        stroke="#16a34a"
                        strokeWidth="1"
                      />
                      <text x="610" y="395" textAnchor="middle" fontSize="14">
                        S3 Storage
                      </text>

                      {/* Connecting Lines */}
                      <line
                        x1="400"
                        y1="130"
                        x2="400"
                        y2="150"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <line
                        x1="400"
                        y1="230"
                        x2="400"
                        y2="250"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <line
                        x1="400"
                        y1="330"
                        x2="400"
                        y2="350"
                        stroke="#16a34a"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frontend" className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Frontend Technologies</CardTitle>
                  <CardDescription>Core technologies for the user interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        N
                      </div>
                      <div>
                        <h3 className="font-medium">Next.js</h3>
                        <p className="text-sm text-gray-500">
                          React framework for server-side rendering and static site generation
                        </p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>Server-side rendering for improved SEO</li>
                          <li>Static site generation for fast loading</li>
                          <li>API routes for backend functionality</li>
                          <li>File-based routing system</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        R
                      </div>
                      <div>
                        <h3 className="font-medium">React</h3>
                        <p className="text-sm text-gray-500">JavaScript library for building user interfaces</p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>Component-based architecture</li>
                          <li>Virtual DOM for efficient updates</li>
                          <li>React Hooks for state management</li>
                          <li>Context API for global state</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        T
                      </div>
                      <div>
                        <h3 className="font-medium">Tailwind CSS</h3>
                        <p className="text-sm text-gray-500">Utility-first CSS framework</p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>Responsive design utilities</li>
                          <li>Mobile-first approach</li>
                          <li>Custom theming for brand colors</li>
                          <li>Optimized production builds</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frontend Architecture</CardTitle>
                  <CardDescription>Design patterns and organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Component Structure</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Atomic design methodology</li>
                        <li>Reusable UI component library</li>
                        <li>Container/presentational pattern</li>
                        <li>Layout components for consistent structure</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">State Management</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>React Context for global state</li>
                        <li>React Query for server state</li>
                        <li>Local component state with useState</li>
                        <li>Form state management with React Hook Form</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">Routing</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Next.js file-based routing</li>
                        <li>Dynamic routes for product pages</li>
                        <li>Shallow routing for filter changes</li>
                        <li>Route guards for protected areas</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">Performance Optimizations</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Image optimization with Next.js Image</li>
                        <li>Code splitting and lazy loading</li>
                        <li>Memoization of expensive calculations</li>
                        <li>Prefetching of critical resources</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backend" className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Backend Technologies</CardTitle>
                  <CardDescription>Core technologies for the server-side</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        N
                      </div>
                      <div>
                        <h3 className="font-medium">Node.js</h3>
                        <p className="text-sm text-gray-500">JavaScript runtime for server-side execution</p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>Asynchronous, non-blocking I/O</li>
                          <li>Unified JavaScript codebase</li>
                          <li>Rich ecosystem of packages</li>
                          <li>Scalable for high-traffic applications</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        P
                      </div>
                      <div>
                        <h3 className="font-medium">Prisma</h3>
                        <p className="text-sm text-gray-500">Next-generation ORM for Node.js and TypeScript</p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>Type-safe database access</li>
                          <li>Auto-generated migrations</li>
                          <li>Intuitive data modeling</li>
                          <li>Query optimization</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                        S
                      </div>
                      <div>
                        <h3 className="font-medium">Supabase</h3>
                        <p className="text-sm text-gray-500">Open source Firebase alternative</p>
                        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                          <li>PostgreSQL database</li>
                          <li>Authentication services</li>
                          <li>Storage solutions</li>
                          <li>Realtime subscriptions</li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Design</CardTitle>
                  <CardDescription>API architecture and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">REST API</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Resource-based endpoints</li>
                        <li>Standard HTTP methods</li>
                        <li>JSON response format</li>
                        <li>Consistent error handling</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">Authentication & Authorization</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>JWT-based authentication</li>
                        <li>Role-based access control</li>
                        <li>Secure password handling</li>
                        <li>API rate limiting</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">Data Validation</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Zod schema validation</li>
                        <li>Input sanitization</li>
                        <li>Type checking with TypeScript</li>
                        <li>Consistent error responses</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium">Performance</h3>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Redis caching for frequent queries</li>
                        <li>Query optimization</li>
                        <li>Pagination for large datasets</li>
                        <li>Background processing for heavy tasks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment & DevOps</CardTitle>
                <CardDescription>Infrastructure and continuous integration/deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-3">Infrastructure</h3>
                    <ul className="text-sm list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">Vercel</span>
                        <p className="text-gray-500">Platform for frontend deployment with global CDN</p>
                      </li>
                      <li>
                        <span className="font-medium">Supabase</span>
                        <p className="text-gray-500">Managed PostgreSQL database with authentication</p>
                      </li>
                      <li>
                        <span className="font-medium">AWS S3</span>
                        <p className="text-gray-500">Object storage for product images and documents</p>
                      </li>
                      <li>
                        <span className="font-medium">Upstash Redis</span>
                        <p className="text-gray-500">Serverless Redis for caching and rate limiting</p>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">CI/CD Pipeline</h3>
                    <ul className="text-sm list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">GitHub Actions</span>
                        <p className="text-gray-500">Automated testing and deployment workflows</p>
                      </li>
                      <li>
                        <span className="font-medium">Vercel Preview Deployments</span>
                        <p className="text-gray-500">Automatic preview environments for pull requests</p>
                      </li>
                      <li>
                        <span className="font-medium">Automated Testing</span>
                        <p className="text-gray-500">Unit, integration, and E2E tests with Jest and Cypress</p>
                      </li>
                      <li>
                        <span className="font-medium">Monitoring</span>
                        <p className="text-gray-500">
                          Application performance monitoring with Sentry and Vercel Analytics
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Deployment Architecture</h3>
                  <div className="w-full overflow-auto">
                    <div className="min-w-[600px]">
                      <svg viewBox="0 0 800 300" className="w-full">
                        {/* User */}
                        <circle cx="100" cy="50" r="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                        <text x="100" y="55" textAnchor="middle" fontSize="14">
                          User
                        </text>

                        {/* CDN */}
                        <rect
                          x="200"
                          y="20"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="260" y="55" textAnchor="middle" fontSize="14">
                          Vercel CDN
                        </text>

                        {/* Frontend */}
                        <rect
                          x="400"
                          y="20"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="460" y="55" textAnchor="middle" fontSize="14">
                          Next.js App
                        </text>

                        {/* API */}
                        <rect
                          x="600"
                          y="20"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="660" y="55" textAnchor="middle" fontSize="14">
                          API Routes
                        </text>

                        {/* Database */}
                        <rect
                          x="400"
                          y="150"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="460" y="185" textAnchor="middle" fontSize="14">
                          Supabase DB
                        </text>

                        {/* Storage */}
                        <rect
                          x="200"
                          y="150"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="260" y="185" textAnchor="middle" fontSize="14">
                          S3 Storage
                        </text>

                        {/* Cache */}
                        <rect
                          x="600"
                          y="150"
                          width="120"
                          height="60"
                          rx="5"
                          fill="#f0fdf4"
                          stroke="#16a34a"
                          strokeWidth="2"
                        />
                        <text x="660" y="185" textAnchor="middle" fontSize="14">
                          Redis Cache
                        </text>

                        {/* Connecting Lines */}
                        <line x1="130" y1="50" x2="200" y2="50" stroke="#16a34a" strokeWidth="2" />
                        <line x1="320" y1="50" x2="400" y2="50" stroke="#16a34a" strokeWidth="2" />
                        <line x1="520" y1="50" x2="600" y2="50" stroke="#16a34a" strokeWidth="2" />
                        <line x1="460" y1="80" x2="460" y2="150" stroke="#16a34a" strokeWidth="2" />
                        <line x1="600" y1="180" x2="520" y2="180" stroke="#16a34a" strokeWidth="2" />
                        <line x1="400" y1="180" x2="320" y2="180" stroke="#16a34a" strokeWidth="2" />
                        <line
                          x1="660"
                          y1="80"
                          x2="660"
                          y2="150"
                          stroke="#16a34a"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
