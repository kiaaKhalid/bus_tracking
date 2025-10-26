"use client"

import { motion } from "framer-motion"
import { Bus } from "lucide-react"

export default function FloatingBuses() {
  const buses = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {buses.map((index) => (
        <motion.div
          key={index}
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: [0, 400, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: index * 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <div className="flex items-center gap-2">
            <Bus className="w-8 h-8 text-blue-400" />
            <span className="text-slate-300 text-sm">Route {index + 1}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
