"use client"

import { useLanguage } from "@/lib/i18n/use-language"

interface TranslatedTextProps {
  textKey: string
  values?: Record<string, string | number>
}

export function TranslatedText({ textKey, values }: TranslatedTextProps) {
  const { t } = useLanguage()

  let translatedText = t(textKey)

  // Replace placeholders with values if provided
  if (values) {
    Object.entries(values).forEach(([key, value]) => {
      translatedText = translatedText.replace(`{{${key}}}`, String(value))
    })
  }

  return <>{translatedText}</>
}
