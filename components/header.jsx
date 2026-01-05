"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Briefcase, Mail, Globe } from "lucide-react"
import CardNav from "./CardNav"

export default function Header({ isScrolled }) {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const sections = ["home", "services", "websites", "contact"]
    
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const headerHeight = 80
      
      // Check if we're at the bottom (for contact section) - more lenient check
      if (scrollPosition + windowHeight >= documentHeight - 200) {
        setActiveSection("contact")
        return
      }

      // Find which section is currently in the viewport
      let activeSection = "home"
      let maxVisibility = 0

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const sectionTop = rect.top + scrollPosition
          const sectionBottom = sectionTop + rect.height
          
          // Check if section is visible in viewport (with header offset)
          const viewportTop = scrollPosition + headerHeight
          const viewportBottom = scrollPosition + windowHeight
          
          // Calculate how much of the section is visible
          const visibleTop = Math.max(sectionTop, viewportTop)
          const visibleBottom = Math.min(sectionBottom, viewportBottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibility = visibleHeight / rect.height
          
          // Prefer sections that are more visible and in the upper part of viewport
          if (visibility > 0.3 && rect.top < windowHeight * 0.7) {
            if (visibility > maxVisibility) {
              maxVisibility = visibility
              activeSection = sectionId
            }
          }
        }
      })

      // If no section is clearly visible, check which one is closest to top
      if (maxVisibility < 0.3) {
        let bestSection = "home"
        let bestScore = -Infinity

        sections.forEach((sectionId) => {
          const element = document.getElementById(sectionId)
          if (element) {
            const rect = element.getBoundingClientRect()
            const sectionTop = rect.top
            const sectionBottom = rect.bottom
            
            // Score based on how much is visible and position
            let score = 0
            
            if (sectionTop < windowHeight && sectionBottom > headerHeight) {
              const visibleTop = Math.max(sectionTop, headerHeight)
              const visibleBottom = Math.min(sectionBottom, windowHeight)
              const visibleHeight = Math.max(0, visibleBottom - visibleTop)
              score = visibleHeight / rect.height
              
              // Bonus for sections near the top
              if (sectionTop < windowHeight * 0.5) {
                score += 0.5
              }
            }
            
            if (score > bestScore) {
              bestScore = score
              bestSection = sectionId
            }
          }
        })

        activeSection = bestSection
      }

      setActiveSection(activeSection)
    }

    // Initial check
    updateActiveSection()

    // Listen to scroll events
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    
    // Also check on resize
    window.addEventListener("resize", updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [])

  const navLinks = [
    { label: "Home", href: "#home", icon: Home },
    { label: "Services", href: "#services", icon: Briefcase },
    { label: "Websites", href: "#websites", icon: Globe },
    { label: "Contact", href: "#contact", icon: Mail },
  ]

  const cardNavItems = [
    {
      label: "Home",
      bgColor: "#0a0a0a",
      textColor: "#fff",
      links: [
        { label: "Go to Home", href: "#home", ariaLabel: "Go to Home section" },
      ],
    },
    {
      label: "Services",
      bgColor: "#0a0a0a",
      textColor: "#fff",
      links: [
        { label: "View Services", href: "#services", ariaLabel: "View our services" },
      ],
    },
    {
      label: "Websites",
      bgColor: "#0a0a0a",
      textColor: "#fff",
      links: [
        { label: "View Websites", href: "#websites", ariaLabel: "View our websites" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#0a0a0a",
      textColor: "#fff",
      links: [
        { label: "Get in Touch", href: "#contact", ariaLabel: "Contact us" },
      ],
    },
  ]

  return (
    <>
      {/* Mobile CardNav */}
      <CardNav
        items={cardNavItems}
        baseColor="#000"
        menuColor="#fff"
        buttonBgColor="#111"
        buttonTextColor="#fff"
      />

      <header
        className={`hidden md:block fixed w-full top-0 z-50 transition-smooth ${
          isScrolled ? "bg-black/60 backdrop-blur-md border-b border-white/20" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110 group-hover:bg-white/30">
                <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">V</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Viper Net</span>
            </Link>

          {/* Desktop Pill Navigation */}
          <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            {navLinks.map((link) => {
              const IconComponent = link.icon
              const sectionId = link.href.replace("#", "")
              const isActive = activeSection === sectionId
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    // Immediately set active section when clicking
                    setActiveSection(sectionId)
                    
                    // Smooth scroll to section
                    e.preventDefault()
                    const targetElement = document.getElementById(sectionId)
                    if (targetElement) {
                      const headerHeight = 80
                      const targetPosition = targetElement.offsetTop - headerHeight
                      
                      window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                      })
                      
                      // Update active section after scroll completes
                      setTimeout(() => {
                        setActiveSection(sectionId)
                      }, 500)
                    }
                  }}
                  className={`
                    group relative flex items-center gap-2 px-4 py-2 rounded-full
                    transition-all duration-300 text-sm font-medium
                    ${isActive 
                      ? "bg-white/20 text-white shadow-lg shadow-white/10" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {IconComponent && (
                    <IconComponent 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? "text-white" : "text-white/70 group-hover:text-white"
                      }`} 
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 animate-pulse-slow" />
                  )}
                </Link>
              )
            })}
          </nav>


          </div>
        </div>
      </header>
    </>
  )
}


