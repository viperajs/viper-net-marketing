"use client"

import { useState, useEffect, useRef } from "react"
import { Twitter } from "lucide-react"
import ProfileCard from "./ProfileCard"

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

        <div className={`flex flex-col items-center justify-center gap-6 ${isVisible ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
          {/* Profile Card */}
          <div className="w-full max-w-md mx-auto flex justify-center">
            <ProfileCard
              name="Viper"
              title="Founder & Developer"
              handle=""
              status="Available"
              contactText="Contact Me"
              avatarUrl={profileImage}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              innerGradient="linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)"
              behindGlowColor="rgba(255, 255, 255, 0.2)"
              onContactClick={() => {
                window.open(twitterUrl, '_blank', 'noopener,noreferrer')
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}



