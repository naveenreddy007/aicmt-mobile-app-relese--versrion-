"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MultiSlideIntro } from "@/components/multi-slide-intro"

export default function TestIntroPage() {
  const [showIntro, setShowIntro] = useState(false)

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Test Intro Experience</h1>

      <Button onClick={() => setShowIntro(true)}>Show Intro Experience</Button>

      {showIntro && <MultiSlideIntro onComplete={() => setShowIntro(false)} />}
    </div>
  )
}
