import type { Locale } from "./languages"

// Import all translation files
import { translations as en } from "./translations/en"
import { translations as hi } from "./translations/hi"
import { translations as bn } from "./translations/bn"
import { translations as mr } from "./translations/mr"
import { translations as ta } from "./translations/ta"
import { translations as te } from "./translations/te"
import { translations as ur } from "./translations/ur"

// Create a dictionary mapping
const dictionaries = {
  en,
  hi,
  bn,
  mr,
  ta,
  te,
  ur,
} as const

export async function getDictionary(locale: Locale) {
  // Return the dictionary for the requested locale, fallback to English
  return dictionaries[locale] || dictionaries.en
}

export type Dictionary = typeof en
