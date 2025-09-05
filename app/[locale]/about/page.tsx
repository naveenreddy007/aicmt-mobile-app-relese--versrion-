"use client"

import { ArrowLeft, Leaf, Recycle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/use-language"
import { LanguageMeta } from "@/components/language-meta"
import { OptimizedImage } from "@/components/optimized-image"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <LanguageMeta pageName="about" />

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.backToHome")}
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("about.title")}</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">{t("about.subtitle")}</p>
        </div>

        {/* Vision & Mission */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                {t("about.vision.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("about.vision.description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                {t("about.mission.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("about.mission.description")}</p>
            </CardContent>
          </Card>
        </section>

        {/* Company History */}
        <section className="py-12">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold">{t("about.journey.title")}</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">{t("about.journey.subtitle")}</p>
          </div>

          <div className="space-y-12">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-bold mb-4">{t("about.journey.beginning.title")}</h3>
                <p className="text-gray-600 mb-4">{t("about.journey.beginning.description1")}</p>
                <p className="text-gray-600">{t("about.journey.beginning.description2")}</p>
              </div>
              <div className="order-1 md:order-2 rounded-lg overflow-hidden">
                <OptimizedImage
                  src="/sustainable-future-city.png"
                  alt={t("about.journey.beginning.title")}
                  width={500}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Additional journey sections would be similarly updated */}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("about.cta.title")}</h2>
          <p className="max-w-3xl mx-auto mb-8">{t("about.cta.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-green-600 hover:bg-gray-100">{t("about.cta.contactButton")}</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="text-white border-white hover:bg-green-700">
                {t("about.cta.productsButton")}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
