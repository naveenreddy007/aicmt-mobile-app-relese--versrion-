"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Leaf, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"

export function NatureIntroScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)

  const handleContinue = useCallback(() => {
    setIsVisible(false)
    // Allow exit animation to complete before calling onComplete
    setTimeout(() => {
      onComplete()
    }, 1000)
  }, [onComplete])

  // Auto-dismiss after 8 seconds if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        handleContinue()
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [isVisible, handleContinue])

  useEffect(() => {
    // Start animation after component mounts
    setHasAnimated(true)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {/* Background leaf patterns */}
            <motion.div
              className="absolute -top-20 -left-20 opacity-10"
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: hasAnimated ? 10 : 0, scale: hasAnimated ? 1 : 0.8 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <OptimizedImage src="/lush-tropical-foliage.png" alt="Leaf pattern" width={600} height={600} />
            </motion.div>
            <motion.div
              className="absolute -bottom-20 -right-20 opacity-10"
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: hasAnimated ? -10 : 0, scale: hasAnimated ? 1 : 0.8 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <OptimizedImage src="/lush-tropical-foliage.png" alt="Leaf pattern" width={600} height={600} />
            </motion.div>
          </div>

          <div className="container max-w-5xl px-4 relative z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div
                className="order-2 md:order-1 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <Heart className="h-8 w-8 text-green-300 fill-green-300" />
                  </motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1 }}>
                    <Leaf className="h-8 w-8 text-green-300" />
                  </motion.div>
                </div>

                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Thank You for <span className="text-green-300">Loving Nature</span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl opacity-90 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Your presence here shows your commitment to our planet. Together, we&apos;re creating a sustainable future
                  where what we take from nature returns to nature.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <Button onClick={handleContinue} className="bg-green-500 hover:bg-green-600 text-white" size="lg">
                    Continue to Site
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="order-1 md:order-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
                  <OptimizedImage
                    src="/planting-for-the-future.png"
                    alt="Nature conservation"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>

                  <motion.div
                    className="absolute bottom-4 left-4 right-4 text-white text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                  >
                    <p className="text-sm md:text-base font-medium">From Nature, to Nature</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="text-center mt-8 text-green-300/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <p>AICMT International - CPCB Certified Manufacturer of Compostable Plastics</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
