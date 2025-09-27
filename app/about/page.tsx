import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, MessageSquare, Zap, Eye } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Viper Net – партньор за дългосрочен растеж
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Company Description */}
          <div className="mb-16">
            <p className="text-xl text-muted-foreground leading-relaxed text-balance">
              Ние сме малък, фокусиран екип по дигитален маркетинг. Работим с ясни цели, прозрачни данни и бързо
              изпълнение. Без празни обещания – само измерими резултати.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">Нашите ценности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Value 1 */}
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Данни пред мнения</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Всяко решение базираме на конкретни данни и метрики. Не гадаем – измерваме, анализираме и
                    оптимизираме на база реални резултати.
                  </p>
                </CardContent>
              </Card>

              {/* Value 2 */}
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Ясна комуникация</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Говорим директно и разбираемо. Редовни отчети, прозрачни процеси и винаги сме на разположение за
                    въпроси и обратна връзка.
                  </p>
                </CardContent>
              </Card>

              {/* Value 3 */}
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Бързи тестове, бързи уроци</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Предпочитаме малки, бързи експерименти пред дълги планирания. Тестваме хипотези, учим се от
                    резултатите и адаптираме стратегията.
                  </p>
                </CardContent>
              </Card>

              {/* Value 4 */}
              <Card className="bg-card border-border hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Креатив + перфекционизъм в детайлите</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Съчетаваме креативно мислене с внимание към детайлите. Всяка кампания, всеки текст и всяка страница
                    са обмислени до най-малкия елемент.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Approach */}
          <div className="text-center">
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-12">
                <h2 className="text-2xl font-bold mb-6 text-card-foreground">Нашият подход</h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Работим като продължение на твоя екип. Не сме просто изпълнители – сме стратегически партньори, които
                  разбират бизнеса ти и се ангажират с дългосрочния му успех. Всеки проект е възможност да създадем нещо
                  значимо заедно.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
              <p className="text-muted-foreground">Успешни проекта</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">3+</div>
              <p className="text-muted-foreground">Години опит</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">24ч</div>
              <p className="text-muted-foreground">Време за отговор</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
