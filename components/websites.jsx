"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Star } from "lucide-react"
import Image from "next/image"

export default function Websites() {
  const [visibleItems, setVisibleItems] = useState([])
  const sectionRef = useRef(null)

  const websites = [
    {
      name: "AVERA Wood Materials",
      originalName: "АВЕРА ЕООД",
      url: "https://www.averaeood.bg/",
      logo: "/avera-logo.png",
      review: "AVERA EOOD provides high-quality wood materials with exceptional attention to detail and customer service. The website is intuitive and easy to navigate, making it convenient for customers to choose products. The design is modern and professional, reflecting the quality of the materials offered.",
      category: "E-commerce Store",
      rating: 5,
    },
    {
      name: "BG OIL Vratsa",
      originalName: "BG OIL ВРАЦА",
      url: "https://bgoil.bg/",
      logo: "/bgoil-logo.webp",
      review: "BG OIL Vratsa offers a modern gas station with a 24/7 store, hotel, and auto service. The website provides complete information about services and current fuel prices, making it easy for customers to plan their visits. The responsive design works excellently on all devices.",
      category: "Gas Station",
      rating: 5,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const titleElement = entry.target.querySelector('.scroll-reveal')
            if (titleElement) {
              titleElement.classList.add('revealed')
            }
            websites.forEach((_, index) => {
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
    <section id="websites" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Our Websites
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Portfolio of successful projects with focus on quality and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {websites.map((website, index) => {
            const isVisible = visibleItems.includes(index)
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02] cursor-pointer ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Logo */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110 overflow-hidden relative">
                    {website.logo ? (
                      <Image
                        src={website.logo}
                        alt={`${website.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-white font-bold text-xl">
                        {website.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {website.name}
                    </h3>
                    <p className="text-white/60 text-sm">{website.category}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(website.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-white/80 text-sm leading-relaxed mb-6 group-hover:text-white/90 transition-colors duration-300">
                  "{website.review}"
                </p>

                {/* Link */}
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group-hover:scale-105"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-medium">Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

