"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { TuringLanding } from "@/components/ui/hero-landing-page"
import Services from "@/components/services"
import Advantages from "@/components/advantages"
import OurProcess from "@/components/OurProcess"
import Projects from "@/components/projects"
import Websites from "@/components/websites"
import Reviews from "@/components/reviews"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import LightPillar from "@/components/ui/LightPillar"

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
      <main className="min-h-screen relative overflow-hidden bg-[#130113]">
        {/* Animated background */}
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, backgroundColor: '#130113' }}>
          <LightPillar
            topColor="#220e71"
            bottomColor="#130113"
            intensity={1}
            rotationSpeed={0.3}
            glowAmount={0.002}
            pillarWidth={3}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={25}
            interactive={false}
            mixBlendMode="screen"
            quality="high"
          />
        </div>
        
        <Header isScrolled={isScrolled} />
        <TuringLanding />
        <Services />
        <Advantages />
        <OurProcess />
        <Projects />
        <Websites />
        <Reviews />
        <Contact />
        <Footer />
      </main>
    )
  }


