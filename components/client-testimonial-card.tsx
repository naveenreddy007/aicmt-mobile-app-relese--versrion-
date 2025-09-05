import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/optimized-image"

interface ClientTestimonialCardProps {
  name: string
  position: string
  company: string
  logo?: string
  quote: string
  image?: string
  industry?: string
}

export function ClientTestimonialCard({
  name,
  position,
  company,
  logo,
  quote,
  image,
  industry,
}: ClientTestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logo ? (
                <div className="w-12 h-12 rounded-md overflow-hidden border flex items-center justify-center bg-white">
                  <OptimizedImage
                    src={logo}
                    alt={`${company} logo`}
                    width={48}
                    height={48}
                    className="object-contain"
                    fallback={
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
                        {company.charAt(0)}
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center text-xl font-bold text-green-700">
                  {company.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium">{company}</h3>
                {industry && <p className="text-xs text-gray-500">{industry}</p>}
              </div>
            </div>
            <Quote className="h-8 w-8 text-green-200" />
          </div>

          <div className="flex-1">
            <p className="text-gray-700"></p>
          </div>

          <div className="flex-1">
            <p className="text-gray-700 italic mb-4">{quote}</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {image ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <OptimizedImage src={image} alt={name} width={40} height={40} className="object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-medium text-green-700">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{name}</p>
              <p className="text-xs text-gray-500">{position}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
