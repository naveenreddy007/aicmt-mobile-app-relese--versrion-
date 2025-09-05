import { Shield, Award, CheckCircle, FileCheck, Leaf } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

// Define consistent dimensions for logos
const LOGO_SIZE = 60 // You can adjust this

export function TrustBadges() {
  const badges = [
    {
      src: "/cpcb-logo.png",
      alt: "CPCB Certification",
      text: "CPCB Certified",
      fallbackIcon: <Shield className={`h-${LOGO_SIZE / 5} w-${LOGO_SIZE / 5} text-green-600`} />,
    },
    {
      src: "/iso-logo.png",
      alt: "ISO 17088:2021",
      text: "ISO 17088:2021",
      fallbackIcon: <FileCheck className={`h-${LOGO_SIZE / 5} w-${LOGO_SIZE / 5} text-green-600`} />,
    },
    {
      src: "/cipet-logo.png",
      alt: "CIPET Tested",
      text: "CIPET Tested",
      fallbackIcon: <CheckCircle className={`h-${LOGO_SIZE / 5} w-${LOGO_SIZE / 5} text-green-600`} />,
    },
    {
      src: "/msme-logo.png",
      alt: "MSME ZED Bronze",
      text: "MSME ZED Bronze",
      fallbackIcon: <Award className={`h-${LOGO_SIZE / 5} w-${LOGO_SIZE / 5} text-green-600`} />,
    },
    {
      src: "/pwm-logo.png",
      alt: "PWM Compliant",
      text: "PWM Compliant",
      fallbackIcon: <Leaf className={`h-${LOGO_SIZE / 5} w-${LOGO_SIZE / 5} text-green-600`} />,
    },
  ]

  return (
    <div className="w-full py-8 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Trusted & Certified</h2>
          <p className="text-gray-600">Our products meet the highest standards for quality and sustainability</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 items-start justify-items-center">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center p-2">
              <div
                className="bg-white p-3 rounded-full shadow-sm mb-2 flex items-center justify-center"
                style={{ width: LOGO_SIZE + 24, height: LOGO_SIZE + 24 }}
              >
                {" "}
                {/* Outer container for consistent sizing */}
                <OptimizedImage
                  src={badge.src}
                  alt={badge.alt}
                  width={LOGO_SIZE} // Added width
                  height={LOGO_SIZE} // Added height
                  className="object-contain" // Ensure image scales within dimensions
                  // Fallback prop in OptimizedImage handles the icon if image fails,
                  // but here we pass it for potential direct use if OptimizedImage supported it.
                  // For now, OptimizedImage uses its own internal fallback.
                />
              </div>
              <span className="text-sm font-medium text-gray-700 mt-1">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
