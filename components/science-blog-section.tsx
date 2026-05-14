"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Beaker, ExternalLink, Loader2 } from "lucide-react"
import useSWR from "swr"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Article {
  id: string
  title: string
  abstract: string
  authors: string[]
  date: string
  journal: string
  plant: string
  url: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ScienceBlogSection() {
  const { data, isLoading, error } = useSWR<{ articles: Article[] }>("/api/articles", fetcher)

  const plantColors: Record<string, string> = {
    Tomate: "bg-red-100 text-red-700",
    Menta: "bg-emerald-100 text-emerald-700",
    Lechuga: "bg-lime-100 text-lime-700",
    "Aloe Vera": "bg-green-100 text-green-700",
    Manzanilla: "bg-amber-100 text-amber-700",
    Ajo: "bg-purple-100 text-purple-700",
  }

  return (
    <section id="ciencia" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Artículos Científicos</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Investigación sobre Plantas y Salud
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Artículos científicos recientes de PLOS sobre los beneficios de las plantas que cultivamos.
              Información basada en investigaciones revisadas por pares.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="self-start md:self-auto rounded-full border-primary/30 hover:bg-primary/5"
            asChild
          >
            <a href="https://plos.org" target="_blank" rel="noopener noreferrer">
              Ver más en PLOS
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Cargando artículos científicos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No se pudieron cargar los artículos. Intente más tarde.</p>
          </div>
        )}

        {/* Articles Grid */}
        {data?.articles && data.articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full border-none bg-card shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${plantColors[article.plant] || "bg-primary/10 text-primary"}`}>
                        {article.plant}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.journal}</span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                      {article.abstract || "Artículo científico sobre los beneficios y propiedades de esta planta."}
                    </p>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        {article.authors.length > 0 
                          ? article.authors.slice(0, 2).join(", ") + (article.authors.length > 2 ? " et al." : "")
                          : "Autores varios"
                        }
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {format(new Date(article.date), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        {/* Scientific Disclaimer */}
        <div className="mt-12 p-6 rounded-2xl bg-card border border-border flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Beaker className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Fuente: PLOS (Public Library of Science)</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Los artículos mostrados provienen de PLOS, una organización sin fines de lucro que publica 
              investigación científica de acceso abierto. Todos los estudios han sido revisados por pares.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
