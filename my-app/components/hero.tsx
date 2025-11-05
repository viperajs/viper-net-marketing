"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
    }

    const nodes: Node[] = []
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
      ctx!.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx!.fillRect(0, 0, width, height)

      ctx!.strokeStyle = "rgba(20, 184, 166, 0.08)"
      ctx!.lineWidth = 1

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx!.beginPath()
        ctx!.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = "rgba(20, 184, 166, 0.2)"
        ctx!.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x
          const dy = nodes[j].y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx!.beginPath()
            ctx!.moveTo(node.x, node.y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
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

      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-[#0A0A0A]/90" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-sm font-medium">
            Дигитални решения за вашия бизнес
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Изработка на{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#10B8A6]">
            модерни сайтове
          </span>{" "}
          на достъпни цени
        </h1>

        <p className="text-lg sm:text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto leading-relaxed">
          Преобразете вашия бизнес с професионални уеб решения, SEO оптимизация и дигитален маркетинг
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-[#14B8A6] text-white rounded-lg font-bold transition-smooth hover:bg-[#10B8A6] hover:shadow-matte flex items-center justify-center gap-2 group">
            Вземи оферта
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
          </button>
          <button className="px-8 py-4 border-2 border-[#14B8A6] text-[#14B8A6] rounded-lg font-bold transition-smooth hover:bg-[#14B8A6]/10">
            Научи повече
          </button>
        </div>
      </div>
    </section>
  )
}
