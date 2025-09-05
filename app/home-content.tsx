"use client"

import { ArrowRight, Leaf, Package, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

export default function HomeContent() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("home.hero.title")}</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">{t("home.hero.subtitle")}</p>
            </div>
            <div className="space-x-4">
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700">
                  {t("common.products")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">{t("common.contact")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t("home.features.title")}</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("home.features.subtitle")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{t("home.features.ecoFriendly")}</CardTitle>
                <Leaf className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription>{t("home.features.ecoFriendlyDesc")}</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{t("home.features.certified")}</CardTitle>
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription>{t("home.features.certifiedDesc")}</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{t("home.features.versatile")}</CardTitle>
                <Package className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription>{t("home.features.versatileDesc")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
