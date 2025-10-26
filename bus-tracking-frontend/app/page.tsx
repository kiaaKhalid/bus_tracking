"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Bus, MapPin, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Bus3DScene from "@/components/home/bus-3d-scene"
import AnimatedStats from "@/components/home/animated-stats"
import FloatingBuses from "@/components/home/floating-buses"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main content */}
      <div ref={containerRef} className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-between px-8 md:px-16 py-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <span className="text-orange-400 font-semibold text-sm tracking-widest">REAL-TIME TRACKING</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Unified Bus
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                {" "}
                Tracking
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl"
            >
              Unlock unequalled business performance with real-time insights, automation, and an expanding marketplace.
              Join the transportation revolution in the making.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 rounded-full px-8 bg-transparent"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Right 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 hidden lg:block"
          >
            <Bus3DScene />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="px-8 md:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <AnimatedStats icon={Bus} label="Active Buses" value="2,847" delay={0} />
            <AnimatedStats icon={MapPin} label="Routes Tracked" value="156" delay={0.1} />
            <AnimatedStats icon={Users} label="Daily Passengers" value="45.2K" delay={0.2} />
            <AnimatedStats icon={TrendingUp} label="On-Time Rate" value="98.5%" delay={0.3} />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="px-8 md:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Everything you need to manage and track your bus fleet efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Real-Time GPS Tracking",
                description: "Track every bus in real-time with precise GPS coordinates and live updates",
                icon: "📍",
              },
              {
                title: "Route Optimization",
                description: "Optimize routes automatically to reduce fuel costs and improve efficiency",
                icon: "🛣️",
              },
              {
                title: "Driver Management",
                description: "Monitor driver behavior, compliance, and performance metrics",
                icon: "👨‍✈️",
              },
              {
                title: "Passenger Analytics",
                description: "Understand passenger patterns and optimize scheduling",
                icon: "📊",
              },
              {
                title: "Maintenance Alerts",
                description: "Predictive maintenance alerts to prevent breakdowns",
                icon: "🔧",
              },
              {
                title: "Mobile App",
                description: "Passengers can track buses and get real-time updates on the go",
                icon: "📱",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 p-6 h-full hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Floating Buses Animation */}
        <section className="px-8 md:px-16 py-20 relative h-96">
          <FloatingBuses />
        </section>

        {/* CTA Section */}
        <section className="px-8 md:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Fleet?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of transportation companies using our platform to optimize their operations
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 rounded-full px-8 font-semibold">
              Start Free Trial
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
