"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Palette, TrendingUp } from "lucide-react"

export default function Advantages() {
  const [visibleItems, setVisibleItems] = useState([])
  const sectionRef = useRef(null)

  const advantages = [
    {
      icon: Zap,
      title: "Fast Loading",
      description: "Optimized for maximum performance and speed",
    },
    {
      icon: Palette,
      title: "Modern Design",
      description: "Latest visual standards and industry requirements",
    },
    {
      icon: TrendingUp,
      title: "SEO Results",
      description: "Proven strategies to increase online visibility",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            advantages.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            const isVisible = visibleItems.includes(index)
            return (
              <div
                key={index}
                className={`relative group ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#14B8A6]/20 to-[#10B8A6]/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition duration-500 group-hover:scale-105" />
                <div className="relative p-8 rounded-lg bg-gradient-to-br from-[#0a0a0a] to-black border border-[#1a1a1a] group-hover:border-[#14B8A6]/40 transition-all duration-300 group-hover:scale-105">
                  <Icon className="w-12 h-12 text-[#14B8A6] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#14B8A6] transition-colors duration-300">{advantage.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{advantage.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


