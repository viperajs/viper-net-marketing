"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Star, Loader2 } from "lucide-react"
import Image from "next/image"
import { BackgroundGradient } from "./ui/background-gradient"
import { createClient } from "@/lib/supabase/client"

// Fallback data for when Supabase is not configured
const fallbackWebsites = [
  {
    id: "1",
    name: "AVERA Wood Materials",
    original_name: "АВЕРА ЕООД",
    url: "https://www.averaeood.bg/",
    logo_path: null,
    logo: "/avera-logo.png",
    review: "AVERA EOOD provides high-quality wood materials with exceptional attention to detail and customer service. The website is intuitive and easy to navigate, making it convenient for customers to choose products. The design is modern and professional, reflecting the quality of the materials offered.",
    category: "E-commerce Store",
    rating: 5,
  },
  {
    id: "2",
    name: "BG OIL Vratsa",
    original_name: "BG OIL ВРАЦА",
    url: "https://bgoil.bg/",
    logo_path: null,
    logo: "/bgoil-logo.webp",
    review: "BG OIL Vratsa offers a modern gas station with a 24/7 store, hotel, and auto service. The website provides complete information about services and current fuel prices, making it easy for customers to plan their visits. The responsive design works excellently on all devices.",
    category: "Gas Station",
    rating: 5,
  },
]

export default function Websites() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleItems, setVisibleItems] = useState([])
  const sectionRef = useRef(null)

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("websites")
          .select("*")
          .order("sort_order", { ascending: true })

        if (error || !data || data.length === 0) {
          setWebsites(fallbackWebsites)
        } else {
          setWebsites(data)
        }
      } catch {
        setWebsites(fallbackWebsites)
      }
      setLoading(false)
    }
    fetchWebsites()
  }, [])

  useEffect(() => {
    if (loading || websites.length === 0) return

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
  }, [loading, websites])

  const getLogoUrl = (website) => {
    if (website.logo_path) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${website.logo_path}`
    }
    return website.logo || null
  }

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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {websites.map((website, index) => {
              const isVisible = visibleItems.includes(index)
              const logoUrl = getLogoUrl(website)
              return (
                <div
                  key={website.id}
                  className={`${isVisible ? "animate-scale-in" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <BackgroundGradient className="rounded-[22px] p-6 sm:p-8 bg-white/5 backdrop-blur-xl border border-white/10">
                    {/* Logo */}
                    <div className="mb-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={`${website.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-white/50 font-bold text-xl">
                            {website.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {website.name}
                        </h3>
                        <p className="text-white/50 text-sm">{website.category}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(website.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-white/70 text-white/70"
                        />
                      ))}
                    </div>

                    {/* Review */}
                    <p className="text-sm text-white/60 leading-relaxed mb-6">
                      &ldquo;{website.review}&rdquo;
                    </p>

                    {/* Link */}
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full pl-4 pr-1 py-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold hover:bg-white/25 transition-colors border border-white/20"
                    >
                      <span>Visit Website</span>
                      <span className="bg-white/20 rounded-full text-[0.6rem] px-2 py-0 text-white flex items-center justify-center">
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  </BackgroundGradient>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
