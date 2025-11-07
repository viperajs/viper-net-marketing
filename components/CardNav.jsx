"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const CardNav = ({
  items = [],
  className = "",
  baseColor = "#000",
  menuColor = "#fff",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef(null)
  const contentRef = useRef(null)

  const calculateHeight = () => {
    if (!contentRef.current) return 60
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile && contentRef.current) {
      const topBar = 60
      const padding = 16
      const contentHeight = contentRef.current.scrollHeight
      return topBar + contentHeight + padding
    }
    return 60
  }

  const toggleMenu = () => {
    if (!isExpanded) {
      setIsHamburgerOpen(true)
      setIsExpanded(true)
    } else {
      closeMenu()
    }
  }

  const closeMenu = () => {
    setIsHamburgerOpen(false)
    setIsExpanded(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (navRef.current && isExpanded) {
        const newHeight = calculateHeight()
        navRef.current.style.height = `${newHeight}px`
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isExpanded])

  useEffect(() => {
    if (navRef.current) {
      if (isExpanded) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          const height = calculateHeight()
          if (navRef.current) {
            navRef.current.style.height = `${height}px`
          }
        }, 10)
      } else {
        navRef.current.style.height = "60px"
      }
    }
  }, [isExpanded])

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:hidden ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} block p-0 rounded-xl shadow-md relative overflow-hidden transition-[height] duration-400 ease-out will-change-[height]`}
        style={{ backgroundColor: baseColor, height: "60px" }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-all duration-300 ease-linear ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-all duration-300 ease-linear ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>

          <div className="logo-container flex items-center order-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[#14B8A6] to-[#10B8A6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] transition-all duration-300 ${
            isExpanded ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] transform transition-all duration-400 ease-out"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
                transform: isExpanded ? "translateY(0)" : "translateY(50px)",
                opacity: isExpanded ? 1 : 0,
                transitionDelay: `${idx * 80}ms`,
              }}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => (
                  <Link
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px]"
                    href={lnk.href || "#"}
                    aria-label={lnk.ariaLabel || lnk.label}
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenu()
                      // Smooth scroll to section
                      const targetId = lnk.href.replace("#", "")
                      const targetElement = document.getElementById(targetId)
                      if (targetElement) {
                        setTimeout(() => {
                          targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
                        }, 100)
                      }
                    }}
                  >
                    <ArrowUpRight className="nav-card-link-icon shrink-0 w-4 h-4" aria-hidden="true" />
                    {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default CardNav

