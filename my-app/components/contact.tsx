"use client"

import { useState } from "react"

import type React from "react"
import { Twitter } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setFormData({ name: "", email: "", message: "" })
    alert("Благодаря за вашето съобщение! Ще се свържем с вас скоро.")
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Свържете се с нас</h2>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Последвайте ни в X за новини, оферти и проекти.
        </p>

        <a
          href="https://x.com/vipernet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00b5ad] to-[#00d4c4] text-white rounded-lg font-bold hover:shadow-lg hover:shadow-[#00b5ad]/50 transition-all hover:scale-105"
        >
          <Twitter size={24} />
          Последвайте ни в X
        </a>
      </div>
    </section>
  )
}
