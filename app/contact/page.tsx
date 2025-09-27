"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Clock, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    budget: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Свържи се с Viper Net</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Кажи ни набързо какъв е бизнесът ти и целта ти – ще се върнем с идея и стъпки.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            

            {/* Contact Info and Social */}
            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 text-card-foreground">Информация за контакт</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">Имейл</p>
                        <p className="font-medium text-card-foreground">hello@vipernet.io</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-muted-foreground">Време за отговор</p>
                        <p className="font-medium text-card-foreground">до 24ч (в работни дни)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 text-card-foreground">Свържи се в социалните</h3>
                  <div className="space-y-4">
                    {/* Discord */}
                    <a
                      href="#DISCORD_LINK#"
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-emerald-500/50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground group-hover:text-emerald-400 transition-colors">
                          Discord
                        </h4>
                        <p className="text-sm text-muted-foreground">Присъедини се към нашата общност</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:border-emerald-500 hover:text-emerald-400 bg-transparent"
                      >
                        Join Discord
                      </Button>
                    </a>

                    {/* Twitter/X */}
                    <a
                      href="#TWITTER_LINK#"
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-emerald-500/50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground group-hover:text-emerald-400 transition-colors">
                          Twitter/X
                        </h4>
                        <p className="text-sm text-muted-foreground">Следи ни за актуализации и съвети</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:border-emerald-500 hover:text-emerald-400 bg-transparent"
                      >
                        Follow on X
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-4 text-card-foreground">Какво да очакваш?</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Отговор в рамките на 24 часа</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Безплатна първоначална консултация</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Персонализирано предложение за твоя бизнес</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ясен план за следващите стъпки</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
