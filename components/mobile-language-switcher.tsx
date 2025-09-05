"use client"

import { Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function MobileLanguageSwitcher() {
  const { languages, currentLanguage, setLanguage, t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="md:hidden py-4 border-t">
      <div className="flex items-center gap-2 px-4">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {t("common.selectLanguage")}: <span className="font-bold">{currentLanguage.nativeName}</span>
        </Button>
      </div>

      {expanded && (
        <div className="mt-2 px-4 py-2 space-y-2 bg-accent/50 rounded-md">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              className={`w-full justify-start text-sm ${
                currentLanguage.code === lang.code ? "bg-accent font-medium" : ""
              }`}
              onClick={() => {
                setLanguage(lang.code)
                setExpanded(false)
              }}
            >
              <span className="mr-2">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground ml-auto">{lang.name}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
