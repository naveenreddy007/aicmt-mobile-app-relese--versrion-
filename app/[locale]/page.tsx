import { VideoPlayer } from "@/components/video-player"
import { RawMaterialsShowcase } from "@/components/raw-materials-showcase"
import { PrintingCapabilities } from "@/components/printing-capabilities"
import { RecyclingProcess } from "@/components/recycling-process"
import { ImageGallery } from "@/components/image-gallery-server"
import { EcommerceLinks } from "@/components/ecommerce-links"
import { OurStories } from "@/components/our-stories"
import { CustomSolutions } from "@/components/custom-solutions"
import { FeaturedProducts } from "@/components/featured-products"
import { TrustBadges } from "@/components/trust-badges"
import { CertificateShowcase } from "@/components/certificate-showcase"
import { HomeContent } from "@/components/home-content"

export default function Home() {
  return (
    <main>
      <HomeContent />
      <TrustBadges />
      <FeaturedProducts />
      {/* VideoPlayer temporarily commented out until video file is provided
      <VideoPlayer
        src="/videos/company-overview.mp4"
        title="Our Biodegradable Plastic Solutions"
        poster="/sustainable-factory-exterior.png"
        className="max-w-4xl mx-auto my-12 rounded-xl overflow-hidden"
      />
      */}
      <RawMaterialsShowcase />
      <PrintingCapabilities />
      <RecyclingProcess />
      <CustomSolutions />
      <CertificateShowcase />
      <OurStories />
      <EcommerceLinks />
      <ImageGallery />
    </main>
  )
}
