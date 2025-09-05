"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LanguageTestPage() {
  const { currentLanguage, t } = useLanguage()

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Language System Test</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">This page tests the multi-language functionality</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Language</CardTitle>
            <CardDescription>Information about the active language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Language Code:</strong> {currentLanguage.code}
                </p>
                <p>
                  <strong>Language Name:</strong> {currentLanguage.name}
                </p>
                <p>
                  <strong>Native Name:</strong> {currentLanguage.nativeName}
                </p>
                <p>
                  <strong>Direction:</strong> {currentLanguage.dir || "ltr"}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Sample Translations</h3>
                <div className="grid gap-2">
                  <p>
                    <strong>Home:</strong> {t("common.home")}
                  </p>
                  <p>
                    <strong>Products:</strong> {t("common.products")}
                  </p>
                  <p>
                    <strong>Hero Title:</strong> {t("home.hero.title")}
                  </p>
                  <p>
                    <strong>Hero Subtitle:</strong> {t("home.hero.subtitle")}
                  </p>
                  <p>
                    <strong>Footer Rights:</strong> {t("footer.rights")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RTL Support Test</CardTitle>
            <CardDescription>Testing support for right-to-left languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This text should be {currentLanguage.dir === "rtl" ? "right" : "left"}-aligned based on your current
                language direction.
              </p>

              <div className="flex items-center gap-2">
                <div className="rtl-mirror p-2 bg-accent rounded-md">This icon should be mirrored in RTL mode →</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
