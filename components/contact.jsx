"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import ProfileCard from "./ProfileCard"

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const sectionRef = useRef(null)

  const profileImage = "/profile-image.jpg"
  const twitterUrl = "https://x.com/e_balakchiev"

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
      setFormData({ name: "", email: "", message: "" })
      toast.success('Message sent successfully!')
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold text-white mb-4 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          Contact Us
        </h2>
        <p className={`text-lg text-white/70 mb-12 text-center max-w-2xl mx-auto ${isVisible ? "animate-fade-in-up stagger-1" : "opacity-0"}`}>
          Tell us about your project and we&apos;ll get back to you.
        </p>

        <div className={`flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 ${isVisible ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300"
              />
            </div>
            <div>
              <textarea
                placeholder="Describe your project — what do you need?"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2.5 w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3.5 px-7 rounded-lg text-base font-medium hover:bg-white/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : sent ? "Sent!" : "Send Message"}
              {!sending && !sent && <Send className="w-4 h-4" />}
            </button>
          </form>

          {/* Profile Card */}
          <div className="flex-shrink-0">
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
