"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { BookOpen, Search, ExternalLink, Calendar, Users, Loader2, FlaskConical, ArrowRight } from "lucide-react"

interface Article {
  id: string
  title: string
  author_display: string[]
  journal: string
  publication_date: string
  abstract?: string
  article_type?: string
  score?: number
}

const plantTopics = [
  { value: "tomato", label: "Tomate", query: "tomato health benefits" },
  { value: "mint", label: "Menta", query: "mint medicinal properties" },
  { value: "aloe", label: "Aloe Vera", query: "aloe vera therapeutic" },
  { value: "lettuce", label: "Lechuga", query: "lettuce nutrition health" },
  { value: "basil", label: "Albahaca", query: "basil medicinal" },
  { value: "rosemary", label: "Romero", query: "rosemary therapeutic" },
  { value: "chamomile", label: "Manzanilla", query: "chamomile medicinal" },
  { value: "garlic", label: "Ajo", query: "garlic health benefits" },
  { value: "ginger", label: "Jengibre", query: "ginger medicinal" },
  { value: "turmeric", label: "Cúrcuma", query: "turmeric health" },
]

export default function ArticulosPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState("tomato")
  const [customSearch, setCustomSearch] = useState("")
  const [searchMode, setSearchMode] = useState<"topic" | "custom">("topic")
  const [totalResults, setTotalResults] = useState(0)

  async function fetchArticles(query: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/articles?query=${encodeURIComponent(query)}&rows=12`)
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalResults(data.total || 0)
    } catch (error) {
      console.error("Error fetching articles:", error)
      setArticles([])
    }
    setLoading(false)
  }

  useEffect(() => {
    const topic = plantTopics.find(t => t.value === selectedTopic)
    if (topic) {
      fetchArticles(topic.query)
    }
  }, [selectedTopic])

  function handleCustomSearch(e: React.FormEvent) {
    e.preventDefault()
    if (customSearch.trim()) {
      setSearchMode("custom")
      fetchArticles(customSearch)
    }
  }

  function handleTopicChange(value: string) {
    setSelectedTopic(value)
    setSearchMode("topic")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <FlaskConical className="w-3 h-3 mr-1" />
              Investigación Científica
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Artículos Científicos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora investigaciones científicas verificadas sobre plantas medicinales y sus beneficios para la salud.
              Todos los artículos provienen de PLOS (Public Library of Science).
            </p>
          </div>

          {/* Search Controls */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Topic selector */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Buscar por planta
                  </label>
                  <Select value={selectedTopic} onValueChange={handleTopicChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una planta" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantTopics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom search */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    O busca por término personalizado
                  </label>
                  <form onSubmit={handleCustomSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ej: diabetes, antioxidantes, inflamación..."
                        value={customSearch}
                        onChange={(e) => setCustomSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit">
                      Buscar
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {loading ? (
                "Buscando artículos..."
              ) : (
                <>
                  Mostrando <span className="font-medium text-foreground">{articles.length}</span> de{" "}
                  <span className="font-medium text-foreground">{totalResults.toLocaleString()}</span> artículos
                  {searchMode === "topic" && (
                    <> sobre <span className="font-medium text-foreground">{plantTopics.find(t => t.value === selectedTopic)?.label}</span></>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron artículos</h3>
                <p className="text-muted-foreground">
                  Intenta con otro término de búsqueda o selecciona otra planta.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.article_type || "Research Article"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-3 leading-snug">
                      {article.title}
                    </CardTitle>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {article.author_display?.slice(0, 2).join(", ")}
                          {article.author_display?.length > 2 && ` +${article.author_display.length - 2} más`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(article.publication_date).toLocaleDateString("es-MX", { 
                          year: "numeric", 
                          month: "long" 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{article.journal}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {article.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {article.abstract}
                      </p>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                      <a 
                        href={`https://doi.org/${article.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Leer artículo completo
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info section */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-2">Fuente de información verificada</h3>
                  <p className="text-muted-foreground">
                    Todos los artículos mostrados provienen de PLOS (Public Library of Science), 
                    una organización sin fines de lucro que publica investigación científica revisada por pares 
                    y de acceso abierto. Esto garantiza que la información es confiable y verificable.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="https://plos.org" target="_blank" rel="noopener noreferrer">
                    Visitar PLOS
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
