"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Advantages from "@/components/advantages"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-animated"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15)_0%,transparent_60%)] animate-pulse-slow"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.12)_0%,transparent_60%)] animate-pulse-slow" 
          style={{ animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.08)_0%,transparent_70%)] animate-float" 
          style={{ animationDuration: '8s' }}
        ></div>
      </div>
      
      <Header isScrolled={isScrolled} />
      <Hero />
      <Services />
      <Advantages />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

