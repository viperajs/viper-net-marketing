"use client"

import { Code, Search, ShoppingCart, Wrench } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Уеб дизайн",
      description: "Модерни, привлекателни дизайни, оптимизирани за всички устройства",
    },
    {
      icon: Search,
      title: "SEO оптимизация",
      description: "Повишете видимостта си в търсачките и привлекете повече клиенти",
    },
    {
      icon: ShoppingCart,
      title: "Онлайн магазини",
      description: "完пълни е-commerce решения с интегриране на платежни системи",
    },
    {
      icon: Wrench,
      title: "Поддръжка и хостинг",
      description: "Надеждна техническа поддръжка и сигурен хостинг 24/7",
    },
  ]

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Нашите услуги</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Предоставяме комплексни дигитални решения за развитието на вашия бизнес
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-teal-500/10 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-teal-500/10 group-hover:bg-teal-500/20 transition-all">
                  <Icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
