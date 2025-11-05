"use client"

import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#00b5ad]/10 bg-[#0e1525] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00b5ad] to-[#00d4c4] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-xl font-bold text-white">Viper Net</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Професионални дигитални решения за вашия бизнес</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2">
              {["Уеб дизайн", "SEO оптимизация", "Онлайн магазини", "Дигитален маркетинг", "Поддръжка и хостинг"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#00b5ad] transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              {["Начало", "Проекти", "За нас", "Блог"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-[#00b5ad] transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакти</h4>
            <div className="space-y-3">
              <a
                href="https://x.com/vipernet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#00b5ad] transition-colors text-sm"
              >
                <Twitter size={16} />
                @vipernet
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#00b5ad]/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {currentYear} Viper Net — Всички права запазени.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="p-2 rounded-lg bg-[#00b5ad]/10 text-[#00b5ad] hover:bg-[#00b5ad]/20 transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
