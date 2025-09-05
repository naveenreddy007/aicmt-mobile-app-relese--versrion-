import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { Leaf } from "lucide-react"

export default async function RootPage() {
  // Get the Accept-Language header
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language") || ""

  // Get the language from cookies if available
  const cookieStore = await cookies()
  const savedLanguage = cookieStore.get("language")?.value

  // Supported languages
  const supportedLanguages = ["en", "hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml"]

  // Determine the language to redirect to
  let redirectLanguage = "en" // Default to English

  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    // Use the saved language if available
    redirectLanguage = savedLanguage
  } else if (acceptLanguage) {
    // Try to match the browser language
    const browserLangs = acceptLanguage.split(",")
    for (const lang of browserLangs) {
      const langCode = lang.split(";")[0].split("-")[0].toLowerCase()
      if (supportedLanguages.includes(langCode)) {
        redirectLanguage = langCode
        break
      }
    }
  }

  // Redirect to the appropriate language version
  redirect(`/${redirectLanguage}`)

  // This part won't execute due to the redirect, but it's here for type safety
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <div className="animate-pulse flex flex-col items-center">
        <Leaf className="h-16 w-16 text-green-600 animate-bounce" />
        <h1 className="mt-4 text-2xl font-bold text-green-800">AICMT International</h1>
        <p className="mt-2 text-green-600">Redirecting to your preferred language...</p>
      </div>
    </div>
  )
}
