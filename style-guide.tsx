import { Leaf, Check, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StyleGuide() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">AICMT Style Guide</h1>
          <p className="text-gray-500 md:text-xl max-w-[700px]">
            Design system for AICMT International's mobile-first digital presence
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 rounded-md bg-green-600"></div>
              <div>
                <p className="font-medium">Primary Green</p>
                <p className="text-sm text-gray-500">#16a34a</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-md bg-green-100"></div>
              <div>
                <p className="font-medium">Light Green</p>
                <p className="text-sm text-gray-500">#dcfce7</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-md bg-gray-900"></div>
              <div>
                <p className="font-medium">Text Dark</p>
                <p className="text-sm text-gray-500">#111827</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-md bg-gray-100"></div>
              <div>
                <p className="font-medium">Background Light</p>
                <p className="text-sm text-gray-500">#f3f4f6</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <p className="text-sm text-gray-500">Inter / 36px / Bold</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <p className="text-sm text-gray-500">Inter / 30px / Bold</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <p className="text-sm text-gray-500">Inter / 24px / Bold</p>
            </div>
            <div>
              <h4 className="text-xl font-bold">Heading 4</h4>
              <p className="text-sm text-gray-500">Inter / 20px / Bold</p>
            </div>
            <div>
              <p className="text-base">Body Text</p>
              <p className="text-sm text-gray-500">Inter / 16px / Regular</p>
            </div>
            <div>
              <p className="text-sm">Small Text</p>
              <p className="text-sm text-gray-500">Inter / 14px / Regular</p>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Components</h2>

          <div className="space-y-8">
            {/* Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-green-600 hover:bg-green-700">Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Link Button</Button>
                <Button disabled>Disabled Button</Button>
                <Button size="sm">Small Button</Button>
                <Button size="lg">Large Button</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Leaf className="mr-2 h-4 w-4" />
                  Icon Button
                </Button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Form Elements</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Text Input</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Input</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" disabled placeholder="Disabled input" />
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Cards</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the main content of the card. It can contain various elements and information.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Feature Card</CardTitle>
                    <Leaf className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>A compact card with an icon</CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle>Highlighted Card</CardTitle>
                    <CardDescription>With a colored background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Used for emphasizing important information</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Tabs</h3>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
                  <p>Content for Tab 1</p>
                </TabsContent>
                <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
                  <p>Content for Tab 2</p>
                </TabsContent>
                <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
                  <p>Content for Tab 3</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Alerts</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-start">
                  <Check className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Success Alert</h4>
                    <p className="text-sm">Operation completed successfully.</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Error Alert</h4>
                    <p className="text-sm">There was an error processing your request.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 flex items-start">
                  <Info className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Info Alert</h4>
                    <p className="text-sm">Here's some information you should know.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-First Principles */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Mobile-First Principles</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="text-xl font-bold mb-2">Touch Targets</h3>
              <p>All interactive elements should have a minimum touch target size of 44×44 pixels.</p>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-xl font-bold mb-2">Content Hierarchy</h3>
              <p>Prioritize content vertically, with the most important information at the top.</p>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-xl font-bold mb-2">Progressive Enhancement</h3>
              <p>
                Design for mobile first, then enhance for larger screens with additional features and layout changes.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-xl font-bold mb-2">Navigation</h3>
              <p>Use a hamburger menu for mobile navigation, expanding to a horizontal menu on larger screens.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
