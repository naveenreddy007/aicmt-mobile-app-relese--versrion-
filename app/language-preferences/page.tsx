"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LanguagePreferencesPage() {
  const { languages, currentLanguage, setLanguage, t } = useLanguage()
  const [savedLanguage, setSavedLanguage] = useState(currentLanguage.code)

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
    setSavedLanguage(code)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4 rtl-mirror" />
              {t("common.backToHome")}
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("languagePrefs.title")}</h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">{t("languagePrefs.subtitle")}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("languagePrefs.selectLanguage")}</CardTitle>
            <CardDescription>{t("languagePrefs.choosePreferred")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={lang.code === savedLanguage ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-3 ${
                    lang.code === savedLanguage ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-xs text-muted-foreground">{lang.name}</span>
                    </div>
                    {lang.code === savedLanguage && <Check className="h-4 w-4" />}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
