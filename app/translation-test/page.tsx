"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/use-language"

export default function TranslationTestPage() {
  const { t, currentLanguage, setLanguage, languages } = useLanguage()
  const [testKey, setTestKey] = useState("common.home")
  const [result, setResult] = useState("")

  const testTranslation = () => {
    setResult(t(testKey))
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <h1 className="text-3xl font-bold mb-8">Translation Test Page</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Code: {currentLanguage.code}</p>
            <p>Name: {currentLanguage.name}</p>
            <p>Native Name: {currentLanguage.nativeName}</p>
            <p>Direction: {currentLanguage.dir || "ltr"}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={lang.code === currentLanguage.code ? "default" : "outline"}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.nativeName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Translation Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testKey}
                  onChange={(e) => setTestKey(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter translation key"
                />
                <Button onClick={testTranslation}>Test</Button>
              </div>

              {result && (
                <div className="p-4 border rounded-md">
                  <p className="font-bold">Result:</p>
                  <p>{result}</p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-medium mb-2">Common Translation Keys:</h3>
                <ul className="space-y-1">
                  <li>
                    <code>common.home</code> - {t("common.home")}
                  </li>
                  <li>
                    <code>common.products</code> - {t("common.products")}
                  </li>
                  <li>
                    <code>home.hero.title</code> - {t("home.hero.title")}
                  </li>
                  <li>
                    <code>products.title</code> - {t("products.title")}
                  </li>
                  <li>
                    <code>footer.rights</code> - {t("footer.rights")}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
