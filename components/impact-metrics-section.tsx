import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Sprout, Recycle, Leaf } from "lucide-react"

const metrics = [
  {
    icon: Droplets,
    value: "4",
    label: "métricas de impacto",
    description: "Agua ahorrada, cosechas, residuos orgánicos aprovechados y seguimiento de cuidados.",
  },
  {
    icon: Sprout,
    value: "1",
    label: "huerto más autónomo",
    description: "El sistema acompaña el cultivo en casa para reducir dependencia de traslados y compras impulsivas.",
  },
  {
    icon: Recycle,
    value: "0",
    label: "desperdicio evitado",
    description: "Promueve compostaje, reutilización de sustratos y mejor planificación de siembra.",
  },
  {
    icon: Leaf,
    value: "100%",
    label: "trazabilidad educativa",
    description: "Cada recomendación se apoya en guías y artículos para que sepas de dónde sale la información.",
  },
]

export function ImpactMetricsSection() {
  return (
    <section className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Impacto del sistema</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            ¿Qué medimos cuando hablamos de sostenibilidad?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            La plataforma no solo enseña a cultivar: también permite registrar acciones que muestran el impacto del huerto en casa sobre agua, residuos y hábitos de consumo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-border/60 bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-bold text-foreground">{metric.value}</span>
                  <span className="text-sm font-medium text-muted-foreground pb-1">{metric.label}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}