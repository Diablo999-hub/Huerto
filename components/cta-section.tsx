"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance">
            Comienza tu huerto hoy
          </h2>
          {/* Intro paragraph removed per request */}

          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="h-14 px-8 rounded-full">
              <a href="/auth/sign-up">Comenzar</a>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full" asChild>
              <a href="#guia">Explorar Guías</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
