import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Готов ли си за растеж?</h2>
          <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-foreground">Viper Net</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Дигитална маркетинг агенция, която помага на бизнеси да растат с данни, стратегия и креатив.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Социални мрежи</h3>
            <div className="space-y-2">
              <a
                href="#DISCORD_LINK#"
                className="flex items-center text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                Discord
              </a>
              <a
                href="#TWITTER_LINK#"
                className="flex items-center text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                Twitter/X
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">© 2025 Viper Net. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  )
}
