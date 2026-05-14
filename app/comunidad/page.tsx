"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MessageCircle, User, CheckCircle2, Clock, Search, Plus, Award, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Question {
  id: string
  title: string
  content: string
  category: string
  is_answered: boolean
  views_count: number
  created_at: string
  user_id: string
  profiles: {
    display_name: string
    role: string
    cedula_profesional: string | null
    especialidad: string | null
    expert_approved: boolean
  }
  answers: { count: number }[]
}

const categoryLabels: Record<string, string> = {
  remedios: "Remedios Naturales",
  medicamentos: "Medicamentos",
  plantas: "Plantas Medicinales",
  nutricion: "Nutrición",
  general: "General"
}

const categoryColors: Record<string, string> = {
  remedios: "bg-green-100 text-green-800",
  medicamentos: "bg-blue-100 text-blue-800",
  plantas: "bg-emerald-100 text-emerald-800",
  nutricion: "bg-orange-100 text-orange-800",
  general: "bg-gray-100 text-gray-800"
}

export default function ComunidadPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch questions
      const { data: questionsData, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && questionsData && questionsData.length > 0) {
        // Fetch profiles for all question authors
        const authorIds = [...new Set(questionsData.map(q => q.user_id))]
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, role, cedula_profesional, especialidad, expert_approved")
          .in("id", authorIds)

        // Fetch answer counts
        const questionIds = questionsData.map(q => q.id)
        const { data: answerCounts } = await supabase
          .from("answers")
          .select("question_id")
          .in("question_id", questionIds)

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
        const countMap = new Map<string, number>()
        answerCounts?.forEach(a => {
          countMap.set(a.question_id, (countMap.get(a.question_id) || 0) + 1)
        })

        const questionsWithData = questionsData.map(q => ({
          ...q,
          profiles: profileMap.get(q.user_id) || { display_name: "Usuario", expert_approved: false },
          answers: [{ count: countMap.get(q.id) || 0 }]
        }))
        
        setQuestions(questionsWithData as Question[])
      } else {
        setQuestions([])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Comunidad Huerto en Casa
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pregunta sobre remedios, medicamentos y plantas medicinales. 
              Nuestros expertos verificados te ayudarán con información confiable.
            </p>
          </div>

          {/* Expert Badge Info */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Respuestas de Expertos Verificados</p>
                    <p className="text-sm text-muted-foreground">
                      Los expertos tienen su cédula profesional verificada por la SEP
                    </p>
                  </div>
                </div>
                {user ? (
                  <Button variant="outline" asChild>
                    <Link href="/comunidad/ser-experto">
                      <Shield className="w-4 h-4 mr-2" />
                      Solicitar ser Experto
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">
                      Inicia sesión para participar
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="remedios">Remedios Naturales</SelectItem>
                <SelectItem value="medicamentos">Medicamentos</SelectItem>
                <SelectItem value="plantas">Plantas Medicinales</SelectItem>
                <SelectItem value="nutricion">Nutrición</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            {user && (
              <Button asChild>
                <Link href="/comunidad/nueva-pregunta">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Pregunta
                </Link>
              </Button>
            )}
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay preguntas todavía</h3>
                <p className="text-muted-foreground mb-4">
                  Sé el primero en hacer una pregunta a nuestra comunidad
                </p>
                {user && (
                  <Button asChild>
                    <Link href="/comunidad/nueva-pregunta">Hacer una pregunta</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Link key={question.id} href={`/comunidad/pregunta/${question.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryColors[question.category]}>
                              {categoryLabels[question.category]}
                            </Badge>
                            {question.is_answered && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Respondida
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {question.title}
                          </CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {question.content}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {question.profiles?.expert_approved ? (
                              <Award className="w-4 h-4 text-primary" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span>{question.profiles?.display_name || "Usuario"}</span>
                            {question.profiles?.expert_approved && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Experto
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.answers?.[0]?.count || 0} respuestas</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDistanceToNow(new Date(question.created_at), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
