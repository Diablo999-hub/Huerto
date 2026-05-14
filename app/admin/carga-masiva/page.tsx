"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileJson, CheckCircle, AlertTriangle, X, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ArticleJSON {
  title: string
  excerpt?: string
  content?: string
  category: "Investigación" | "Ciencia" | "Mitos"
  read_time?: string
  sources?: { title: string; url: string; author?: string }[]
}

interface UploadResult {
  success: number
  failed: number
  errors: string[]
}

export default function BulkUploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState<ArticleJSON[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const supabase = createClient()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/json") {
      processFile(droppedFile)
    } else {
      setParseError("Por favor, sube un archivo JSON válido.")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const processFile = async (file: File) => {
    setFile(file)
    setParseError(null)
    setUploadResult(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!Array.isArray(data)) {
        throw new Error("El archivo debe contener un array de artículos.")
      }

      // Validate structure
      for (let i = 0; i < data.length; i++) {
        const article = data[i]
        if (!article.title) {
          throw new Error(`Artículo ${i + 1}: falta el campo 'title'.`)
        }
        if (!article.category || !["Investigación", "Ciencia", "Mitos"].includes(article.category)) {
          throw new Error(`Artículo ${i + 1}: categoría inválida. Debe ser 'Investigación', 'Ciencia' o 'Mitos'.`)
        }
      }

      setJsonData(data)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Error al procesar el archivo.")
      setJsonData(null)
    }
  }

  const handleUpload = async () => {
    if (!jsonData || !file) return

    setIsUploading(true)
    const result: UploadResult = { success: 0, failed: 0, errors: [] }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No autenticado")

      // Record the bulk upload
      const { data: uploadRecord } = await supabase
        .from("bulk_uploads")
        .insert({
          uploaded_by: user.id,
          file_name: file.name,
          record_count: jsonData.length,
          status: "processing"
        })
        .select()
        .single()

      // Insert articles one by one to track errors
      for (let i = 0; i < jsonData.length; i++) {
        const article = jsonData[i]
        const { error } = await supabase
          .from("articles")
          .insert({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            read_time: article.read_time,
            sources: article.sources || [],
            verified: false,
            created_by: user.id
          })

        if (error) {
          result.failed++
          result.errors.push(`Artículo "${article.title}": ${error.message}`)
        } else {
          result.success++
        }
      }

      // Update upload record status
      if (uploadRecord) {
        await supabase
          .from("bulk_uploads")
          .update({ 
            status: result.failed === 0 ? "completed" : "completed",
            error_message: result.errors.length > 0 ? result.errors.join("; ") : null
          })
          .eq("id", uploadRecord.id)
      }

      setUploadResult(result)
    } catch (error) {
      setUploadResult({
        success: 0,
        failed: jsonData.length,
        errors: [error instanceof Error ? error.message : "Error desconocido"]
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setJsonData(null)
    setParseError(null)
    setUploadResult(null)
  }

  const sampleJSON = [
    {
      title: "Beneficios de la Manzanilla",
      excerpt: "Descubre las propiedades medicinales comprobadas de la manzanilla.",
      content: "La manzanilla (Matricaria chamomilla) ha sido utilizada...",
      category: "Ciencia",
      read_time: "5 min",
      sources: [
        { title: "Journal of Ethnopharmacology", url: "https://example.com", author: "Smith et al." }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Carga Masiva de Datos</h1>
        <p className="text-muted-foreground mt-2">
          Importa múltiples artículos científicos mediante archivos JSON estructurados.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subir Archivo JSON</CardTitle>
            <CardDescription>
              Arrastra un archivo o haz clic para seleccionarlo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium">
                    Arrastra tu archivo JSON aquí
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    o haz clic para seleccionar
                  </p>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileJson className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {parseError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error de validación</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}

            {jsonData && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Archivo válido</AlertTitle>
                <AlertDescription>
                  Se encontraron {jsonData.length} artículo(s) listos para importar.
                </AlertDescription>
              </Alert>
            )}

            {uploadResult && (
              <Alert variant={uploadResult.failed === 0 ? "default" : "destructive"}>
                {uploadResult.failed === 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>Resultado de la carga</AlertTitle>
                <AlertDescription>
                  <p>Exitosos: {uploadResult.success} | Fallidos: {uploadResult.failed}</p>
                  {uploadResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm list-disc list-inside">
                      {uploadResult.errors.slice(0, 3).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                      {uploadResult.errors.length > 3 && (
                        <li>...y {uploadResult.errors.length - 3} errores más</li>
                      )}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!jsonData || isUploading}
              className="w-full"
            >
              {isUploading ? "Importando..." : "Importar Artículos"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formato Esperado</CardTitle>
            <CardDescription>
              Estructura JSON requerida para la importación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-foreground">
                {JSON.stringify(sampleJSON, null, 2)}
              </pre>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Campos requeridos:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>title</Badge>
                  <span className="text-muted-foreground">Título del artículo (obligatorio)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>category</Badge>
                  <span className="text-muted-foreground">Investigación, Ciencia o Mitos</span>
                </div>
              </div>

              <h4 className="font-medium mt-4">Campos opcionales:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">excerpt</Badge>
                  <span className="text-muted-foreground">Resumen breve</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">content</Badge>
                  <span className="text-muted-foreground">Contenido completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">read_time</Badge>
                  <span className="text-muted-foreground">Tiempo de lectura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">sources</Badge>
                  <span className="text-muted-foreground">Array de fuentes científicas</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <a 
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sampleJSON, null, 2))}`}
                download="plantilla-articulos.json"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
