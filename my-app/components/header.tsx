"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  isScrolled: boolean
}

export default function Header({ isScrolled }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: "Начало", href: "#home" },
    { label: "Услуги", href: "#services" },
    { label: "Проекти", href: "#projects" },
    { label: "Цени", href: "#pricing" },
    { label: "Контакти", href: "#contact" },
  ]

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-smooth ${
        isScrolled ? "bg-black/95 backdrop-blur-[0.5em] border-b border-[#1C1C1C]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#14B8A6] to-[#10B8A6] rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">Viper Net</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#E5E5E5] hover:text-[#14B8A6] transition-smooth text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:block">
            <button className="px-6 py-2.5 bg-[#14B8A6] text-white rounded-lg font-semibold transition-smooth hover:bg-[#10B8A6] hover:shadow-matte">
              Вземи оферта
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#E5E5E5] hover:text-[#14B8A6] transition-smooth py-2"
              >
                {link.label}
              </Link>
            ))}
            <button className="w-full mt-2 px-4 py-2 bg-[#14B8A6] text-white rounded-lg font-semibold transition-smooth hover:bg-[#10B8A6]">
              Вземи оферта
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
