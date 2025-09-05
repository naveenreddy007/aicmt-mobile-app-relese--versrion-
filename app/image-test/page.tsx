import { OptimizedImage } from "@/components/optimized-image"

export default function ImageTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Testing Standard Image (Next/Image)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="mb-2">Public image:</p>
              <img
                src="/sustainable-future-city.png"
                alt="Standard HTML image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div>
              <p className="mb-2">Next/Image component:</p>
              <OptimizedImage
                src="/sustainable-future-city.png"
                alt="Next Image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div>
              <p className="mb-2">Placeholder image:</p>
              <OptimizedImage
                src="/test-image.png"
                alt="Placeholder"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Testing Images from Different Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="mb-2">Root public folder:</p>
              <OptimizedImage
                src="/biodegradable-testing.png"
                alt="Root public image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div>
              <p className="mb-2">Images subfolder:</p>
              <OptimizedImage
                src="/images/shop/biodegradable-bags.png"
                alt="Subfolder image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div>
              <p className="mb-2">External image:</p>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1536939459926-301728717817?q=80&w=300"
                alt="External image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Testing Fill Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2">With fill property:</p>
              <div className="relative h-[200px] w-full">
                <OptimizedImage src="/green-leaf-certificate.png" alt="Fill image" fill className="rounded-md" />
              </div>
            </div>
            <div>
              <p className="mb-2">Standard image:</p>
              <OptimizedImage
                src="/green-leaf-certificate.png"
                alt="Standard image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
