"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, User, Award, CheckCircle2, Clock, Loader2, AlertCircle, ThumbsUp, Shield, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Profile {
  display_name: string
  role: string
  cedula_profesional: string | null
  especialidad: string | null
  institucion: string | null
  expert_approved: boolean
}

interface Question {
  id: string
  title: string
  content: string
  category: string
  is_answered: boolean
  created_at: string
  user_id: string
  profiles: Profile
}

interface Answer {
  id: string
  content: string
  is_expert_answer: boolean
  is_accepted: boolean
  helpful_count: number
  created_at: string
  user_id: string
  profiles: Profile
}

const categoryLabels: Record<string, string> = {
  remedios: "Remedios Naturales",
  medicamentos: "Medicamentos",
  plantas: "Plantas Medicinales",
  nutricion: "Nutrición",
  general: "General"
}

export default function PreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const isAdmin = userProfile?.role === "admin"

  async function handleDeleteQuestion() {
    setDeleting(true)
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id)
    
    if (!error) {
      window.location.href = "/comunidad"
    } else {
      setError("Error al eliminar la pregunta")
      setDeleting(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setUserProfile(profile)
      }

      // Fetch question
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .eq("id", id)
        .single()

      if (questionData) {
        // Fetch question author profile separately
        const { data: authorProfile } = await supabase
          .from("profiles")
          .select("display_name, role, cedula_profesional, especialidad, institucion, expert_approved")
          .eq("id", questionData.user_id)
          .single()
        
        setQuestion({ ...questionData, profiles: authorProfile } as Question)
      }

      // Fetch answers
      const { data: answersData, error: answersError } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", id)
        .order("is_expert_answer", { ascending: false })
        .order("helpful_count", { ascending: false })
        .order("created_at", { ascending: true })

      if (answersData && answersData.length > 0) {
        // Fetch profiles for all answer authors
        const authorIds = [...new Set(answersData.map(a => a.user_id))]
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, role, cedula_profesional, especialidad, institucion, expert_approved")
          .in("id", authorIds)

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
        const answersWithProfiles = answersData.map(answer => ({
          ...answer,
          profiles: profileMap.get(answer.user_id) || null
        }))
        
        setAnswers(answersWithProfiles as Answer[])
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!newAnswer.trim()) return
    
    setSubmitting(true)
    setError("")

    const isExpert = userProfile?.role === "expert" && userProfile?.expert_approved

    const { data, error: insertError } = await supabase
      .from("answers")
      .insert({
        question_id: id,
        user_id: user.id,
        content: newAnswer,
        is_expert_answer: isExpert
      })
      .select("*")
      .single()

    if (insertError) {
      setError(`Error al publicar la respuesta: ${insertError.message}`)
      setSubmitting(false)
      return
    }

    // Add the answer with profile data
    const answerWithProfile = {
      ...data,
      profiles: userProfile
    }
    setAnswers(prev => [...prev, answerWithProfile as Answer])
    setNewAnswer("")
    setSubmitting(false)

    // Mark question as answered if expert
    if (isExpert) {
      await supabase
        .from("questions")
        .update({ is_answered: true })
        .eq("id", id)
      
      if (question) {
        setQuestion({ ...question, is_answered: true })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Pregunta no encontrada</h1>
          <Button asChild className="mt-4">
            <Link href="/comunidad">Volver a la comunidad</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/comunidad" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la comunidad
          </Link>

          {/* Question */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {categoryLabels[question.category]}
                  </Badge>
                  {question.is_answered && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Respondida por experto
                    </Badge>
                  )}
                </div>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar pregunta</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente la pregunta y todas sus respuestas.
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteQuestion}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deleting}
                        >
                          {deleting ? "Eliminando..." : "Eliminar Pregunta"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <CardTitle className="text-2xl">{question.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  {question.profiles?.expert_approved ? (
                    <Award className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>{question.profiles?.display_name || "Usuario"}</span>
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
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{question.content}</p>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {answers.length} {answers.length === 1 ? "Respuesta" : "Respuestas"}
            </h2>

            {answers.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">
                    Aún no hay respuestas. Sé el primero en responder.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <Card 
                    key={answer.id} 
                    className={answer.is_expert_answer ? "border-primary border-2 bg-primary/5 shadow-md" : "border-border"}
                  >
                    <CardContent className="pt-6">
                      {answer.is_expert_answer ? (
                        <div className="flex items-center gap-3 mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-primary">Respuesta de Experto Verificado</p>
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Certificado
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mt-1">
                              {answer.profiles?.display_name} - {answer.profiles?.especialidad}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cédula Profesional: {answer.profiles?.cedula_profesional} | {answer.profiles?.institucion}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {answer.profiles?.display_name || "Usuario"}
                            </p>
                            <p className="text-xs text-muted-foreground">Miembro de la comunidad</p>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-foreground whitespace-pre-wrap mb-4">{answer.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{answer.helpful_count} útil</span>
                          </button>
                        </div>
                        <span>
                          {formatDistanceToNow(new Date(answer.created_at), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Answer Form */}
          {user ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tu Respuesta</CardTitle>
                {userProfile?.expert_approved && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Award className="w-4 h-4" />
                    Responderás como experto verificado
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Textarea
                    placeholder="Escribe tu respuesta..."
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                  <Button type="submit" disabled={submitting || !newAnswer.trim()}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Publicar Respuesta
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Inicia sesión para responder esta pregunta
                </p>
                <Button asChild>
                  <Link href={`/auth/login?redirect=/comunidad/pregunta/${id}`}>
                    Iniciar Sesión
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
