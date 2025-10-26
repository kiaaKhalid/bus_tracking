"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface AnimatedStatsProps {
  icon: LucideIcon
  label: string
  value: string
  delay: number
}

export default function AnimatedStats({ icon: Icon, label, value, delay }: AnimatedStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700 p-6 hover:border-blue-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <Icon className="w-8 h-8 text-blue-400" />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
            viewport={{ once: true }}
            className="w-2 h-2 bg-orange-400 rounded-full"
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-2"
        >
          {value}
        </motion.div>
        <p className="text-slate-400 text-sm">{label}</p>
      </Card>
    </motion.div>
  )
}
