"use client"

import { useEffect, useRef, useState } from "react"

export default function OurProcess() {
  const [visibleItems, setVisibleItems] = useState([])
  const sectionRef = useRef(null)

  const steps = [
    {
      number: 1,
      text: "We start by understanding your business, target audience, and goals. Then we create an online strategy that truly works for you."
    },
    {
      number: 2,
      text: "We build a visual concept and user interface that combine style and functionality — fully aligned with your brand identity."
    },
    {
      number: 3,
      text: "We bring the design to life using modern technologies. Our team integrates content management systems, online stores, payment gateways, and more."
    },
    {
      number: 4,
      text: "Before launch, we test the site for speed, security, and mobile compatibility. After going live, we provide ongoing support and optimization."
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
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
  }, [])

  return (
    <section id="our-process" className="py-20 px-4 sm:px-6 lg:px-8 relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Steps */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              HOW WE MAKE A SITE
            </h2>
            
            <div className="space-y-8">
              {steps.map((step, index) => {
                const isVisible = visibleItems.includes(index)
                return (
                  <div
                    key={step.number}
                    className={`flex items-start gap-6 ${
                      isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Number Square */}
                    <div className="flex-shrink-0 w-16 h-16 border-2 border-white/40 rounded-lg flex items-center justify-center bg-white/5 backdrop-blur-sm">
                      <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                        {step.number}
                      </span>
                    </div>
                    
                    {/* Step Text */}
                    <div className="flex-1 pt-2">
                      <p className="text-white/90 leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              We design and develop websites that work — fast, secure, and easy to use.
              Our approach blends strategy, design, and technology to help you stand out online.
              No templates. No guesswork. Just results that move your business forward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

