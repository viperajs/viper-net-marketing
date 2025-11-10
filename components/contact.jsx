"use client"

import { useState, useEffect, useRef } from "react"
import { Twitter } from "lucide-react"
import Image from "next/image"

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  
  const twitterAccount = "Vipera"
  const twitterUrl = "https://x.com/e_balakchiev"
  const profileImage = "/profile-image.jpg" 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-4xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          Contact Us
        </h2>

        <p className={`text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${isVisible ? "animate-fade-in-up stagger-1" : "opacity-0"}`}>
          Follow us on X for news, offers, and projects.
        </p>

        <div className={`flex flex-col items-center gap-6 ${isVisible ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
          {/* Profile Image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 hover:border-white/60 transition-all duration-300 hover:scale-110 backdrop-blur-sm">
            <Image
              src={profileImage}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover rounded-full"
              onError={(e) => {
                e.target.style.display = 'none'
                const fallback = e.target.nextElementSibling
                if (fallback) {
                  fallback.style.display = 'flex'
                }
              }}
            />
            <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold absolute inset-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ display: 'none' }}>
              V
            </div>
          </div>

          {/* Twitter Link with Account Name */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg font-bold hover:shadow-xl hover:shadow-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 group drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <Twitter size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>{twitterAccount}</span>
          </a>
        </div>
      </div>
    </section>
  )
}



