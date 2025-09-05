import { OptimizedImage } from "@/components/optimized-image"

// Client data
const clients = [
  { name: "GreenRetail Solutions", logo: "/client-logos/greenretail.png" },
  { name: "EcoFood Packaging", logo: "/client-logos/ecofood.png" },
  { name: "GreenEarth Organics", logo: "/client-logos/greenearth.png" },
  { name: "EcoFriendly Hotels", logo: "/client-logos/ecofriendly.png" },
  { name: "GreenDelivery", logo: "/client-logos/greendelivery.png" },
  { name: "Sustainable Retail Chain", logo: "/client-logos/sustainable.png" },
  { name: "Organic Grocers", logo: "/client-logos/organic.png" },
  { name: "EcoPackaging Solutions", logo: "/client-logos/ecopackaging.png" },
]

export function FeaturedClientsGrid() {
  return (
    <div className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Trusted by Leading Businesses</h2>
          <p className="text-gray-500 mt-2">Companies that have made the switch to our sustainable solutions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
              <OptimizedImage
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                fallback={<div className="text-center text-gray-500 font-medium">{client.name}</div>}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
