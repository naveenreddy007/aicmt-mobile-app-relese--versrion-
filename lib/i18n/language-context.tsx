"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type Language, getLanguageByCode, languages } from "./languages"
import { translations } from "./translations"

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (langCode: string) => void
  t: (key: string) => string
  languages: Language[]
}

const defaultLanguage = languages[0] // English is default

// Make sure the LanguageContext is properly exported
export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  t: () => "",
  languages,
})

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: string }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    initialLocale ? getLanguageByCode(initialLocale) : defaultLanguage,
  )

  useEffect(() => {
    // If initialLocale is provided, use it
    if (initialLocale) {
      const lang = getLanguageByCode(initialLocale)
      setCurrentLanguage(lang)
      localStorage.setItem("language", lang.code)
      return
    }

    // Otherwise, load language preference from localStorage on mount
    const savedLang = localStorage.getItem("language")
    if (savedLang) {
      setCurrentLanguage(getLanguageByCode(savedLang))
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      const matchedLang = languages.find((lang) => lang.code === browserLang)
      if (matchedLang) {
        setCurrentLanguage(matchedLang)
        localStorage.setItem("language", matchedLang.code)
      }
    }
  }, [initialLocale])

  const setLanguage = (langCode: string) => {
    const newLang = getLanguageByCode(langCode)
    setCurrentLanguage(newLang)
    localStorage.setItem("language", newLang.code)

    // Update the URL to reflect the language change
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(en|hi|bn|te|mr|ta|ur|gu|kn|ml)/, "")
    const newPath = `/${newLang.code}${pathWithoutLang || "/"}`
    window.location.href = newPath // Use full page navigation to ensure proper rendering
  }

  // Translation function
  const t = (key: string): string => {
    if (!key) return ""

    const keys = key.split(".")
    let result: unknown = translations[currentLanguage.code as keyof typeof translations]

    // If the language doesn't exist in translations, fall back to English
    if (!result) {
      result = translations.en
    }

    // Navigate through the nested keys
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = (result as Record<string, unknown>)[k]
      } else {
        // Key not found in current language, try English
        console.warn(`Translation key not found: ${key} in language ${currentLanguage.code}`)

        // Fallback to English
        let enResult: unknown = translations.en
        for (const k of keys) {
          if (enResult && typeof enResult === "object" && k in enResult) {
            enResult = (enResult as Record<string, unknown>)[k]
          } else {
            return key // Key not found even in English
          }
        }
        return typeof enResult === "string" ? enResult : key
      }
    }

    return typeof result === "string" ? result : key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
