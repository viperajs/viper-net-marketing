"use client"

import { useEffect, useRef, useState } from "react"
import { Code, Search, ShoppingCart, Wrench } from "lucide-react"

export default function Services() {
  const [visibleItems, setVisibleItems] = useState([])
  const sectionRef = useRef(null)

  const services = [
    {
      icon: Code,
      title: "Web Design",
      description: "Modern, attractive designs optimized for all devices",
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Increase your visibility in search engines and attract more customers",
    },
    {
      icon: ShoppingCart,
      title: "Online Stores",
      description: "Complete e-commerce solutions with payment system integration",
    },
    {
      icon: Wrench,
      title: "Support & Hosting",
      description: "Reliable technical support and secure hosting 24/7",
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
            services.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 100)
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
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Our Services</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            We provide comprehensive digital solutions for your business growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            const isVisible = visibleItems.includes(index)
            return (
              <div
                key={index}
                className={`group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-105 cursor-pointer ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all group-hover:rotate-6">
                  <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{service.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}



