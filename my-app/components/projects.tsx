"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export default function Projects() {
  const projects = [
    {
      title: "E-commerce платформа",
      category: "Онлайн магазин",
      image: "/modern-ecommerce-website.png",
    },
    {
      title: "SaaS решение",
      category: "Корпоративна платформа",
      image: "/modern-saas-dashboard.png",
    },
    {
      title: "Брендинг уебсайт",
      category: "Корпоративен портал",
      image: "/professional-corporate-website.png",
    },
    {
      title: "Мобилно приложение",
      category: "iOS & Android",
      image: "/mobile-app-interface.png",
    },
    {
      title: "Маркетинг платформа",
      category: "Дигитален маркетинг",
      image: "/marketing-analytics-dashboard.jpg",
    },
    {
      title: "Портфолио сайт",
      category: "Творчески проект",
      image: "/creative-portfolio-website.png",
    },
  ]

  return (
    null
  )
}
