"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Advantages from "@/components/advantages"
import OurProcess from "@/components/OurProcess"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import LightRays from "@/components/LightRays"

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
      <main className="min-h-screen relative overflow-hidden bg-black">
        {/* Animated background */}
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, backgroundColor: '#000000' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.0}
            distortion={0.0}
            className="custom-rays"
          />
        </div>
        
        <Header isScrolled={isScrolled} />
        <Hero />
        <Services />
        <Advantages />
        <OurProcess />
        <Projects />
        <Contact />
        <Footer />
      </main>
    )
  }


