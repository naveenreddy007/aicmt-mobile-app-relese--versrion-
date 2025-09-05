"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NatureIntroScreen } from "./nature-intro-screen"
import { Leaf } from "lucide-react"

export function IntroExperienceWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true) // Always show intro initially
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Always show intro on every visit - no localStorage check
    setShowIntro(true)
    setIsLoaded(true)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    // Don't save to localStorage - we want intro every time
  }

  const resetIntroExperience = () => {
    setShowIntro(true)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-pulse flex flex-col items-center">
          <Leaf className="h-16 w-16 text-green-600 animate-bounce" />
          <h1 className="mt-4 text-2xl font-bold text-green-800">AICMT International</h1>
          <p className="mt-2 text-green-600">Loading Experience...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showIntro && <NatureIntroScreen onComplete={handleIntroComplete} />}
      <div className={!showIntro ? "animate-fadeIn" : ""}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={resetIntroExperience}
            className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded z-50 opacity-50 hover:opacity-100"
          >
            Show Intro
          </button>
        )}
      </div>
    </>
  )
}
