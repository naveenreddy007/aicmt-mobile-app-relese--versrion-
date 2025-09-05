"use client"

import { useEffect } from "react"
import { useLanguage } from "@/lib/i18n/use-language"

interface LanguageMetaProps {
  pageName: string
}

export function LanguageMeta({ pageName }: LanguageMetaProps) {
  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    // Update document title based on current language and page
    const pageTitle = t(`meta.${pageName}.title`)
    const siteTitle = t("meta.siteTitle")
    document.title = `${pageTitle} | ${siteTitle}`

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", t(`meta.${pageName}.description`))
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = t(`meta.${pageName}.description`)
      document.head.appendChild(meta)
    }

    // Add language-specific meta tags
    const langMeta = document.querySelector('meta[property="og:locale"]')
    if (langMeta) {
      langMeta.setAttribute("content", currentLanguage.code)
    } else {
      const meta = document.createElement("meta")
      meta.setAttribute("property", "og:locale")
      meta.content = currentLanguage.code
      document.head.appendChild(meta)
    }
  }, [t, currentLanguage, pageName])

  return null
}
