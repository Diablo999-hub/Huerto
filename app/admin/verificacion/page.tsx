"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Clock,
  FileText,
  AlertTriangle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Source {
  title: string
  url: string
  author?: string
}

interface Article {
  id: string
  title: string
  excerpt: string | null
  category: string
  verified: boolean
  read_time: string | null
  sources: Source[]
  created_at: string
}

export default function VerificationPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending")
  
  const supabase = createClient()

  const fetchArticles = async () => {
    setLoading(true)
    let query = supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })

    if (filter === "pending") {
      query = query.eq("verified", false)
    } else if (filter === "verified") {
      query = query.eq("verified", true)
    }

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [filter])

  const handleVerify = async (articleId: string, verified: boolean) => {
    const { error } = await supabase
      .from("articles")
      .update({ verified, updated_at: new Date().toISOString() })
      .eq("id", articleId)

    if (!error) {
      setArticles(prev => 
        prev.map(a => a.id === articleId ? { ...a, verified } : a)
      )
    }
  }

  const pendingCount = articles.filter(a => !a.verified).length
  const verifiedCount = articles.filter(a => a.verified).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verificación de Fuentes</h1>
        <p className="text-muted-foreground mt-2">
          Revisa y valida las fuentes científicas de cada artículo antes de su publicación.
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Pendientes
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="verified" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Verificados
            <Badge variant="secondary" className="ml-1">{verifiedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando artículos...
            </div>
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {filter === "pending" 
                    ? "No hay artículos pendientes de verificación."
                    : filter === "verified"
                    ? "No hay artículos verificados."
                    : "No hay artículos disponibles."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <Badge variant={article.verified ? "default" : "secondary"}>
                            {article.verified ? "Verificado" : "Pendiente"}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Badge variant="outline">{article.category}</Badge>
                          </span>
                          {article.read_time && (
                            <span className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {article.read_time}
                            </span>
                          )}
                          <span className="text-xs">
                            {format(new Date(article.created_at), "d MMM yyyy", { locale: es })}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!article.verified ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleVerify(article.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerify(article.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Revocar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {article.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                      
                      {article.sources && article.sources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Fuentes Científicas:</h4>
                          <div className="space-y-2">
                            {article.sources.map((source, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              >
                                <div>
                                  <p className="text-sm font-medium">{source.title}</p>
                                  {source.author && (
                                    <p className="text-xs text-muted-foreground">{source.author}</p>
                                  )}
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!article.sources || article.sources.length === 0) && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Este artículo no tiene fuentes registradas.</span>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
