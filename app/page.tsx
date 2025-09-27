import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, TrendingUp, Users, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Network Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden network-bg">
        {/* Network Background SVG */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Network nodes */}
            <circle cx="200" cy="150" r="4" fill="#10b981" />
            <circle cx="400" cy="100" r="4" fill="#10b981" />
            <circle cx="600" cy="200" r="6" fill="#10b981" />
            <circle cx="800" cy="120" r="4" fill="#10b981" />
            <circle cx="1000" cy="180" r="4" fill="#10b981" />
            <circle cx="150" cy="350" r="4" fill="#10b981" />
            <circle cx="350" cy="300" r="6" fill="#10b981" />
            <circle cx="550" cy="400" r="4" fill="#10b981" />
            <circle cx="750" cy="350" r="4" fill="#10b981" />
            <circle cx="950" cy="420" r="4" fill="#10b981" />
            <circle cx="100" cy="550" r="4" fill="#10b981" />
            <circle cx="300" cy="500" r="4" fill="#10b981" />
            <circle cx="500" cy="600" r="6" fill="#10b981" />
            <circle cx="700" cy="550" r="4" fill="#10b981" />
            <circle cx="900" cy="620" r="4" fill="#10b981" />

            {/* Network connections */}
            <line x1="200" y1="150" x2="400" y2="100" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="400" y1="100" x2="600" y2="200" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="200" x2="800" y2="120" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="800" y1="120" x2="1000" y2="180" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="200" y1="150" x2="150" y2="350" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="400" y1="100" x2="350" y2="300" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="200" x2="550" y2="400" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="800" y1="120" x2="750" y2="350" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="1000" y1="180" x2="950" y2="420" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="150" y1="350" x2="300" y2="500" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="350" y1="300" x2="500" y2="600" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="550" y1="400" x2="700" y2="550" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="750" y1="350" x2="900" y2="620" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="350" y1="300" x2="550" y2="400" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="550" y1="400" x2="750" y2="350" stroke="#10b981" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Digital Marketing Agency
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Издигни бранда си с експертен дигитален маркетинг
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Помагаме на бизнеси да растат с данни, стратегия и креатив – от уеб присъствие до кампании, които носят
            реални резултати.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent bg-transparent"
            >
              <Link href="/services">Виж услугите</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Как помагаме</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <Search className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Трафик & видимост</h3>
                <p className="text-muted-foreground">SEO + реклами, които привличат качествена аудитория.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Маркиране & съдържание</h3>
                <p className="text-muted-foreground">Силни послания, съвременна визуална идентичност.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Конверсии & растеж</h3>
                <p className="text-muted-foreground">Целенасочени лендинги, имейл nurture, CRO.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Нашите услуги</h2>
            <p className="text-xl text-muted-foreground">Комплексни решения за дигитален маркетинг</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/services" className="group">
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Search className="w-8 h-8 text-emerald-400" />
                    <span className="text-lg font-semibold text-card-foreground">SEO & Content Marketing</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/services" className="group">
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                    <span className="text-lg font-semibold text-card-foreground">Performance Ads (Google, Meta)</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/services" className="group">
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Users className="w-8 h-8 text-emerald-400" />
                    <span className="text-lg font-semibold text-card-foreground">Social Media Management</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/services" className="group">
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Globe className="w-8 h-8 text-emerald-400" />
                    <span className="text-lg font-semibold text-card-foreground">Landing Pages & CRO</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/services" className="group md:col-span-2">
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 group-hover:shadow-lg">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-8 h-8 text-emerald-400" />
                    <span className="text-lg font-semibold text-card-foreground">Email Marketing & Automations</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              <Link href="/services">Виж всички услуги</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
