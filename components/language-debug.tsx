"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/use-language"
import { Button } from "@/components/ui/button"

export function LanguageDebug() {
  const { currentLanguage, t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
        onClick={() => setIsExpanded(true)}
      >
        🌐 Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white border rounded-md shadow-lg max-w-md max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Language Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          ✕
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Current Language:</strong> {currentLanguage.code} ({currentLanguage.nativeName})
        </p>
        <p>
          <strong>Direction:</strong> {currentLanguage.dir || "ltr"}
        </p>
        <p>
          <strong>HTML Lang:</strong> {document.documentElement.lang}
        </p>
        <p>
          <strong>HTML Dir:</strong> {document.documentElement.dir}
        </p>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Sample Translations:</h4>
          <ul className="space-y-1">
            <li>
              <code>common.home</code>: {t("common.home")}
            </li>
            <li>
              <code>common.products</code>: {t("common.products")}
            </li>
            <li>
              <code>home.hero.title</code>: {t("home.hero.title")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
