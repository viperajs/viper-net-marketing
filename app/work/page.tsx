import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WorkPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Работа & казуси</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Подбрани примери как увеличихме трафик, лийдове и продажби.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Искаш подобни резултати?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Нека обсъдим как можем да постигнем подобни или още по-добри резултати за твоя бизнес.
          </p>
          <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
            <Link href="/contact">Започни проекта си</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
