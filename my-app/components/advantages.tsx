"use client"

import { Zap, Palette, TrendingUp } from "lucide-react"

export default function Advantages() {
  const advantages = [
    {
      icon: Zap,
      title: "Бързо зареждане",
      description: "Оптимизирани за максимална производителност и бързина",
    },
    {
      icon: Palette,
      title: "Модерен дизайн",
      description: "Последния визуални стандарти и требования на индустрията",
    },
    {
      icon: TrendingUp,
      title: "SEO резултати",
      description: "Доказани стратегии за повишаване на видимостта онлайн",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-25 blur transition duration-300" />
                <div className="relative p-8 rounded-lg bg-slate-900 border border-teal-500/20">
                  <Icon className="w-12 h-12 text-teal-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{advantage.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{advantage.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
