"use client"

import { useEffect, useRef } from "react"

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    const nodes = []
    const nodeCount = 30

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = "rgba(20, 184, 166, 0.05)"
      ctx.lineWidth = 1

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(20, 184, 166, 0.1)"
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x
          const dy = nodes[j].y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-block animate-fade-in-down">
          <span className="px-4 py-2 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-sm font-medium animate-pulse-slow">
            Digital solutions for your business
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up stagger-1">
          Building{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#10B8A6] animate-float">
            modern websites
          </span>{" "}
          at affordable prices
        </h1>

        <p className="text-lg sm:text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
          Transform your business with professional web solutions, SEO optimization, and digital marketing
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <button className="px-8 py-4 border-2 border-[#14B8A6] text-[#14B8A6] rounded-lg font-bold transition-all duration-300 hover:bg-[#14B8A6]/10 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}


