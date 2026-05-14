import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Leaf, Heart, BookOpen } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Seguridad Alimentaria",
    description: "Control total sobre el origen y calidad de lo que consumes. Alimentos frescos y libres de pesticidas.",
    number: "01"
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description: "Reducción de la huella de carbono al eliminar traslados de alimentos. Un paso hacia un futuro más verde.",
    number: "02"
  },
  {
    icon: Heart,
    title: "Salud Mental",
    description: "La jardinería es una actividad terapéutica reconocida que reduce los niveles de cortisol y estrés.",
    number: "03"
  },
  {
    icon: BookOpen,
    title: "Educación",
    description: "Fomenta la responsabilidad y el entendimiento del ciclo de la vida en niños y adultos.",
    number: "04"
  }
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Nuestros Beneficios</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            ¿Por qué necesitamos un huerto en casa?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            En un mundo cada vez más urbanizado, retomar el contacto con la tierra ofrece beneficios tangibles 
            para tu salud, tu bolsillo y el planeta.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-none bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <span className="text-5xl font-bold text-primary/20">{benefit.number}</span>
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
