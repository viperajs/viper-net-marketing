import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Users, Globe, Mail, BarChart3, Target, Zap, FileText, Settings } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Услуги, които движат резултати</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Избираме правилните канали и изграждаме система – от стратегия до изпълнение.
          </p>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* SEO & Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Search className="w-10 h-10 text-emerald-400" />
                <h2 className="text-3xl font-bold">SEO & Content</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Одит, стратегия, on-page, линк билд, Authority съдържание.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Техническо SEO одитиране и оптимизация</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keyword research и конкурентен анализ</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>On-page оптимизация и структуриране</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Link building и authority съдържание</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Локално SEO за местни бизнеси</span>
                </li>
              </ul>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Content Strategy</h4>
                    <p className="text-sm text-muted-foreground">Стратегическо планиране</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Analytics</h4>
                    <p className="text-sm text-muted-foreground">Проследяване на резултати</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Targeting</h4>
                    <p className="text-sm text-muted-foreground">Точно насочване</p>
                  </div>
                  <div className="text-center">
                    <Settings className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Optimization</h4>
                    <p className="text-sm text-muted-foreground">Непрекъсната оптимизация</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Ads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-card border-border lg:order-1">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Google Ads</h4>
                    <p className="text-sm text-muted-foreground">Search & Display</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Meta Ads</h4>
                    <p className="text-sm text-muted-foreground">Facebook & Instagram</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Remarketing</h4>
                    <p className="text-sm text-muted-foreground">Повторно насочване</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">A/B Testing</h4>
                    <p className="text-sm text-muted-foreground">Тестване и оптимизация</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="lg:order-2">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-10 h-10 text-emerald-400" />
                <h2 className="text-3xl font-bold">Performance Ads</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Google/Meta кампании, ремаркетинг, фийдове, A/B тестове.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Google Ads кампании (Search, Display, Shopping)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Facebook и Instagram реклами</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ремаркетинг кампании и фунии</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Product feeds и динамични реклами</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>A/B тестване и оптимизация на ROI</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          

          {/* Landing Pages & CRO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-card border-border lg:order-1">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Landing Pages</h4>
                    <p className="text-sm text-muted-foreground">Конвертиращи страници</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">CRO</h4>
                    <p className="text-sm text-muted-foreground">Оптимизация на конверсии</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">A/B Testing</h4>
                    <p className="text-sm text-muted-foreground">Тестване на хипотези</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">UX/UI</h4>
                    <p className="text-sm text-muted-foreground">Потребителски опит</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="lg:order-2">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-10 h-10 text-emerald-400" />
                <h2 className="text-3xl font-bold">Landing Pages & CRO</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Страници за кампании, хипотези, тестване и оптимизация.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Дизайн и разработка на landing pages</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Conversion Rate Optimization (CRO)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>A/B тестване на елементи и хипотези</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>UX/UI анализ и подобрения</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Funnel оптимизация и проследяване</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Email & Automations */}
          
        </div>
      </section>

      {/* Global CTA */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Готов за следващото ниво?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Нека обсъдим как можем да помогнем на твоя бизнес да расте с правилните маркетинг решения.
          </p>
          <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
            <Link href="/contact">Поискай безплатна консултация</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
