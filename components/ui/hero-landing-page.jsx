'use client'

import { ArrowRight } from 'lucide-react'

export function TuringLanding() {
  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = 80
      const targetPosition = element.offsetTop - headerHeight
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Video Background */}
      <video
        className="absolute -top-[20%] left-0 w-full h-[120%] object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://mybycketvercelprojecttest.s3.sa-east-1.amazonaws.com/animation-bg.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay to blend with site theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#130113]/60 via-transparent to-[#130113] z-[1]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[60px] flex flex-col items-center text-center w-full relative z-[2]">
        <h1 className="text-4xl sm:text-5xl lg:text-[80px] font-light leading-[1.1] mb-8 tracking-[-2px] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Accelerate your
          <br />
          digital growth
        </h1>
        <p className="text-lg leading-relaxed text-white/70 mb-12 font-normal max-w-[600px]">
          Trusted by businesses worldwide, we build modern websites
          and boost your online presence with intelligent solutions.
        </p>
        <div className="flex gap-5 items-center flex-wrap justify-center mb-16">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('contact')
            }}
            className="flex items-center gap-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3.5 px-7 rounded-lg text-base font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#our-process"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('our-process')
            }}
            className="bg-transparent text-white/70 py-3.5 px-7 text-base font-medium hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Learn more
          </a>
        </div>

        {/* Stats Section */}
        <div className="flex gap-12 lg:gap-20 items-center">
          <div className="text-center">
            <div className="text-5xl lg:text-[64px] font-light leading-none mb-3 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">4+</div>
            <div className="text-sm lg:text-base text-white/70 font-normal">Projects delivered</div>
          </div>
          <div className="text-center">
            <div className="text-5xl lg:text-[64px] font-light leading-none mb-3 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">100%</div>
            <div className="text-sm lg:text-base text-white/70 font-normal">Client satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
