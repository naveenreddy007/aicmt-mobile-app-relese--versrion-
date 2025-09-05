"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"

// Slide content data
const slides = [
  {
    id: 1,
    title: "Thank You for Saving Nature",
    subtitle: "Your choice makes a difference",
    description:
      "By choosing compostable plastics, you&apos;re helping to reduce pollution and protect our planet for future generations.",
    image: "/earth-friendly-shopping.png",
    accent: "green",
  },
  {
    id: 2,
    title: "We&apos;re Happy to See You Here",
    subtitle: "Join our growing community",
    description: "You&apos;re now part of a community that&apos;s committed to sustainable living and environmental stewardship.",
    image: "/eco-factory-innovation.png",
    accent: "blue",
  },
  {
    id: 3,
    title: "Our Shared Mission",
    subtitle: "From Nature, to Nature",
    description:
      "Together, we&apos;re creating a future where what we take from nature returns to nature, without harmful waste.",
    image: "/earth-friendly-takeout.png",
    accent: "green",
    isLast: true,
  },
]

export function MultiSlideIntro({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  // Handle auto-advance
  useEffect(() => {
    if (!autoPlay) return

    const timer = setTimeout(() => {
      if (currentSlide === slides.length - 1) {
        handleComplete()
      } else {
        setCurrentSlide((prev) => prev + 1)
      }
    }, 6000)

    return () => clearTimeout(timer)
  }, [currentSlide, autoPlay, handleComplete])

  // Pause auto-advance when user interacts
  const handleManualNavigation = useCallback((slideIndex: number) => {
    setAutoPlay(false)
    setCurrentSlide(slideIndex)

    // Resume auto-play after 10 seconds of inactivity
    const timer = setTimeout(() => setAutoPlay(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  // Navigate to next slide
  const handleNext = useCallback(() => {
    if (currentSlide === slides.length - 1) {
      handleComplete()
    } else {
      handleManualNavigation(currentSlide + 1)
    }
  }, [currentSlide, handleManualNavigation, handleComplete])

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      handleManualNavigation(currentSlide - 1)
    }
  }, [currentSlide, handleManualNavigation])

  // Handle completion of intro
  const handleComplete = useCallback(() => {
    setIsExiting(true)
    // Allow exit animation to complete before calling onComplete
    setTimeout(() => {
      onComplete()
    }, 800)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Skip button */}
          <button
            onClick={handleComplete}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            aria-label="Skip intro"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Slides container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Current slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <Slide slide={slides[currentSlide]} onNext={handleNext} onComplete={handleComplete} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 md:px-10 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className={`rounded-full bg-black/20 text-white hover:bg-black/40 pointer-events-auto ${
                  currentSlide === 0 ? "opacity-0" : "opacity-100"
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-black/20 text-white hover:bg-black/40 pointer-events-auto"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleManualNavigation(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index ? "bg-white w-8" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual slide component
function Slide({
  slide,
  onNext,
  onComplete,
}: {
  slide: (typeof slides)[0]
  onNext: () => void
  onComplete: () => void
}) {
  return (
    <div className="container max-w-6xl px-4 mx-auto">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        {/* Image side */}
        <motion.div
          className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <OptimizedImage
            src={slide.image || "/placeholder.svg?height=500&width=500&query=nature"}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Floating leaves animation (desktop only) */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            <FloatingElements accent={slide.accent} />
          </div>
        </motion.div>

        {/* Content side */}
        <motion.div
          className="text-white"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              slide.accent === "green" ? "bg-green-600/20 text-green-400" : "bg-blue-600/20 text-blue-400"
            }`}
          >
            {slide.subtitle}
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {slide.title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {slide.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {slide.isLast ? (
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                Enter Site
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className={`${
                  slide.accent === "green" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                size="lg"
              >
                Continue
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Floating decorative elements component
function FloatingElements({ accent }: { accent: string }) {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 rounded-full ${accent === "green" ? "bg-green-500/10" : "bg-blue-500/10"}`}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            transition: {
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  )
}
