"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Article {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  category: string
  verified: boolean
  read_time: string | null
  created_at: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Ciencia",
    read_time: ""
  })

  const supabase = createClient()

  const fetchArticles = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingArticle) {
      await supabase
        .from("articles")
        .update({
          title: formData.title,
          excerpt: formData.excerpt || null,
          content: formData.content || null,
          category: formData.category,
          read_time: formData.read_time || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingArticle.id)
    } else {
      await supabase
        .from("articles")
        .insert({
          title: formData.title,
          excerpt: formData.excerpt || null,
          content: formData.content || null,
          category: formData.category,
          read_time: formData.read_time || null,
          verified: false,
          created_by: user.id
        })
    }

    setIsDialogOpen(false)
    setEditingArticle(null)
    setFormData({ title: "", excerpt: "", content: "", category: "Ciencia", read_time: "" })
    fetchArticles()
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category,
      read_time: article.read_time || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return
    await supabase.from("articles").delete().eq("id", id)
    fetchArticles()
  }

  const openNewDialog = () => {
    setEditingArticle(null)
    setFormData({ title: "", excerpt: "", content: "", category: "Ciencia", read_time: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artículos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los artículos científicos de la plataforma.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Editar Artículo" : "Nuevo Artículo"}
              </DialogTitle>
              <DialogDescription>
                {editingArticle 
                  ? "Modifica los campos del artículo."
                  : "Completa los campos para crear un nuevo artículo."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título del artículo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Investigación">Investigación</SelectItem>
                      <SelectItem value="Ciencia">Ciencia</SelectItem>
                      <SelectItem value="Mitos">Mitos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read_time">Tiempo de lectura</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="ej: 5 min"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumen</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve descripción del artículo"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenido completo del artículo"
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title}>
                {editingArticle ? "Guardar Cambios" : "Crear Artículo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cargando artículos...
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay artículos. Crea el primero.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{article.category}</Badge>
                      <Badge variant={article.verified ? "default" : "secondary"}>
                        {article.verified ? "Verificado" : "Pendiente"}
                      </Badge>
                      <span className="text-xs">
                        {format(new Date(article.created_at), "d MMM yyyy", { locale: es })}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {article.excerpt && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
